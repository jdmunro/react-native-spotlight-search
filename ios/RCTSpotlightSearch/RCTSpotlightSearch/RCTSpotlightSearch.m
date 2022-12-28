//
//  RCTSpotlightSearch.m
//  RCTSpotlightSearch
//
//  Created by James Munro on 21/06/2016.
//  Copyright © 2016 James Munro. All rights reserved.
//

@import CoreSpotlight;
@import MobileCoreServices;
#import <React/RCTBridge.h>
#import "RCTSpotlightSearch.h"
#import <React/RCTEventDispatcher.h>

static NSString *const kHandleContinueUserActivityNotification = @"handleContinueUserActivity";
static NSString *const kUserActivityKey = @"userActivity";
static NSString *const kSpotlightSearchItemTapped = @"spotlightSearchItemTapped";
static NSString * initialIdentifier = @"";

@interface RCTSpotlightSearch ()

@property (nonatomic, strong) id<NSObject> continueUserActivityObserver;
@property (nonatomic, strong) id<NSObject> bundleDidLoadObserver;
@property (nonatomic, assign) BOOL hasListeners;

@end

@implementation RCTSpotlightSearch
static NSString *initialIdentifier;

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (instancetype)init {
    if ((self = [super init])) {
        __weak typeof(self) weakSelf = self;
        _continueUserActivityObserver = [[NSNotificationCenter defaultCenter] addObserverForName:kHandleContinueUserActivityNotification
                                                                                          object:nil
                                                                                           queue:[NSOperationQueue mainQueue]
                                                                                      usingBlock:^(NSNotification * _Nonnull note) {
                                                                                          [weakSelf handleContinueUserActivity:note.userInfo[kUserActivityKey]];
                                                                                      }];
        _bundleDidLoadObserver = [[NSNotificationCenter defaultCenter] addObserverForName:RCTJavaScriptDidLoadNotification
                                                                                   object:nil
                                                                                    queue:[NSOperationQueue mainQueue]
                                                                               usingBlock:^(NSNotification * _Nonnull note) {
                                                                                   [weakSelf drainActivityQueue];
                                                                               }];
    }
    return self;
}

- (void)dealloc {
    [[[self class] activityQueue] removeAllObjects];
    
    [[NSNotificationCenter defaultCenter] removeObserver:_continueUserActivityObserver];
    [[NSNotificationCenter defaultCenter] removeObserver:_bundleDidLoadObserver];
}

+ (BOOL)requiresMainQueueSetup {
    return YES;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[kSpotlightSearchItemTapped];
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

- (void)startObserving {
    self.hasListeners = YES;
}

- (void)stopObserving {
    self.hasListeners = NO;
}

- (void)drainActivityQueue {
    NSMutableArray *activityQueue = [[self class] activityQueue];
    
    for (NSUserActivity *userActivity in activityQueue) {
        [self handleContinueUserActivity:userActivity];
    }
    
    [activityQueue removeAllObjects];
}

+ (NSMutableArray *)activityQueue {
    static NSMutableArray *activityQueue;
    static dispatch_once_t onceToken;
    
    dispatch_once(&onceToken, ^{
        activityQueue = [NSMutableArray array];
    });
    
    return activityQueue;
}

+ (void)handleContinueUserActivity:(NSUserActivity *)userActivity {
    [[NSNotificationCenter defaultCenter] postNotificationName:kHandleContinueUserActivityNotification
                                                        object:nil
                                                      userInfo:@{kUserActivityKey: userActivity}];
    [[[self class] activityQueue] addObject:userActivity];
}

- (void)handleContinueUserActivity:(NSUserActivity *)userActivity {
    NSString *uniqueItemIdentifier = userActivity.userInfo[CSSearchableItemActivityIdentifier];
    
    if (!uniqueItemIdentifier) {
        return;
    }

    initialIdentifier = uniqueItemIdentifier;
    
    if (!self.hasListeners) {
        return;
    }
    
    [self sendEventWithName:kSpotlightSearchItemTapped body:uniqueItemIdentifier];
}

RCT_EXPORT_METHOD(getInitialSearchItem:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve(initialIdentifier);
}

RCT_EXPORT_METHOD(indexItem:(NSDictionary *)item resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    return [self indexItems:@[item] resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(indexItems:(NSArray *)items resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    NSMutableArray *itemsToIndex = [NSMutableArray array];
    
    [items enumerateObjectsUsingBlock:^(NSDictionary *item, NSUInteger idx, BOOL * _Nonnull stop) {
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString*)kUTTypeJSON];
        attributeSet.title = item[@"title"];
        attributeSet.contentDescription = item[@"contentDescription"];
        attributeSet.keywords = item[@"keywords"];
        
        if (item[@"thumbnailName"]) {
            UIImage *image = [UIImage imageNamed:item[@"thumbnailName"]];
            attributeSet.thumbnailData = UIImagePNGRepresentation(image);
        } else if (item[@"thumbnailUri"]) {
            attributeSet.thumbnailURL = [NSURL fileURLWithPath:item[@"thumbnailUri"]];
        } else if (item[@"thumbnailData"]) {
            attributeSet.thumbnailData = 
                [[NSData alloc] initWithBase64EncodedString:item[@"thumbnailData"] options:0];
        }
        
        CSSearchableItem *searchableItem = [[CSSearchableItem alloc] initWithUniqueIdentifier:item[@"uniqueIdentifier"]
                                                                             domainIdentifier:item[@"domain"]
                                                                                 attributeSet:attributeSet];
        
        [itemsToIndex addObject:searchableItem];
    }];
    
    [[CSSearchableIndex defaultSearchableIndex] indexSearchableItems:itemsToIndex
                                                   completionHandler:^(NSError * _Nullable error) {
                                                       if (error) {
                                                           reject(nil, nil, error);
                                                       } else {
                                                           resolve(nil);
                                                       }
                                                   }];
}

RCT_EXPORT_METHOD(deleteItemsWithIdentifiers:(NSArray *)identifiers resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteSearchableItemsWithIdentifiers:identifiers
                                                                   completionHandler:^(NSError * _Nullable error) {
                                                                       if (error) {
                                                                           reject(nil, nil, error);
                                                                       } else {
                                                                           resolve(nil);
                                                                       }
                                                                   }];
}

RCT_EXPORT_METHOD(deleteItemsInDomains:(NSArray *)identifiers resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteSearchableItemsWithDomainIdentifiers:identifiers
                                                                         completionHandler:^(NSError * _Nullable error) {
                                                                             if (error) {
                                                                                 reject(nil, nil, error);
                                                                             } else {
                                                                                 resolve(nil);
                                                                             }
                                                                         }];
}

RCT_REMAP_METHOD(deleteAllItems, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteAllSearchableItemsWithCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            reject(nil, nil, error);
        } else {
            resolve(nil);
        }
    }];
}

@end


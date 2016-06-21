//
//  RCTSpotlightSearch.m
//  RCTSpotlightSearch
//
//  Created by James Munro on 21/06/2016.
//  Copyright © 2016 James Munro. All rights reserved.
//

@import CoreSpotlight;
@import MobileCoreServices;
#import "RCTBridge.h"
#import "RCTSpotlightSearch.h"

static NSString *const kHandleContinueUserActivityNotification = @"handleContinueUserActivity";
static NSString *const kUserActivityKey = @"userActivity";

@interface RCTSpotlightSearch ()

@property (nonatomic, strong) id<NSObject> continueUserActivityObserver;
@property (nonatomic, strong) id<NSObject> bundleDidLoadObserver;
@property (nonatomic, copy) RCTResponseSenderBlock onSearchItemWasTappedCallback;

@end

@implementation RCTSpotlightSearch

RCT_EXPORT_MODULE();

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
    [[NSNotificationCenter defaultCenter] removeObserver:_continueUserActivityObserver];
    [[NSNotificationCenter defaultCenter] removeObserver:_bundleDidLoadObserver];
}

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
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
    if (!self.onSearchItemWasTappedCallback) {
        return;
    }
    self.onSearchItemWasTappedCallback(@[userActivity.userInfo[CSSearchableItemActivityIdentifier]]);
}

RCT_EXPORT_METHOD(indexItem:(NSDictionary *)itemEntry resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    return [self indexItems:@[itemEntry] resolver:resolve rejecter:reject];
}

RCT_EXPORT_METHOD(indexItems:(NSArray *)items resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSMutableArray *itemsToIndex = [NSMutableArray array];
    
    [items enumerateObjectsUsingBlock:^(NSDictionary *itemEntry, NSUInteger idx, BOOL * _Nonnull stop) {
        NSDictionary *item = itemEntry[@"item"];
        
        CSSearchableItemAttributeSet *attributeSet = [[CSSearchableItemAttributeSet alloc] initWithItemContentType:(NSString*)kUTTypeJSON];
        attributeSet.title = item[@"title"];
        attributeSet.contentDescription = item[@"contentDescription"];
        
        CSSearchableItem *searchableItem = [[CSSearchableItem alloc] initWithUniqueIdentifier:item[@"uniqueIdentifier"]
                                                                             domainIdentifier:itemEntry[@"domain"]
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

RCT_EXPORT_METHOD(deleteSearchableItemsWithIdentifiers:(NSArray *)identifiers resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteSearchableItemsWithIdentifiers:identifiers
                                                                   completionHandler:^(NSError * _Nullable error) {
                                                                       if (error) {
                                                                           reject(nil, nil, error);
                                                                       } else {
                                                                           resolve(nil);
                                                                       }
                                                                   }];
}

RCT_EXPORT_METHOD(deleteSearchableItemsWithDomainIdentifiers:(NSArray *)identifiers resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteSearchableItemsWithDomainIdentifiers:identifiers
                                                                         completionHandler:^(NSError * _Nullable error) {
                                                                             if (error) {
                                                                                 reject(nil, nil, error);
                                                                             } else {
                                                                                 resolve(nil);
                                                                             }
                                                                         }];
}

RCT_REMAP_METHOD(deleteAllSearchableItems, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    [[CSSearchableIndex defaultSearchableIndex] deleteAllSearchableItemsWithCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            reject(nil, nil, error);
        } else {
            resolve(nil);
        }
    }];
}

RCT_EXPORT_METHOD(setOnSearchItemWasTapped:(RCTResponseSenderBlock)callback)
{
    self.onSearchItemWasTappedCallback = callback;
}

@end


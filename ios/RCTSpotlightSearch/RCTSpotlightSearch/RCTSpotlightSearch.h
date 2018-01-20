//
//  RCTSpotlightSearch.h
//  RCTSpotlightSearch
//
//  Created by James (Home) on 21/06/2016.
//  Copyright © 2016 James Munro. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTSpotlightSearch : RCTEventEmitter <RCTBridgeModule>

+ (void)handleContinueUserActivity:(NSUserActivity *)userActivity;

@end

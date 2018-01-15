//
//  RCTSpotlightSearch.h
//  RCTSpotlightSearch
//
//  Created by James (Home) on 21/06/2016.
//  Copyright © 2016 James Munro. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCTSpotlightSearch : NSObject <RCTBridgeModule>

+ (void)handleContinueUserActivity:(NSUserActivity *)userActivity;

@end

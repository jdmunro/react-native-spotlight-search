import { NativeEventSubscription } from 'react-native'

type SpotlightItem = {
    title: string
    contentDescription?: string
    uniqueIdentifier: string
    domain: string
    thumbnailName?: string
    thumbnailData?: string
    keywords?: string[]
}

export function indexItems(items: SpotlightItem[]): Promise<void>

export function indexItem(item: SpotlightItem): Promise<void>

export function deleteItemsWithIdentifiers(itemIdentifiers: string[]): Promise<void>;

export function deleteItemsInDomains(itemDomains: string[]): Promise<void>;

export function deleteAllItems(): Promise<void>

export function searchItemTapped(callback: (uniqueIdentifier: string) => void): NativeEventSubscription;

export function getInitialSearchItem(): Promise<string>
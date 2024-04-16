export const WowRegions = ['EU', 'US', 'TW', 'KR', 'CN'] as const;
export type WowRegion = (typeof WowRegions)[number];

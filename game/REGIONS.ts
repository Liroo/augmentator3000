// All regions for WoW
const ALL_REGIONS = ['EU', 'US', 'TW', 'KR', 'CN'] as const;
export type Region = (typeof ALL_REGIONS)[number];

// WoWAnalyzer/Blizzard API supported regions
export const SUPPORTED_REGIONS = ['EU', 'US', 'TW', 'KR'];
type SupportedRegion = (typeof SUPPORTED_REGIONS)[number];

/**
 * Not every region is supported by the Blizzard API (and, by extension, the bits of the
 * WoWA API that use the Blizzard API). This is used to check that a region is supported before
 * sending a request.
 */
export function isSupportedRegion(
  region: string | undefined,
): region is SupportedRegion {
  // the 'as' below is just to allow the use of .includes
  return SUPPORTED_REGIONS.includes(region as SupportedRegion);
}

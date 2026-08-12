export interface BrandRanking {
  name: string;
  top20: string[]; // client numbers, in position order (index 0 = #1)
}

export interface RankingData {
  updatedAt: string; // ISO timestamp
  fileName?: string; // original excel filename, for display in /admin
  brands: BrandRanking[];
}

export interface BrandSummary {
  name: string;
  count: number; // how many client numbers loaded for this brand
}

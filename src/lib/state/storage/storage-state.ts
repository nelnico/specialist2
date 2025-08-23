import { siteConfig } from "@/lib/data/site-config";

export type SearchParams = Record<string, unknown>;

export type StorageState = {
  lastSearch: SearchParams | null;
  acceptedTerms: boolean;
  // add more fields over time
};

export const DEFAULT_STORAGE_STATE: StorageState = {
  lastSearch: null,
  acceptedTerms: false,
};

export const STORAGE_KEY = `${siteConfig.shortName}:storage`;

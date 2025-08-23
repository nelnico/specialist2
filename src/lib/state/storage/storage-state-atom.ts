"use client";
import {
  DEFAULT_STORAGE_STATE,
  STORAGE_KEY,
  StorageState,
} from "./storage-state";
import { atomWithStorage } from "jotai/utils";
export const storageStateAtom = atomWithStorage<StorageState>(
  STORAGE_KEY,
  DEFAULT_STORAGE_STATE,
  undefined, // use default localStorage adapter
  { getOnInit: true } // hydrate from storage immediately
);

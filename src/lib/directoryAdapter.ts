// Compatibility shim — directoryAdapter has been promoted to lib/dataSource.
// Existing imports continue to work; new code should import from
// "@/lib/dataSource" directly.
export {
  type DirectoryEntry,
  liveCompanyToEntry,
  mergeDirectory,
} from "@/lib/dataSource";

// Older callers used a hand-rolled LiveCompanyRow shape. Re-export the
// repository's CompanyRow under the legacy name for source compatibility.
export type { CompanyRow as LiveCompanyRow } from "@/repositories/companies";

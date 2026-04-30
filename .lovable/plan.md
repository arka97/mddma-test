## Goal
Drop the Bank Account Proof option from the KYC/verification flow. Keep GST, PAN and FSSAI as the supported documents.

## Changes

### Frontend (presentation only)
- `src/lib/kyc.ts`
  - Remove `"bank"` from the `KycDocType` union.
  - Remove `bank` entries from `DOC_LABEL`, `DOC_HELP`, and from the `latestByDocType` initializer.
  - Keep `bank_account_last4 / bank_ifsc / bank_holder_name` fields on the `KycSubmission` interface and `SubmitKycInput` (DB columns still exist, harmless and forward-compatible) — but they will no longer be written by the UI.
- `src/components/account/KYCDocsSection.tsx`
  - Remove `"bank"` from `DOC_ORDER`.
  - Remove bank-only state (`bankHolder`, `bankIfsc`, `bankLast4`) from `RowState`, `BLANK`, and the bank validation/submit branch.
  - Remove the bank-specific input block in the render (lines ~203–217).
- `src/lib/__tests__/kyc.test.ts`
  - Drop `"bank"` from the iterated doc types and the corresponding `result.bank` assertion.
- `src/pages/account/AdminModeration.tsx`
  - Remove the inline display of `bank_account_last4` / `bank_ifsc` (lines ~462–463). Existing rows without bank info render unchanged.

### Database
- No migration. The `bank_*` columns and any historical rows with `doc_type='bank'` stay in place (read-only legacy). This avoids destructive changes and keeps admin history intact.

## Out of scope
- Verification tier ladder (Email → Company → GST) is unchanged; bank was never part of tier promotion.
- No changes to `promote-verification` edge function.

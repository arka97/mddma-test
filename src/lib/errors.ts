// Map opaque/raw backend errors to safe, user-facing messages.
// We deliberately do NOT surface raw Postgres/Supabase strings (which can
// reveal table names, constraint names, or schema details).
type AnyError = { message?: string; code?: string } | null | undefined;

const CODE_MAP: Record<string, string> = {
  "23505": "This record already exists.",
  "23503": "This action references something that no longer exists.",
  "23502": "Some required information is missing.",
  "42501": "You don't have permission to perform this action.",
  PGRST301: "You don't have permission to perform this action.",
};

export function friendlyErrorMessage(err: AnyError, fallback = "Something went wrong. Please try again."): string {
  if (!err) return fallback;
  if (err.code && CODE_MAP[err.code]) return CODE_MAP[err.code];
  // Log raw details to console for developers; never show to user.
  if (err.message) console.error("[backend error]", err);
  return fallback;
}

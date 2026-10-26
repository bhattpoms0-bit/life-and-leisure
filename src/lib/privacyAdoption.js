// Shared by the build guard, function runtime and default UI availability.
// Approval applies to this exact version/date pair. No environment variable or
// customer payload can supply an approved notice to the deployed handler.
export function isPrivacyAdopted(notice, now = new Date()) {
  if (!notice || typeof notice !== 'object' || Array.isArray(notice) || notice.approved !== true) return false
  // Convention for a future owner-approved release, not an assigned version.
  if (typeof notice.version !== 'string' || notice.version !== notice.version.trim() || notice.version.length > 80 || !/^email-first-v[1-9][0-9]*$/.test(notice.version)) return false
  if (typeof notice.effectiveDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(notice.effectiveDate)) return false
  const date = new Date(`${notice.effectiveDate}T00:00:00Z`)
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== notice.effectiveDate) return false
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) return false
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return notice.effectiveDate <= today
}

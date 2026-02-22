/**
 * Recursively converts Firestore Timestamps and other non-serializable
 * objects into plain JSON-safe values so they can cross the
 * Server Component → Client Component boundary.
 */
export function serialize<T>(data: unknown): T {
  if (data === null || data === undefined) return data as T;

  // Firestore Timestamp: { _seconds, _nanoseconds }
  if (
    typeof data === 'object' &&
    data !== null &&
    '_seconds' in data &&
    '_nanoseconds' in data
  ) {
    return new Date(
      (data as { _seconds: number })._seconds * 1000
    ).toISOString() as T;
  }

  // Firestore Timestamp with toDate()
  if (
    typeof data === 'object' &&
    data !== null &&
    'toDate' in data &&
    typeof (data as { toDate: unknown }).toDate === 'function'
  ) {
    return ((data as { toDate: () => Date }).toDate().toISOString()) as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serialize(item)) as T;
  }

  if (typeof data === 'object' && data !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = serialize(value);
    }
    return result as T;
  }

  return data as T;
}

export type Result<T> =
  | { data: T; error: null }
  | { data: null; error: Error };

export async function safeAsync<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { data: await fn(), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

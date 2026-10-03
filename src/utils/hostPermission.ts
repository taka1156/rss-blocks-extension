function toOriginPattern(url: string): string | null {
  try {
    const { protocol, origin } = new URL(url);
    return protocol === 'http:' || protocol === 'https:' ? `${origin}/*` : null;
  } catch {
    return null;
  }
}

// Must be called synchronously from a user gesture (before other awaits) for the prompt to show.
export async function requestHostAccess(urls: string[]): Promise<boolean> {
  const origins = [...new Set(urls.map(toOriginPattern).filter((v): v is string => v !== null))];
  if (origins.length === 0) return true;
  try {
    return await browser.permissions.request({ origins });
  } catch {
    return false;
  }
}

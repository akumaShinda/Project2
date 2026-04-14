export interface StreamLinkLike {
  url: string;
  quality: string;
  type: 'direct' | 'stream' | 'embed';
}

const BLOCKED_HOST_KEYWORDS = [
  'ads',
  'adservice',
  'doubleclick',
  'googlesyndication',
  'popunder',
  'popup',
  'tracker',
  'tracking',
  'analytics',
  'exoclick',
];

const BLOCKED_PATH_KEYWORDS = ['popup', 'popunder', 'banner', '/ads/', 'redirect'];
const BLOCKED_QUERY_KEYS = ['ad', 'ads', 'popup', 'pop', 'track', 'tracker', 'redirect'];
const DEDUPE_SEPARATOR = '\u001F';

function normalizeStreamUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return trimmed;
}

export function isBlockedStreamUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();

    if (BLOCKED_HOST_KEYWORDS.some((keyword) => host.includes(keyword))) {
      return true;
    }

    if (BLOCKED_PATH_KEYWORDS.some((keyword) => path.includes(keyword))) {
      return true;
    }

    for (const key of BLOCKED_QUERY_KEYS) {
      if (parsed.searchParams.has(key)) {
        return true;
      }
    }

    return false;
  } catch {
    return true;
  }
}

export function sanitizeStreamLinks<T extends StreamLinkLike>(links: T[]): T[] {
  const unique = new Set<string>();
  const safeLinks: T[] = [];

  for (const link of links) {
    const normalizedUrl = normalizeStreamUrl(link.url);
    if (!normalizedUrl) continue;
    if (isBlockedStreamUrl(normalizedUrl)) continue;

    const dedupeKey = `${normalizedUrl}${DEDUPE_SEPARATOR}${link.quality}${DEDUPE_SEPARATOR}${link.type}`;
    if (unique.has(dedupeKey)) continue;
    unique.add(dedupeKey);

    safeLinks.push({
      ...link,
      url: normalizedUrl,
    });
  }

  return safeLinks;
}

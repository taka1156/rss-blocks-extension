import { beforeEach, describe, expect, it, vi } from 'vitest';
import { requestHostAccess } from './hostPermission';

const request = vi.fn();

describe('requestHostAccess', () => {
  beforeEach(() => {
    request.mockReset();
    request.mockResolvedValue(true);
    vi.stubGlobal('browser', { permissions: { request } });
  });

  it('requests unique origin patterns', async () => {
    const granted = await requestHostAccess([
      'https://a.example/feed.xml',
      'https://a.example/other',
      'http://b.example:8080/rss',
    ]);
    expect(granted).toBe(true);
    expect(request).toHaveBeenCalledWith({
      origins: ['https://a.example/*', 'http://b.example:8080/*'],
    });
  });

  it('skips invalid and non-http URLs without prompting', async () => {
    expect(await requestHostAccess(['not a url', 'ftp://x.example/a'])).toBe(true);
    expect(request).not.toHaveBeenCalled();
  });

  it('returns false when denied', async () => {
    request.mockResolvedValue(false);
    expect(await requestHostAccess(['https://a.example/'])).toBe(false);
  });

  it('returns false when the request throws', async () => {
    request.mockRejectedValue(new Error('no gesture'));
    expect(await requestHostAccess(['https://a.example/'])).toBe(false);
  });
});

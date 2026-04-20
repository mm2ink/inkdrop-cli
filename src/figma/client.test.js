const { figmaRequest, fetchFile, fetchLocalStyles } = require('./client');
const https = require('https');

jest.mock('https');

/**
 * Helper to mock an https.request response.
 */
function mockHttpsResponse(statusCode, body) {
  const mockRes = {
    statusCode,
    on: jest.fn((event, cb) => {
      if (event === 'data') cb(JSON.stringify(body));
      if (event === 'end') cb();
    }),
  };
  const mockReq = {
    on: jest.fn(),
    end: jest.fn(),
  };
  https.request.mockImplementation((options, callback) => {
    callback(mockRes);
    return mockReq;
  });
}

describe('figmaRequest', () => {
  it('resolves with parsed JSON on 200', async () => {
    mockHttpsResponse(200, { name: 'My File' });
    const result = await figmaRequest('/files/abc123', 'test-token');
    expect(result).toEqual({ name: 'My File' });
  });

  it('rejects with 403 error on invalid token', async () => {
    mockHttpsResponse(403, {});
    await expect(figmaRequest('/files/abc123', 'bad-token')).rejects.toThrow(
      'Invalid Figma token or insufficient permissions.'
    );
  });

  it('rejects with 404 error when resource not found', async () => {
    mockHttpsResponse(404, {});
    await expect(figmaRequest('/files/missing', 'token')).rejects.toThrow(
      'Figma resource not found'
    );
  });

  it('rejects on unexpected status code', async () => {
    mockHttpsResponse(500, {});
    await expect(figmaRequest('/files/abc', 'token')).rejects.toThrow(
      'Figma API error: HTTP 500'
    );
  });
});

describe('fetchFile', () => {
  it('throws if fileKey is missing', async () => {
    await expect(fetchFile('', 'token')).rejects.toThrow('fileKey is required.');
  });

  it('throws if token is missing', async () => {
    await expect(fetchFile('abc123', '')).rejects.toThrow('Figma token is required.');
  });

  it('returns file data on success', async () => {
    mockHttpsResponse(200, { document: {}, name: 'Tokens' });
    const result = await fetchFile('abc123', 'token');
    expect(result).toHaveProperty('name', 'Tokens');
  });
});

describe('fetchLocalStyles', () => {
  it('returns styles array from meta', async () => {
    mockHttpsResponse(200, { meta: { styles: [{ key: 's1', name: 'Primary' }] } });
    const styles = await fetchLocalStyles('abc123', 'token');
    expect(styles).toHaveLength(1);
    expect(styles[0].name).toBe('Primary');
  });

  it('returns empty array when meta.styles is absent', async () => {
    mockHttpsResponse(200, { meta: {} });
    const styles = await fetchLocalStyles('abc123', 'token');
    expect(styles).toEqual([]);
  });
});

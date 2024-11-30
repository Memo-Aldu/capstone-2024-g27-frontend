import reportWebVitals from './reportWebVitals';

describe('reportWebVitals', () => {
  const mockOnPerfEntry = jest.fn();

  beforeEach(() => {
    jest.resetModules();
  });

  it('calls the provided callback with performance metrics when onPerfEntry is a function', async () => {
    jest.doMock('web-vitals', () => ({
      getCLS: jest.fn((cb) => cb({ name: 'CLS', value: 0.1 })),
      getFID: jest.fn((cb) => cb({ name: 'FID', value: 100 })),
      getFCP: jest.fn((cb) => cb({ name: 'FCP', value: 2000 })),
      getLCP: jest.fn((cb) => cb({ name: 'LCP', value: 2500 })),
      getTTFB: jest.fn((cb) => cb({ name: 'TTFB', value: 50 }))
    }));

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    await reportWebVitals(mockOnPerfEntry);

    expect(getCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(getFID).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(getFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(getLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(getTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });

  it('does nothing when onPerfEntry is not provided', async () => {
    const result = reportWebVitals();
    expect(result).toBeUndefined();
  });

  it('does nothing when onPerfEntry is not a function', async () => {
    const result = reportWebVitals({} as any);
    expect(result).toBeUndefined();
  });

  it('handles errors during dynamic import of web-vitals', async () => {
    jest.doMock('web-vitals', () => {
      throw new Error('Dynamic import failed');
    });

    expect(() => reportWebVitals(mockOnPerfEntry)).not.toThrow();
  });
});

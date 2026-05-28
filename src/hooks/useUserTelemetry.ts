import { useState, useEffect, useCallback } from 'react';

export interface UserTelemetry {
  ipAddress: string;
  location: {
    country: string;
    region: string;
    city: string;
    timezone: string;
  };
  device: {
    os: string;
    browser: string;
    deviceType: 'desktop' | 'tablet' | 'mobile';
    screenResolution: string;
    language: string;
  };
  session: {
    startTime: Date;
    referrer: string;
    userAgent: string;
  };
}

interface IPResponse {
  status: string;
  message?: string;
  query: string;
  country_name: string;
  region_name: string;
  city: string;
  time_zone: string;
}

const getOS = (): string => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;

  if (/windows/i.test(userAgent)) return 'Windows';
  if (/macintosh/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  if (/android/i.test(userAgent)) return 'Android';
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  return platform || 'Unknown';
};

const getBrowser = (): string => {
  const userAgent = window.navigator.userAgent;
  if (/chrome|chromium/i.test(userAgent)) return 'Chrome';
  if (/firefox/i.test(userAgent)) return 'Firefox';
  if (/safari/i.test(userAgent)) return 'Safari';
  if (/edge|edg/i.test(userAgent)) return 'Edge';
  return 'Unknown';
};

const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
  const userAgent = window.navigator.userAgent;
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

export function useUserTelemetry() {
  const [telemetry, setTelemetry] = useState<UserTelemetry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectTelemetry = useCallback(async () => {
    try {
      // Get IP and location from ip-api.com (free, no API key required)
      const ipResponse = await fetch('http://ip-api.com/json/?fields=status,message,country,region,city,timezone,query');
      
      let ipData: IPResponse | null = null;
      if (ipResponse.ok) {
        const data = await ipResponse.json();
        if (data.status === 'success') {
          ipData = data;
        }
      }

      const telemetryData: UserTelemetry = {
        ipAddress: ipData?.query || 'Unknown',
        location: {
          country: ipData?.country_name || 'Unknown',
          region: ipData?.region_name || 'Unknown',
          city: ipData?.city || 'Unknown',
          timezone: ipData?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        device: {
          os: getOS(),
          browser: getBrowser(),
          deviceType: getDeviceType(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
        },
        session: {
          startTime: new Date(),
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
        },
      };

      setTelemetry(telemetryData);
      
      // Store in localStorage for persistence
      localStorage.setItem('pyar-telemetry', JSON.stringify({
        ...telemetryData,
        session: {
          ...telemetryData.session,
          startTime: telemetryData.session.startTime.toISOString(),
        },
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to collect telemetry');
      
      // Fallback to basic telemetry
      const basicTelemetry: UserTelemetry = {
        ipAddress: 'Unknown',
        location: {
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        device: {
          os: getOS(),
          browser: getBrowser(),
          deviceType: getDeviceType(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language,
        },
        session: {
          startTime: new Date(),
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
        },
      };
      
      setTelemetry(basicTelemetry);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    collectTelemetry();
  }, [collectTelemetry]);

  const clearTelemetry = useCallback(() => {
    localStorage.removeItem('pyar-telemetry');
    setTelemetry(null);
  }, []);

  return { telemetry, loading, error, refresh: collectTelemetry, clear: clearTelemetry };
}

// Utility function to get stored telemetry
export function getStoredTelemetry(): UserTelemetry | null {
  try {
    const stored = localStorage.getItem('pyar-telemetry');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        session: {
          ...parsed.session,
          startTime: new Date(parsed.session.startTime),
        },
      };
    }
  } catch {
    // Ignore parsing errors
  }
  return null;
}

// Utility to log user activity
export function logUserActivity(action: string, metadata?: Record<string, any>) {
  const activity = {
    timestamp: new Date().toISOString(),
    action,
    metadata,
    url: window.location.href,
  };

  // Get existing activities
  const activities = JSON.parse(localStorage.getItem('pyar-activities') || '[]');
  activities.push(activity);

  // Keep only last 100 activities
  const trimmed = activities.slice(-100);
  localStorage.setItem('pyar-activities', JSON.stringify(trimmed));

  return activity;
}

// Utility to get user activities
export function getUserActivities(): Array<{ timestamp: string; action: string; metadata?: Record<string, any>; url: string }> {
  try {
    return JSON.parse(localStorage.getItem('pyar-activities') || '[]');
  } catch {
    return [];
  }
}
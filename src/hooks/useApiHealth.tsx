import { useState, useEffect } from 'react';
import { healthAPI } from '@/services/api';

interface ApiHealthState {
  status: 'checking' | 'healthy' | 'unhealthy' | 'unknown';
  message?: string;
  version?: string;
  lastChecked?: Date;
}

export const useApiHealth = () => {
  const [health, setHealth] = useState<ApiHealthState>({
    status: 'checking'
  });

  const checkHealth = async () => {
    try {
      setHealth(prev => ({ ...prev, status: 'checking' }));
      const result = await healthAPI.check();
      setHealth({
        status: result.status,
        message: result.message,
        version: result.version,
        lastChecked: new Date()
      });
    } catch (error) {
      setHealth({
        status: 'unhealthy',
        message: 'Failed to connect to API',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes in background
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    ...health,
    isHealthy: health.status === 'healthy',
    isChecking: health.status === 'checking',
    recheckHealth: checkHealth
  };
};
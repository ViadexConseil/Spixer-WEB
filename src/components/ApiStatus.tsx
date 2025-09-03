import React from 'react';
import { useApiHealth } from '@/hooks/useApiHealth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

export const ApiStatus: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
  const { status, message, version, isHealthy, isChecking, recheckHealth, lastChecked } = useApiHealth();

  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'checking':
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'healthy':
        return 'default';
      case 'unhealthy':
        return 'destructive';
      case 'checking':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!showDetails) {
    return (
      <Badge variant={getStatusVariant()} className="gap-1">
        {getStatusIcon()}
        API {status}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">
          API Status: {status}
        </span>
      </div>
      
      {message && (
        <span className="text-xs text-muted-foreground">
          {message}
        </span>
      )}
      
      {version && (
        <Badge variant="outline" className="text-xs">
          v{version}
        </Badge>
      )}
      
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
      
      <Button
        size="sm"
        variant="ghost"
        onClick={recheckHealth}
        disabled={isChecking}
        className="h-6 px-2"
      >
        <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
};
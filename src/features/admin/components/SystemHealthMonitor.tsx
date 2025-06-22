
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Wifi, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  authentication: 'healthy' | 'warning' | 'error';
  apiResponse: number;
  lastChecked: Date;
}

const SystemHealthMonitor = () => {
  const [health, setHealth] = useState<SystemHealth>({
    database: 'healthy',
    authentication: 'healthy',
    apiResponse: 0,
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      // Test database connection
      const { error: dbError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      // Test auth status
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      const responseTime = Date.now() - startTime;
      
      setHealth({
        database: dbError ? 'error' : 'healthy',
        authentication: authError ? 'warning' : 'healthy',
        apiResponse: responseTime,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealth(prev => ({
        ...prev,
        database: 'error',
        lastChecked: new Date()
      }));
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    // Check every 5 minutes
    const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      case 'error': return 'text-red-500 bg-red-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Activity;
    }
  };

  const healthItems = [
    {
      label: 'Database',
      status: health.database,
      icon: Database,
      detail: health.database === 'healthy' ? 'Connected' : 'Connection issues'
    },
    {
      label: 'Authentication',
      status: health.authentication,
      icon: Wifi,
      detail: health.authentication === 'healthy' ? 'Working' : 'Service issues'
    },
    {
      label: 'API Response',
      status: health.apiResponse < 1000 ? 'healthy' : health.apiResponse < 3000 ? 'warning' : 'error',
      icon: Activity,
      detail: `${health.apiResponse}ms`
    }
  ];

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        </div>
        <Button
          onClick={checkSystemHealth}
          disabled={isChecking}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          Check
        </Button>
      </div>

      <div className="space-y-3">
        {healthItems.map((item) => {
          const StatusIcon = getStatusIcon(item.status);
          return (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{item.detail}</span>
                <Badge className={getStatusColor(item.status)}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {item.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Last checked: {health.lastChecked.toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
};

export default SystemHealthMonitor;

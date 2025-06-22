import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  Clock, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  BarChart3
} from "lucide-react";
import { performanceMonitor } from '@/shared/utils/performanceMonitor';
import { BundleOptimizer } from '@/shared/utils/performanceOptimizer';

interface PerformanceMetrics {
  componentRenders: Array<{
    componentName: string;
    renderTime: number;
    propsCount: number;
    timestamp: number;
  }>;
  bundleMetrics: {
    loadedChunks: string[];
    pendingPreloads: number;
    memoryUsage: any;
  };
  vitals: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  };
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    componentRenders: [],
    bundleMetrics: { loadedChunks: [], pendingPreloads: 0, memoryUsage: null },
    vitals: {}
  });
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Only show in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDevelopment || !autoRefresh) return;

    const interval = setInterval(() => {
      updateMetrics();
    }, 2000);

    return () => clearInterval(interval);
  }, [isDevelopment, autoRefresh]);

  const updateMetrics = () => {
    const bundleOptimizer = BundleOptimizer.getInstance();
    const performanceSummary = performanceMonitor.getPerformanceSummary();
    
    // Extract vitals from recent metrics
    const vitals: any = {};
    performanceSummary.recentMetrics.forEach(metric => {
      if (metric.name === 'largest_contentful_paint') vitals.lcp = metric.value;
      if (metric.name === 'first_input_delay') vitals.fid = metric.value;
      if (metric.name === 'first_contentful_paint') vitals.fcp = metric.value;
    });
    
    setMetrics({
      componentRenders: performanceSummary.componentMetrics.map(cm => ({
        componentName: cm.componentName,
        renderTime: cm.renderTime,
        propsCount: cm.propsCount,
        timestamp: Date.now()
      })),
      bundleMetrics: bundleOptimizer.getBundleMetrics(),
      vitals
    });
  };

  // Calculate performance scores
  const performanceScore = useMemo(() => {
    const { vitals } = metrics;
    let score = 100;
    
    // Deduct points based on Core Web Vitals
    if (vitals.lcp && vitals.lcp > 2500) score -= 20;
    if (vitals.fid && vitals.fid > 100) score -= 20;
    if (vitals.cls && vitals.cls > 0.1) score -= 20;
    
    // Deduct points for slow component renders
    const slowRenders = metrics.componentRenders.filter(r => r.renderTime > 16).length;
    score -= Math.min(slowRenders * 2, 40);
    
    return Math.max(score, 0);
  }, [metrics]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  // Get slowest components
  const slowestComponents = useMemo(() => {
    return metrics.componentRenders
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5);
  }, [metrics.componentRenders]);

  // Memory usage formatting
  const formatBytes = (bytes: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        size="sm"
        variant="outline"
      >
        <Activity className="h-4 w-4" />
      </Button>

      {/* Performance Dashboard */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto bg-background border rounded-lg shadow-xl">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Monitor
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    variant="ghost"
                    size="sm"
                  >
                    {autoRefresh ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    onClick={updateMetrics}
                    variant="ghost"
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Score */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getScoreIcon(performanceScore)}
                  <span className="font-medium">Performance Score</span>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(performanceScore)}`}>
                  {performanceScore}
                </div>
              </div>
              
              <Progress value={performanceScore} className="w-full" />

              {/* Core Web Vitals */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Core Web Vitals
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>LCP:</span>
                    <Badge variant={metrics.vitals.lcp && metrics.vitals.lcp > 2500 ? 'destructive' : 'default'}>
                      {metrics.vitals.lcp ? `${metrics.vitals.lcp.toFixed(0)}ms` : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>FID:</span>
                    <Badge variant={metrics.vitals.fid && metrics.vitals.fid > 100 ? 'destructive' : 'default'}>
                      {metrics.vitals.fid ? `${metrics.vitals.fid.toFixed(0)}ms` : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>CLS:</span>
                    <Badge variant={metrics.vitals.cls && metrics.vitals.cls > 0.1 ? 'destructive' : 'default'}>
                      {metrics.vitals.cls ? metrics.vitals.cls.toFixed(3) : 'N/A'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>FCP:</span>
                    <Badge variant={metrics.vitals.fcp && metrics.vitals.fcp > 1800 ? 'destructive' : 'default'}>
                      {metrics.vitals.fcp ? `${metrics.vitals.fcp.toFixed(0)}ms` : 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Bundle Information */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Bundle Metrics
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Loaded Chunks:</span>
                    <Badge variant="secondary">
                      {metrics.bundleMetrics.loadedChunks.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Preloads:</span>
                    <Badge variant="secondary">
                      {metrics.bundleMetrics.pendingPreloads}
                    </Badge>
                  </div>
                  {metrics.bundleMetrics.memoryUsage && (
                    <>
                      <div className="flex justify-between">
                        <span>JS Heap Used:</span>
                        <Badge variant="secondary">
                          {formatBytes(metrics.bundleMetrics.memoryUsage.usedJSHeapSize)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>JS Heap Total:</span>
                        <Badge variant="secondary">
                          {formatBytes(metrics.bundleMetrics.memoryUsage.totalJSHeapSize)}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Slowest Components */}
              {slowestComponents.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Slowest Components
                  </h4>
                  <div className="space-y-1">
                    {slowestComponents.map((component, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="truncate flex-1">{component.componentName}</span>
                        <Badge 
                          variant={component.renderTime > 16 ? 'destructive' : 'secondary'}
                          className="ml-2"
                        >
                          {component.renderTime.toFixed(1)}ms
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Warnings */}
              {performanceScore < 70 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Performance issues detected. Consider optimizing slow components and reducing bundle size.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PerformanceDashboard; 

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useDatabaseSecurity } from '@/hooks/useDatabaseSecurity';

const SecurityAuditPanel: React.FC = () => {
  const { 
    auditResult, 
    isAuditing, 
    runSecurityAudit, 
    hasSecurityIssues,
    securityScore 
  } = useDatabaseSecurity();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Database Security Audit</h3>
        </div>
        <Button
          onClick={runSecurityAudit}
          disabled={isAuditing}
          variant="outline"
          size="sm"
        >
          {isAuditing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Auditing...
            </>
          ) : (
            'Run Audit'
          )}
        </Button>
      </div>

      {auditResult && (
        <div className="space-y-4">
          {/* Security Score */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Security Score</span>
            <Badge variant={getScoreVariant(securityScore)}>
              {securityScore}/100
            </Badge>
          </div>
          <Progress value={securityScore} className="w-full" />

          {/* Critical Issues */}
          {auditResult.critical_issues.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical Issues Found:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {auditResult.critical_issues.map((issue, index) => (
                    <li key={index} className="text-sm">{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Warnings */}
          {auditResult.warnings.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warnings:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {auditResult.warnings.map((warning, index) => (
                    <li key={index} className="text-sm">{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* RLS Policy Status */}
          <div>
            <h4 className="text-sm font-medium mb-2">RLS Policy Status</h4>
            <div className="space-y-2">
              {auditResult.rls_policies.map((policy, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{policy.table_name}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={policy.security_level === 'high' ? 'default' : 'secondary'}
                    >
                      {policy.security_level}
                    </Badge>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {auditResult.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {auditResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!auditResult && !isAuditing && (
        <div className="text-center py-8 text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Click "Run Audit" to check database security</p>
        </div>
      )}
    </Card>
  );
};

export default SecurityAuditPanel;

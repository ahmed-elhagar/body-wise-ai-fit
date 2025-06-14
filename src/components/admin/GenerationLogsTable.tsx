
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GenerationLog {
  id: string;
  generation_type: string;
  status: string;
  user_id: string;
  created_at: string;
}

interface GenerationLogsTableProps {
  logs: GenerationLog[];
}

const GenerationLogsTable = ({ logs }: GenerationLogsTableProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Recent AI Generations</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">User ID</th>
              <th className="text-left py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="py-2">
                  <Badge variant="outline">{log.generation_type}</Badge>
                </td>
                <td className="py-2">
                  <Badge variant={log.status === 'completed' ? 'default' : 'destructive'}>
                    {log.status}
                  </Badge>
                </td>
                <td className="py-2 font-mono text-xs">{log.user_id.slice(0, 8)}...</td>
                <td className="py-2">{new Date(log.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default GenerationLogsTable;

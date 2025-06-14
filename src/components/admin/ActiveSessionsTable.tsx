
import { Card } from '@/components/ui/card';

interface ActiveSession {
  id: string;
  user_id: string;
  session_id: string;
  last_activity: string;
  user_agent: string | null;
}

interface ActiveSessionsTableProps {
  activeSessions: ActiveSession[];
}

const ActiveSessionsTable = ({ activeSessions }: ActiveSessionsTableProps) => {
  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">User ID</th>
              <th className="text-left py-2">Session ID</th>
              <th className="text-left py-2">Last Activity</th>
              <th className="text-left py-2">User Agent</th>
            </tr>
          </thead>
          <tbody>
            {activeSessions?.map((session) => (
              <tr key={session.id} className="border-b">
                <td className="py-2 font-mono text-xs">{session.user_id.slice(0, 8)}...</td>
                <td className="py-2 font-mono text-xs">{session.session_id.slice(0, 8)}...</td>
                <td className="py-2">{new Date(session.last_activity).toLocaleString()}</td>
                <td className="py-2 max-w-xs truncate">{session.user_agent || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ActiveSessionsTable;

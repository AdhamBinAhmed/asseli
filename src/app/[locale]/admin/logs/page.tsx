'use client';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface AuditLog {
  id: string;
  username: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // Calculate date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const q = query(
          collection(db, 'audit_logs'),
          where('timestamp', '>=', sevenDaysAgo.toISOString()),
          orderBy('timestamp', 'desc'),
          limit(100)
        );

        const querySnapshot = await getDocs(q);
        const logData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AuditLog[];
        
        setLogs(logData);
      } catch (e) {
        console.error(e);
        // Firebase index error could happen if we query by where and orderBy without composite index.
        // If it fails, fallback to simple query and filter in memory.
        try {
          const fallbackQ = query(collection(db, 'audit_logs'), limit(200));
          const snapshot = await getDocs(fallbackQ);
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as AuditLog[];
          
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const filtered = data
            .filter(d => new Date(d.timestamp) >= sevenDaysAgo)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            
          setLogs(filtered);
        } catch (err) {
          console.error("Fallback query failed:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Audit Logs</h1>
      <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">Showing activity from all admins in the last 7 days.</p>
      
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Admin</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium min-w-[200px]">Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">Loading logs...</td>
                </tr>
              )}
              
              {!isLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">No recent activity found.</td>
                </tr>
              )}

              {!isLoading && logs.map(log => (
                <tr key={log.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                  <td className="p-4 whitespace-nowrap text-xs md:text-sm text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <div className="font-semibold text-sm">{log.username}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">{log.role.replace('_', ' ')}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary font-medium text-xs rounded-md">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-xs md:text-sm break-words">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

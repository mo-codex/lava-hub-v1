import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { db, EmailDeliveryRecord } from '../../services/db.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { formatMogadishuTime } from '../../lib/utils.ts';

export function AdminEmailsPage() {
  const [emails, setEmails] = useState<EmailDeliveryRecord[]>([]);
  const [testEmail, setTestEmail] = useState('');
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    setEmails(db.getEmailDeliveries());
    return db.subscribe(() => {
      setEmails(db.getEmailDeliveries());
    });
  }, []);

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    db.recordEmailDelivery({
      recipientEmail: testEmail,
      eventType: 'admin_test_dispatch',
      subject: 'Resend Test Ping — Lava Hub Notification Pipeline',
      status: 'delivered',
      providerMessageId: `msg_test_${Date.now()}`,
    });

    setTestStatus(`Test message dispatched to ${testEmail}`);
    setTestEmail('');
    setTimeout(() => setTestStatus(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Transactional Email Logs (Resend)
          </h1>
          <p className="text-xs text-slate-500">
            Audit outbound verification, confirmation, waitlist offers, and session reminders with provider message IDs.
          </p>
        </div>
      </div>

      {/* Test Dispatch Form */}
      <Card className="p-4 bg-slate-50 dark:bg-slate-900">
        <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="email"
            placeholder="Send test delivery to email..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
          />
          <Button type="submit" size="sm" className="text-xs">
            <Send className="w-3.5 h-3.5 mr-1" />
            <span>Simulate Delivery</span>
          </Button>
          {testStatus && <span className="text-xs text-emerald-600 font-medium">{testStatus}</span>}
        </form>
      </Card>

      {/* Email Log Table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Recipient</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Provider Message ID</th>
              <th className="py-3 px-4">Timestamp (EAT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {emails.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No transactional email dispatches logged yet.
                </td>
              </tr>
            ) : (
              emails.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-900 dark:text-white">
                    {log.recipientEmail}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {log.eventType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200 max-w-xs truncate">
                    {log.subject}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {log.providerMessageId}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500">
                    {formatMogadishuTime(log.timestamp, { format: 'short' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

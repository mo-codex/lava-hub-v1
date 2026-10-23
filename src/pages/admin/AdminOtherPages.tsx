import React, { useState, useEffect } from 'react';
import { Mail, Users, Shield, CheckCircle2 } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Card } from '../../components/ui/Card.tsx';
import { formatMogadishuTime } from '../../lib/utils.ts';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState<{ id: string; name: string; email: string; message: string; date: string }[]>([]);

  useEffect(() => {
    setMessages(db.getContactMessages());
    return db.subscribe(() => {
      setMessages(db.getContactMessages());
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Inbound Contact Inquiries
        </h1>
        <p className="text-xs text-slate-500">
          Submissions received from the public Contact form.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No contact inquiries received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <Card key={msg.id} className="p-5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white">{msg.name} ({msg.email})</span>
                <span className="font-mono text-slate-400">{formatMogadishuTime(msg.date, { format: 'short' })}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
                {msg.message}
              </p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export function AdminCommunityPage() {
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; date: string }[]>([]);

  useEffect(() => {
    setSubscribers(db.getCommunitySubscribers());
    return db.subscribe(() => {
      setSubscribers(db.getCommunitySubscribers());
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Community Members
        </h1>
        <p className="text-xs text-slate-500">
          Youth and builders registered for community workshop announcements and updates.
        </p>
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Subscribed Date</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 text-xs">
                  No community subscribers recorded yet.
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 dark:text-white">{sub.email}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{formatMogadishuTime(sub.date, { format: 'short' })}</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">Active</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Admin Roles & Authorization (RBAC)
        </h1>
        <p className="text-xs text-slate-500">
          Default-deny permission model. Only explicitly authorized administrators may perform privileged operations.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
            Active Administrative Role: Super Admin
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Super Admins have full authorization across workshop lifecycle, attendance tracking, waitlist promotions, and configuration adjustments. Sensitive administrative mutations are recorded in the platform audit log.
        </p>
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  Calendar,
  Eye,
  Check,
  X,
  Clock,
  Video,
  Lock,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, WorkshopCategory, WorkshopStatus } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Input, Textarea, Select } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';

export function AdminWorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkshop, setEditingWorkshop] = useState<Partial<Workshop> | null>(null);

  useEffect(() => {
    setWorkshops(db.getWorkshops());
    return db.subscribe(() => {
      setWorkshops(db.getWorkshops());
    });
  }, []);

  const openCreateModal = () => {
    setEditingWorkshop({
      title: '',
      slug: '',
      category: 'React',
      summary: '',
      description: '',
      capacity: 30,
      startTime: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 86400000 * 7 + 7200000).toISOString().slice(0, 16),
      status: 'published', // Default to published so it shows on the public site immediately
      privateMeetingUrl: '',
      privateMeetingPassword: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (ws: Workshop) => {
    setEditingWorkshop({
      ...ws,
      startTime: new Date(ws.startTime).toISOString().slice(0, 16),
      endTime: new Date(ws.endTime).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop || !editingWorkshop.title) return;

    db.saveWorkshop({
      ...editingWorkshop,
      capacity: Number(editingWorkshop.capacity) || 30,
      startTime: new Date(editingWorkshop.startTime || Date.now()).toISOString(),
      endTime: new Date(editingWorkshop.endTime || Date.now()).toISOString(),
    });

    setIsModalOpen(false);
    setEditingWorkshop(null);
  };

  const handleTogglePublish = (ws: Workshop) => {
    const nextStatus: WorkshopStatus = ws.status === 'published' ? 'draft' : 'published';
    db.saveWorkshop({ id: ws.id, status: nextStatus });
  };

  const handleCancelWorkshop = (ws: Workshop) => {
    if (confirm(`Are you sure you want to cancel "${ws.title}"? This cohort will be marked as Cancelled on the public website.`)) {
      db.cancelWorkshop(ws.id);
    }
  };

  const handleDuplicate = (ws: Workshop) => {
    db.saveWorkshop({
      ...ws,
      id: undefined,
      title: `${ws.title} (New Cohort)`,
      slug: `${ws.slug}-cohort-${Date.now().toString().slice(-4)}`,
      status: 'published',
      confirmedCount: 0,
      waitlistCount: 0,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this workshop?')) {
      db.deleteWorkshop(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Workshop Management
          </h1>
          <p className="text-xs text-slate-500">
            Create cohorts, configure curriculum agendas, monitor capacity limits, and manage private video meeting links. All edits sync to the public site in real time.
          </p>
        </div>
        <Button onClick={openCreateModal} className="text-xs font-bold py-2 px-4">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Workshop</span>
        </Button>
      </div>

      {/* Workshop Table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Workshop</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Schedule (EAT)</th>
              <th className="py-3 px-4">Capacity</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {workshops.map((ws) => {
              const remaining = calculateRemainingSeats(ws.capacity, ws.confirmedCount);
              return (
                <tr key={ws.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{ws.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">slug: {ws.slug}</p>
                    {ws.privateMeetingUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-0.5">
                        <Lock className="w-2.5 h-2.5" /> Private Meeting Link Configured
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium">{ws.category}</td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 text-[11px]">
                    {formatMogadishuTime(ws.startTime, { format: 'short' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-white">
                      {ws.confirmedCount} / {ws.capacity}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {remaining > 0 ? `${remaining} open` : `${ws.waitlistCount} on waitlist`}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ws.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {ws.status !== 'cancelled' ? (
                        <>
                          <button
                            onClick={() => handleTogglePublish(ws)}
                            className={`p-1.5 rounded-lg text-xs font-semibold ${
                              ws.status === 'published'
                                ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950'
                                : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                            }`}
                            title={ws.status === 'published' ? 'Unpublish to Draft' : 'Publish to Live Site'}
                          >
                            {ws.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            onClick={() => handleCancelWorkshop(ws)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg text-xs font-semibold"
                            title="Cancel Cohort"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => db.saveWorkshop({ id: ws.id, status: 'published' })}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg text-xs font-semibold"
                          title="Restore to Published"
                        >
                          Reopen
                        </button>
                      )}

                      <button
                        onClick={() => openEditModal(ws)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit workshop"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(ws)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Duplicate as new cohort"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(ws.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete workshop"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkshop?.id ? 'Edit Workshop' : 'Create New Workshop'}
        maxWidth="lg"
      >
        {editingWorkshop && (
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Workshop Title *"
              required
              value={editingWorkshop.title || ''}
              onChange={(e) =>
                setEditingWorkshop({
                  ...editingWorkshop,
                  title: e.target.value,
                  slug: editingWorkshop.id
                    ? editingWorkshop.slug
                    : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                })
              }
              placeholder="e.g. Master React 19 and Component Architecture"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Slug (URL identifier) *"
                required
                value={editingWorkshop.slug || ''}
                onChange={(e) => setEditingWorkshop({ ...editingWorkshop, slug: e.target.value })}
              />

              <Select
                label="Category *"
                value={editingWorkshop.category || 'React'}
                onChange={(e) =>
                  setEditingWorkshop({
                    ...editingWorkshop,
                    category: e.target.value as WorkshopCategory,
                  })
                }
                options={[
                  { label: 'Web Development', value: 'Web Development' },
                  { label: 'JavaScript', value: 'JavaScript' },
                  { label: 'React', value: 'React' },
                  { label: 'AI', value: 'AI' },
                ]}
              />

              <Select
                label="Publication Status *"
                value={editingWorkshop.status || 'published'}
                onChange={(e) =>
                  setEditingWorkshop({
                    ...editingWorkshop,
                    status: e.target.value as WorkshopStatus,
                  })
                }
                options={[
                  { label: 'Published (Live on Public Site)', value: 'published' },
                  { label: 'Draft (Hidden from Public)', value: 'draft' },
                  { label: 'Cancelled (Shown as Cancelled)', value: 'cancelled' },
                ]}
              />
            </div>

            <Textarea
              label="Brief Summary *"
              rows={2}
              required
              value={editingWorkshop.summary || ''}
              onChange={(e) => setEditingWorkshop({ ...editingWorkshop, summary: e.target.value })}
              placeholder="1-2 sentences summarizing what students will build."
            />

            <Textarea
              label="Full Description"
              rows={3}
              value={editingWorkshop.description || ''}
              onChange={(e) => setEditingWorkshop({ ...editingWorkshop, description: e.target.value })}
              placeholder="Detailed course overview and topics."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Max Seat Capacity *"
                type="number"
                min={1}
                required
                value={editingWorkshop.capacity || 30}
                onChange={(e) => setEditingWorkshop({ ...editingWorkshop, capacity: Number(e.target.value) })}
              />

              <Input
                label="Start Time (Local/EAT)"
                type="datetime-local"
                value={editingWorkshop.startTime || ''}
                onChange={(e) => setEditingWorkshop({ ...editingWorkshop, startTime: e.target.value })}
              />

              <Input
                label="End Time (Local/EAT)"
                type="datetime-local"
                value={editingWorkshop.endTime || ''}
                onChange={(e) => setEditingWorkshop({ ...editingWorkshop, endTime: e.target.value })}
              />
            </div>

            {/* Private Video Meeting Credentials (CRITICAL ISOLATION) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Private Joining Credentials (Protected)
                </h4>
              </div>
              <p className="text-[11px] text-slate-500">
                These credentials will NEVER appear in public catalog responses. Only confirmed attendees receive them.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Private Meeting URL"
                  placeholder="https://zoom.us/j/123456789"
                  value={editingWorkshop.privateMeetingUrl || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, privateMeetingUrl: e.target.value })}
                />
                <Input
                  label="Passcode (Optional)"
                  placeholder="e.g. LAVA2026"
                  value={editingWorkshop.privateMeetingPassword || ''}
                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, privateMeetingPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-bold">
                Save Workshop
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

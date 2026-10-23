import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Award, ExternalLink } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Instructor } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';
import { Input, Textarea } from '../../components/ui/Input.tsx';

export function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Partial<Instructor> | null>(null);

  useEffect(() => {
    setInstructors(db.getInstructors());
    return db.subscribe(() => {
      setInstructors(db.getInstructors());
    });
  }, []);

  const openCreateModal = () => {
    setEditingInst({
      name: '',
      slug: '',
      role: '',
      bio: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      expertise: ['Web Development', 'React'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingInst(inst);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInst || !editingInst.name) return;
    db.saveInstructor(editingInst);
    setIsModalOpen(false);
    setEditingInst(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Instructor Directory Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage public mentor profiles, biographies, expertise tags, and workshop cohort assignments.
          </p>
        </div>
        <Button onClick={openCreateModal} className="text-xs font-bold py-2">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add Instructor</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map((inst) => (
          <Card key={inst.id} className="p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={inst.photoUrl}
                  alt={inst.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-orange-600 font-medium">{inst.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {inst.bio}
              </p>
              <div className="flex flex-wrap gap-1">
                {inst.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                onClick={() => openEditModal(inst)}
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingInst?.id ? 'Edit Instructor' : 'Add New Instructor'}
      >
        {editingInst && (
          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name *"
              required
              value={editingInst.name || ''}
              onChange={(e) =>
                setEditingInst({
                  ...editingInst,
                  name: e.target.value,
                  slug: editingInst.id
                    ? editingInst.slug
                    : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                })
              }
            />

            <Input
              label="Professional Role / Title *"
              required
              value={editingInst.role || ''}
              onChange={(e) => setEditingInst({ ...editingInst, role: e.target.value })}
              placeholder="e.g. Senior Frontend Architect"
            />

            <Input
              label="Photo URL"
              value={editingInst.photoUrl || ''}
              onChange={(e) => setEditingInst({ ...editingInst, photoUrl: e.target.value })}
            />

            <Textarea
              label="Biography"
              rows={3}
              value={editingInst.bio || ''}
              onChange={(e) => setEditingInst({ ...editingInst, bio: e.target.value })}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" className="text-xs font-bold">
                Save Instructor
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

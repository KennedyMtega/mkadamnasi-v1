'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';
import EmptyState from '@/components/ui/EmptyState';
import Toast from '@/components/ui/Toast';
import { getAnonymousId } from '@/lib/utils';
import {
  FolderTree,
  Edit3,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Plus,
  Save,
  Eye,
  EyeOff,
  Vote,
  Star,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    votes: number;
    ratings: number;
  };
}

interface EditForm {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  description: string;
  isActive: boolean;
}

const defaultEditForm: EditForm = {
  id: '',
  name: '',
  nameEn: '',
  icon: '',
  color: '',
  description: '',
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(defaultEditForm);
  const [saving, setSaving] = useState(false);

  // Create modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    nameEn: '',
    slug: '',
    icon: '',
    color: '#FF6B00',
    description: '',
  });
  const [creating, setCreating] = useState(false);

  // Reorder loading
  const [reordering, setReordering] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({ message: '', type: 'success', visible: false });

  const fetchCategories = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/admin/categories', {
        headers: { 'x-anonymous-id': getAnonymousId() },
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setCategories(data.categories);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditModal = (cat: CategoryItem) => {
    setEditForm({
      id: cat.id,
      name: cat.name,
      nameEn: cat.nameEn,
      icon: cat.icon,
      color: cat.color,
      description: cat.description || '',
      isActive: cat.isActive,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({
          action: 'update',
          ...editForm,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Kundi limesasishwa (Category updated)', type: 'success', visible: true });
      setEditModalOpen(false);
      fetchCategories();
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.nameEn || !createForm.slug || !createForm.icon || !createForm.color) {
      setToast({ message: 'Tafadhali jaza sehemu zote zinazohitajika (Please fill all required fields)', type: 'error', visible: true });
      return;
    }

    setCreating(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({
          action: 'create',
          ...createForm,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Kundi jipya limeundwa (New category created)', type: 'success', visible: true });
      setCreateModalOpen(false);
      setCreateForm({ name: '', nameEn: '', slug: '', icon: '', color: '#FF6B00', description: '' });
      fetchCategories();
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
    } finally {
      setCreating(false);
    }
  };

  const moveCategory = async (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
    setCategories(newCategories);

    setReordering(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({
          action: 'reorder',
          orderedIds: newCategories.map((c) => c.id),
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ message: 'Mpangilio umesasishwa (Order updated)', type: 'success', visible: true });
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
      fetchCategories();
    } finally {
      setReordering(false);
    }
  };

  const toggleActive = async (cat: CategoryItem) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-anonymous-id': getAnonymousId(),
        },
        body: JSON.stringify({
          action: 'update',
          id: cat.id,
          isActive: !cat.isActive,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setToast({
        message: cat.isActive
          ? 'Kundi limezimwa (Category deactivated)'
          : 'Kundi limewashwa (Category activated)',
        type: 'success',
        visible: true,
      });
      fetchCategories();
    } catch {
      setToast({ message: 'Hitilafu imetokea. Jaribu tena.', type: 'error', visible: true });
    }
  };

  if (error) return <ErrorState onRetry={fetchCategories} />;

  return (
    <div className="space-y-4">
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={() => setToast(t => ({ ...t, visible: false }))} />

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)} title="Hariri Kundi (Edit Category)" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jina (Kiswahili)"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Siasa"
            />
            <Input
              label="Jina (English)"
              value={editForm.nameEn}
              onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
              placeholder="Politics"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ikoni (Icon/Emoji)"
              value={editForm.icon}
              onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
              placeholder="e.g. emoji or icon name"
            />
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Rangi (Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  className="w-14 h-14 rounded-xl border border-neutral-300 cursor-pointer"
                />
                <Input
                  value={editForm.color}
                  onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                  placeholder="#FF6B00"
                />
              </div>
            </div>
          </div>
          <Input
            label="Maelezo (Description)"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            placeholder="Maelezo mafupi ya kundi..."
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-neutral-700">Hai (Active):</label>
            <button
              type="button"
              onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
              className={`relative w-12 h-6 rounded-full transition-colors ${editForm.isActive ? 'bg-semantic-success' : 'bg-neutral-300'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-neutral-0 shadow transition-transform ${editForm.isActive ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setEditModalOpen(false)} disabled={saving}>
              Ghairi (Cancel)
            </Button>
            <Button className="flex-1" onClick={handleSaveEdit} loading={saving} icon={<Save size={16} />}>
              Hifadhi (Save)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Unda Kundi Jipya (Create New Category)" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Jina (Kiswahili) *"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="Siasa"
            />
            <Input
              label="Jina (English) *"
              value={createForm.nameEn}
              onChange={(e) => setCreateForm({ ...createForm, nameEn: e.target.value })}
              placeholder="Politics"
            />
          </div>
          <Input
            label="Slug *"
            value={createForm.slug}
            onChange={(e) => setCreateForm({ ...createForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
            placeholder="siasa"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Ikoni (Icon/Emoji) *"
              value={createForm.icon}
              onChange={(e) => setCreateForm({ ...createForm, icon: e.target.value })}
              placeholder="e.g. emoji or icon name"
            />
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Rangi (Color) *</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={createForm.color}
                  onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  className="w-14 h-14 rounded-xl border border-neutral-300 cursor-pointer"
                />
                <Input
                  value={createForm.color}
                  onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  placeholder="#FF6B00"
                />
              </div>
            </div>
          </div>
          <Input
            label="Maelezo (Description)"
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            placeholder="Maelezo mafupi ya kundi..."
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Ghairi (Cancel)
            </Button>
            <Button className="flex-1" onClick={handleCreate} loading={creating} icon={<Plus size={16} />}>
              Unda (Create)
            </Button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Makundi (Categories)</h1>
          <p className="text-sm text-neutral-500 mt-1">Simamia makundi ya kura na tathmini (Manage vote and rating categories)</p>
        </div>
        <Button size="sm" onClick={() => setCreateModalOpen(true)} icon={<Plus size={16} />}>
          Ongeza Kundi (Add)
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} padding="md">
              <div className="flex items-center gap-3">
                <Skeleton variant="rectangular" className="w-10 h-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-32 h-5" />
                  <Skeleton variant="text" className="w-48 h-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree size={32} />}
          title="Hakuna makundi (No categories)"
          description="Bado hakuna makundi yaliyoundwa (No categories have been created yet)"
          actionLabel="Unda Kundi (Create Category)"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block">
            <Card padding="sm" className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase w-10">Mpangilio</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kundi (Category)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Slug</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Kura (Votes)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Tathmini (Ratings)</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Hali (Status)</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-500 text-xs uppercase">Vitendo (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat, index) => (
                    <tr key={cat.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => moveCategory(index, 'up')}
                            disabled={index === 0 || reordering}
                            className="p-0.5 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronUp size={14} className="text-neutral-500" />
                          </button>
                          <GripVertical size={14} className="text-neutral-300" />
                          <button
                            onClick={() => moveCategory(index, 'down')}
                            disabled={index === categories.length - 1 || reordering}
                            className="p-0.5 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronDown size={14} className="text-neutral-500" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ backgroundColor: cat.color + '20' }}
                          >
                            {cat.icon}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900">{cat.name}</p>
                            <p className="text-xs text-neutral-500">{cat.nameEn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">{cat.slug}</code>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Vote size={14} className="text-semantic-info" />
                          <span className="font-medium text-neutral-900">{cat._count.votes}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Star size={14} className="text-amber-500" />
                          <span className="font-medium text-neutral-900">{cat._count.ratings}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {cat.isActive ? (
                          <Badge variant="success">Hai (Active)</Badge>
                        ) : (
                          <Badge variant="default">Imezimwa (Inactive)</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(cat)} icon={<Edit3 size={14} />}>
                            Hariri
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(cat)}
                            icon={cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          >
                            {cat.isActive ? 'Zima' : 'Washa'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {categories.map((cat, index) => (
              <Card key={cat.id} padding="md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: cat.color + '20' }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{cat.name}</p>
                      <p className="text-xs text-neutral-500">{cat.nameEn}</p>
                      <code className="text-[11px] text-neutral-400">{cat.slug}</code>
                    </div>
                  </div>
                  {cat.isActive ? (
                    <Badge variant="success" size="sm">Hai</Badge>
                  ) : (
                    <Badge variant="default" size="sm">Imezimwa</Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Vote size={12} className="text-semantic-info" />
                    {cat._count.votes} kura
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Star size={12} className="text-amber-500" />
                    {cat._count.ratings} tathmini
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0 || reordering}
                      className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronUp size={16} className="text-neutral-500" />
                    </button>
                    <button
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === categories.length - 1 || reordering}
                      className="p-2 rounded-lg hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronDown size={16} className="text-neutral-500" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(cat)} icon={<Edit3 size={14} />}>
                      Hariri (Edit)
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleActive(cat)}
                      icon={cat.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    >
                      {cat.isActive ? 'Zima' : 'Washa'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

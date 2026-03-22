'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Clock,
  ShieldCheck,
  Tag,
  ArrowRight,
  Image as ImageIcon,
  Trophy,
  Zap,
  Users,
  Link2,
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Huduma ya Wateja (Customer Service)',
  'Bidhaa (Products)',
  'Bei (Pricing)',
  'Ubora (Quality)',
  'Burudani (Entertainment)',
  'Mashindano (Contests)',
  'Jumla (General)',
];

interface PollOption {
  title: string;
  imageUrl: string;
}

interface ContestantEntry {
  fullName: string;
  bio: string;
  photoUrl: string;
}

type FormMode = 'poll' | 'contest';

export default function CreatePollPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<FormMode>('poll');

  // Poll form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '7',
    isAnonymous: true,
    imageUrl: '', // Cover image
    options: [{ title: '', imageUrl: '' }, { title: '', imageUrl: '' }] as PollOption[],
  });

  // Contest form data
  const [contestData, setContestData] = useState({
    title: '',
    description: '',
    category: 'Mashindano (Contests)',
    duration: '30',
    imageUrl: '', // Cover image
    codePrefix: '',
    registrationOpen: false,
    boostEnabled: false,
    boostPrice: '',
    contestants: [
      { fullName: '', bio: '', photoUrl: '' },
      { fullName: '', bio: '', photoUrl: '' },
    ] as ContestantEntry[],
  });

  // Poll option management
  const addOption = () => {
    if (formData.options.length < 10) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, { title: '', imageUrl: '' }] }));
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  const updateOption = (index: number, field: keyof PollOption, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((o, i) => (i === index ? { ...o, [field]: value } : o)),
    }));
  };

  // Contestant management
  const addContestant = () => {
    if (contestData.contestants.length < 100) {
      setContestData((prev) => ({
        ...prev,
        contestants: [...prev.contestants, { fullName: '', bio: '', photoUrl: '' }],
      }));
    }
  };

  const removeContestant = (index: number) => {
    if (contestData.contestants.length > 2) {
      setContestData((prev) => ({
        ...prev,
        contestants: prev.contestants.filter((_, i) => i !== index),
      }));
    }
  };

  const updateContestant = (index: number, field: keyof ContestantEntry, value: string) => {
    setContestData((prev) => ({
      ...prev,
      contestants: prev.contestants.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'poll') {
        const filledOptions = formData.options.filter((o) => o.title.trim());
        if (filledOptions.length < 2) {
          setError('Lazima uwe na angalau chaguo 2. (You need at least 2 options.)');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            categoryId: formData.category,
            type: 'POLL',
            imageUrl: formData.imageUrl || undefined,
            duration: parseInt(formData.duration),
            isAnonymous: formData.isAnonymous,
            options: filledOptions.map((o) => ({
              title: o.title,
              imageUrl: o.imageUrl || undefined,
            })),
            endDate: formData.duration !== '0'
              ? new Date(Date.now() + parseInt(formData.duration) * 86400000).toISOString()
              : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create poll');
        }
      } else {
        const filledContestants = contestData.contestants.filter((c) => c.fullName.trim());
        if (filledContestants.length < 2) {
          setError('Lazima uwe na angalau washiriki 2. (You need at least 2 contestants.)');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/contests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: contestData.title,
            description: contestData.description,
            categoryId: contestData.category,
            imageUrl: contestData.imageUrl || undefined,
            codePrefix: contestData.codePrefix || 'C',
            registrationOpen: contestData.registrationOpen,
            boostEnabled: contestData.boostEnabled,
            boostPrice: contestData.boostPrice ? parseFloat(contestData.boostPrice) : undefined,
            contestants: filledContestants.map((c) => ({
              fullName: c.fullName,
              bio: c.bio || undefined,
              photoUrl: c.photoUrl || undefined,
            })),
            endDate: contestData.duration !== '0'
              ? new Date(Date.now() + parseInt(contestData.duration) * 86400000).toISOString()
              : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to create contest');
        }
      }

      router.push('/business/polls');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Imeshindikana kuunda. (Failed to create.)');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors';
  const labelClass = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/business/polls"
          className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-neutral-700" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            {mode === 'poll' ? 'Unda Kura Mpya (Create New Poll)' : 'Unda Mashindano (Create Contest)'}
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            {mode === 'poll'
              ? 'Pata maoni ya wateja wako. Get feedback from your customers.'
              : 'Unda mashindano kama Miss Tanzania, Best Barber, n.k.'}
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('poll')}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-colors ${
            mode === 'poll'
              ? 'bg-brand-primary text-neutral-0 shadow-brand'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Tag size={18} />
          Kura (Poll)
        </button>
        <button
          type="button"
          onClick={() => setMode('contest')}
          className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-colors ${
            mode === 'contest'
              ? 'bg-brand-primary text-neutral-0 shadow-brand'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
          }`}
        >
          <Trophy size={18} />
          Mashindano (Contest)
        </button>
      </div>

      {/* Form */}
      <Card padding="lg">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-semantic-error/20 text-semantic-error text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'poll' ? (
            <>
              {/* ─── POLL MODE ─── */}

              {/* Title */}
              <div>
                <label className={labelClass}>Kichwa cha Kura (Poll Title) *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Mfano: Unapenda bidhaa gani zaidi?"
                  required
                  maxLength={200}
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Maelezo (Description)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Maelezo ya ziada kuhusu kura hii..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className={labelClass}>
                  <ImageIcon size={14} className="inline mr-1" />
                  Picha ya Jalada (Cover Image)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className={inputClass}
                />
                {formData.imageUrl && (
                  <div className="mt-2 w-full h-32 rounded-xl overflow-hidden bg-neutral-100">
                    <img src={formData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Options with Images */}
              <div>
                <label className={labelClass}>Chaguo za Kura (Poll Options) *</label>
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary-light flex items-center justify-center shrink-0 text-sm font-bold text-brand-primary">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={option.title}
                          onChange={(e) => updateOption(index, 'title', e.target.value)}
                          placeholder={`Chaguo ${index + 1} (Option ${index + 1})`}
                          maxLength={150}
                          className="flex-1 h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-semantic-error transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 pl-10">
                        <ImageIcon size={14} className="text-neutral-400 shrink-0" />
                        <input
                          type="url"
                          value={option.imageUrl}
                          onChange={(e) => updateOption(index, 'imageUrl', e.target.value)}
                          placeholder="Picha ya chaguo (Image URL, optional)"
                          className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 bg-neutral-0 text-neutral-900 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
                        />
                      </div>
                      {option.imageUrl && (
                        <div className="ml-10 w-16 h-16 rounded-lg overflow-hidden bg-neutral-100">
                          <img src={option.imageUrl} alt={`Option ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {formData.options.length < 10 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline"
                  >
                    <PlusCircle size={16} />
                    Ongeza Chaguo (Add Option)
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ─── CONTEST MODE ─── */}

              {/* Title */}
              <div>
                <label className={labelClass}>Jina la Mashindano (Contest Title) *</label>
                <input
                  type="text"
                  value={contestData.title}
                  onChange={(e) => setContestData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Mfano: Miss Dar es Salaam 2026"
                  required
                  maxLength={200}
                  className={inputClass}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Maelezo (Description)</label>
                <textarea
                  value={contestData.description}
                  onChange={(e) => setContestData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Maelezo kamili kuhusu mashindano haya..."
                  rows={4}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors resize-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className={labelClass}>
                  <ImageIcon size={14} className="inline mr-1" />
                  Picha ya Jalada (Cover Image)
                </label>
                <input
                  type="url"
                  value={contestData.imageUrl}
                  onChange={(e) => setContestData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/contest-banner.jpg"
                  className={inputClass}
                />
                {contestData.imageUrl && (
                  <div className="mt-2 w-full h-40 rounded-xl overflow-hidden bg-neutral-100">
                    <img src={contestData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Code Prefix */}
              <div>
                <label className={labelClass}>
                  Herufi za Msimbo (Code Prefix) *
                </label>
                <input
                  type="text"
                  value={contestData.codePrefix}
                  onChange={(e) => setContestData((prev) => ({ ...prev, codePrefix: e.target.value.toUpperCase() }))}
                  placeholder="Mfano: MT (itakuwa MT001, MT002...)"
                  maxLength={10}
                  className={inputClass}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Kila mshiriki atapata msimbo wa pekee, mfano: {contestData.codePrefix || 'C'}001, {contestData.codePrefix || 'C'}002
                </p>
              </div>

              {/* Contestants */}
              <div>
                <label className={labelClass}>
                  <Users size={14} className="inline mr-1" />
                  Washiriki (Contestants) *
                </label>
                <div className="space-y-3">
                  {contestData.contestants.map((contestant, index) => (
                    <div key={index} className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-primary bg-brand-primary-light px-2 py-1 rounded-lg">
                          {contestData.codePrefix || 'C'}{String(index + 1).padStart(3, '0')}
                        </span>
                        {contestData.contestants.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeContestant(index)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-semantic-error transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={contestant.fullName}
                        onChange={(e) => updateContestant(index, 'fullName', e.target.value)}
                        placeholder="Jina kamili (Full name)"
                        required
                        maxLength={100}
                        className="w-full h-11 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                      />
                      <textarea
                        value={contestant.bio}
                        onChange={(e) => updateContestant(index, 'bio', e.target.value)}
                        placeholder="Maelezo mafupi (Short bio, optional)"
                        rows={2}
                        maxLength={500}
                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-neutral-0 text-neutral-900 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <ImageIcon size={14} className="text-neutral-400 shrink-0" />
                        <input
                          type="url"
                          value={contestant.photoUrl}
                          onChange={(e) => updateContestant(index, 'photoUrl', e.target.value)}
                          placeholder="Picha ya mshiriki (Photo URL)"
                          className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 bg-neutral-0 text-neutral-900 text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
                        />
                      </div>
                      {contestant.photoUrl && (
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 mx-auto">
                          <img src={contestant.photoUrl} alt={contestant.fullName} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {contestData.contestants.length < 100 && (
                  <button
                    type="button"
                    onClick={addContestant}
                    className="mt-2 flex items-center gap-2 text-sm text-brand-primary font-medium hover:underline"
                  >
                    <PlusCircle size={16} />
                    Ongeza Mshiriki (Add Contestant)
                  </button>
                )}
              </div>

              {/* Registration Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                <div className="flex items-center gap-3">
                  <Link2 size={20} className="text-brand-primary" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Usajili wa Washiriki (Self Registration)</p>
                    <p className="text-xs text-neutral-500">Ruhusu washiriki kujisajili wenyewe kupitia link</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setContestData((prev) => ({ ...prev, registrationOpen: !prev.registrationOpen }))}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    contestData.registrationOpen ? 'bg-brand-primary' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-neutral-0 shadow-sm transition-transform ${
                      contestData.registrationOpen ? 'left-5.5 translate-x-0' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Boost Voting Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-100 border border-neutral-300">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">Kura za Boost (Boost Votes)</p>
                      <p className="text-xs text-neutral-500">Ruhusu watu kununua kura za ziada (Allow paid extra votes)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContestData((prev) => ({ ...prev, boostEnabled: !prev.boostEnabled }))}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      contestData.boostEnabled ? 'bg-brand-primary' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-6 h-6 rounded-full bg-neutral-0 shadow-sm transition-transform ${
                        contestData.boostEnabled ? 'left-5.5 translate-x-0' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
                {contestData.boostEnabled && (
                  <div className="pl-4">
                    <label className={labelClass}>Bei ya Kura Moja ya Boost (Price per Boost Vote in TZS)</label>
                    <input
                      type="number"
                      value={contestData.boostPrice}
                      onChange={(e) => setContestData((prev) => ({ ...prev, boostPrice: e.target.value }))}
                      placeholder="500"
                      min="100"
                      step="100"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Shared fields: Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Tag size={14} className="inline mr-1" />
                Kategoria (Category)
              </label>
              <select
                value={mode === 'poll' ? formData.category : contestData.category}
                onChange={(e) => {
                  if (mode === 'poll') {
                    setFormData((prev) => ({ ...prev, category: e.target.value }));
                  } else {
                    setContestData((prev) => ({ ...prev, category: e.target.value }));
                  }
                }}
                className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors appearance-none"
              >
                <option value="">Chagua...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>
                <Clock size={14} className="inline mr-1" />
                Muda (Duration)
              </label>
              <select
                value={mode === 'poll' ? formData.duration : contestData.duration}
                onChange={(e) => {
                  if (mode === 'poll') {
                    setFormData((prev) => ({ ...prev, duration: e.target.value }));
                  } else {
                    setContestData((prev) => ({ ...prev, duration: e.target.value }));
                  }
                }}
                className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-0 text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors appearance-none"
              >
                <option value="1">Siku 1 (1 Day)</option>
                <option value="3">Siku 3 (3 Days)</option>
                <option value="7">Wiki 1 (1 Week)</option>
                <option value="14">Wiki 2 (2 Weeks)</option>
                <option value="30">Mwezi 1 (1 Month)</option>
                <option value="90">Miezi 3 (3 Months)</option>
                <option value="0">Bila Mwisho (No End)</option>
              </select>
            </div>
          </div>

          {/* Anonymous toggle (poll only) */}
          {mode === 'poll' && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-100 border border-neutral-300">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-brand-primary" />
                <div>
                  <p className="text-sm font-medium text-neutral-900">Kura ya Siri (Anonymous Voting)</p>
                  <p className="text-xs text-neutral-500">Wapiga kura hawajulikani (Voters remain anonymous)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  formData.isAnonymous ? 'bg-brand-primary' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-neutral-0 shadow-sm transition-transform ${
                    formData.isAnonymous ? 'left-5.5 translate-x-0' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/business/polls"
              className="flex-1 h-12 flex items-center justify-center rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-sm hover:bg-neutral-100 transition-colors"
            >
              Ghairi (Cancel)
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'poll' ? 'Chapisha Kura (Publish Poll)' : 'Chapisha Mashindano (Publish Contest)'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

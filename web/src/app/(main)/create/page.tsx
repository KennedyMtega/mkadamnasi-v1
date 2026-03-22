'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vote, Star, ChevronRight, Image, Clock, Globe, Lock, Plus, Trash2, GripVertical, Trophy } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Chip from '@/components/ui/Chip';
import Badge from '@/components/ui/Badge';
import Toast from '@/components/ui/Toast';
import { CATEGORIES, REGIONS_TZ } from '@/lib/constants';
import { api } from '@/lib/api-client';

type CreateType = 'vote' | 'rating' | null;
type VoteType = 'poll' | 'versus' | 'ranking';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [createType, setCreateType] = useState<CreateType>(null);
  const [voteType, setVoteType] = useState<VoteType>('poll');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [entityName, setEntityName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [duration, setDuration] = useState('7');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const addOption = () => {
    if (options.length < 10) setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (createType === 'vote') {
        await api.createVote({
          title,
          description: description || undefined,
          type: voteType,
          categoryId: category,
          region: region || undefined,
          options: options.filter(o => o.trim()),
          isAnonymous,
          duration,
        });
      } else {
        await api.createRating({
          title,
          description: description || undefined,
          categoryId: category,
          entityName,
          region: region || undefined,
          isAnonymous,
        });
      }
      setToastMessage(`${createType === 'vote' ? 'Kura' : 'Kadirio'} limechapishwa!`);
      setToastType('success');
      setShowToast(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Tatizo la seva. Jaribu tena.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 0) return createType !== null;
    if (step === 1) return title.length >= 3 && category !== '';
    if (step === 2) {
      if (createType === 'vote') return options.filter(o => o.trim()).length >= 2;
      return entityName.trim().length >= 2;
    }
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <TopBar title="Unda Mpya" showBack />

      <div className="hidden lg:block px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-neutral-900">Unda Kura au Kadirio Jipya</h1>
        <p className="text-neutral-700 mt-1">Unda kura au kadirio la siri kwa jamii</p>
      </div>

      {/* Progress indicator */}
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-brand-primary' : 'bg-neutral-300'}`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Hatua {step + 1} ya 4
        </p>
      </div>

      <div className="px-4 lg:px-6 pb-8 space-y-4">
        {/* Step 0: Choose Type */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900">Unataka kuunda nini?</h2>

            <button
              type="button"
              onClick={() => setCreateType('vote')}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${createType === 'vote' ? 'border-brand-primary bg-brand-primary-light' : 'border-neutral-300 bg-neutral-0'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${createType === 'vote' ? 'bg-brand-primary' : 'bg-neutral-100'}`}>
                  <Vote size={24} className={createType === 'vote' ? 'text-neutral-0' : 'text-neutral-500'} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Kura</h3>
                  <p className="text-sm text-neutral-700">Unda kura ya siri — watu wachague</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCreateType('rating')}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${createType === 'rating' ? 'border-brand-primary bg-brand-primary-light' : 'border-neutral-300 bg-neutral-0'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${createType === 'rating' ? 'bg-brand-primary' : 'bg-neutral-100'}`}>
                  <Star size={24} className={createType === 'rating' ? 'text-neutral-0' : 'text-neutral-500'} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">Kadirio</h3>
                  <p className="text-sm text-neutral-700">Unda kadirio la siri — watu wakadidie kwa nyota</p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { window.location.href = '/contest/create'; }}
              className="w-full text-left p-4 rounded-2xl border-2 border-neutral-300 bg-neutral-0 hover:border-amber-400 hover:bg-amber-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-100">
                  <Trophy size={24} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">Mashindano (Contest)</h3>
                  <p className="text-sm text-neutral-700">Unda mashindano kama Miss Tanzania — washiriki na misimbo</p>
                </div>
                <ChevronRight size={20} className="text-neutral-400" />
              </div>
            </button>

            {createType === 'vote' && (
              <div className="pt-2">
                <p className="text-sm font-medium text-neutral-700 mb-2">Aina ya kura:</p>
                <div className="flex gap-2">
                  <Chip active={voteType === 'poll'} onClick={() => setVoteType('poll')}>Kura ya Kawaida</Chip>
                  <Chip active={voteType === 'versus'} onClick={() => setVoteType('versus')}>Versus (1v1)</Chip>
                  <Chip active={voteType === 'ranking'} onClick={() => setVoteType('ranking')}>Orodha</Chip>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Maelezo</h2>

            <Input
              label="Kichwa *"
              placeholder={createType === 'vote' ? 'Mfano: Mgahawa Bora Dar es Salaam' : 'Mfano: Kadirio la Huduma za Hospitali'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Maelezo (si lazima)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Eleza zaidi kuhusu kura/kadirio hili..."
                className="w-full h-24 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-0 p-4 text-base text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary resize-none transition-colors"
                maxLength={500}
              />
              <p className="text-right text-xs text-neutral-500 mt-1">{description.length}/500</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Kategoria *</label>
              <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center ${category === cat.id ? 'border-brand-primary bg-brand-primary-light' : 'border-neutral-300 bg-neutral-0 hover:border-neutral-500'}`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-neutral-900">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-2">Mkoa (si lazima)</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-14 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-0 px-4 text-base text-neutral-900 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              >
                <option value="">Tanzania nzima</option>
                {REGIONS_TZ.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Options / Entity */}
        {step === 2 && createType === 'vote' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Chaguzi za Kura</h2>
            <p className="text-sm text-neutral-700">Ongeza chaguzi ambazo watu watapiga kura</p>

            <div className="space-y-2.5">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical size={18} className="text-neutral-300 shrink-0 cursor-grab" />
                  <Input
                    placeholder={`Chaguo ${i + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="p-2 rounded-xl hover:bg-neutral-100 text-semantic-error shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <Button variant="ghost" size="sm" onClick={addOption} icon={<Plus size={16} />}>
                Ongeza Chaguo
              </Button>
            )}
            <p className="text-xs text-neutral-500">{options.length}/10 chaguzi</p>
          </div>
        )}

        {step === 2 && createType === 'rating' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Kitu cha Kukadiria</h2>
            <Input
              label="Jina la biashara/huduma/mtu *"
              placeholder="Mfano: Hospitali ya Muhimbili"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
            />
          </div>
        )}

        {/* Step 3: Settings */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-neutral-900">Mipangilio</h2>

            <Card>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-semantic-success" />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Kura za Siri</p>
                    <p className="text-xs text-neutral-500">Kura/makadirio hayawezi kufuatiliwa</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`w-12 h-7 rounded-full transition-colors ${isAnonymous ? 'bg-semantic-success' : 'bg-neutral-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-neutral-0 shadow-sm transition-transform mx-1 ${isAnonymous ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3 mb-3">
                <Clock size={20} className="text-brand-primary" />
                <p className="text-sm font-semibold text-neutral-900">Muda wa Kura</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {['1', '3', '7', '14', '30'].map((d) => (
                  <Chip key={d} active={duration === d} onClick={() => setDuration(d)}>
                    {d} siku
                  </Chip>
                ))}
                <Chip active={duration === 'forever'} onClick={() => setDuration('forever')}>
                  Kudumu ♾️
                </Chip>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-semantic-info" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900">Hadharani</p>
                  <p className="text-xs text-neutral-500">Kura hii itaonekana na wote</p>
                </div>
              </div>
            </Card>

            {/* Preview */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Muhtasari:</h3>
              <Card className="bg-neutral-100">
                <div className="space-y-1.5 text-sm">
                  <p><span className="text-neutral-500">Aina:</span> <span className="font-medium text-neutral-900">{createType === 'vote' ? 'Kura' : 'Kadirio'}</span></p>
                  <p><span className="text-neutral-500">Kichwa:</span> <span className="font-medium text-neutral-900">{title}</span></p>
                  <p><span className="text-neutral-500">Kategoria:</span> <span className="font-medium text-neutral-900">{CATEGORIES.find(c => c.id === category)?.name}</span></p>
                  {createType === 'vote' && <p><span className="text-neutral-500">Chaguzi:</span> <span className="font-medium text-neutral-900">{options.filter(o => o.trim()).length}</span></p>}
                  <p><span className="text-neutral-500">Muda:</span> <span className="font-medium text-neutral-900">{duration === 'forever' ? 'Kudumu (Haina mwisho)' : `${duration} siku`}</span></p>
                  <p><span className="text-neutral-500">Siri:</span> <Badge variant={isAnonymous ? 'success' : 'warning'}>{isAnonymous ? 'Ndio' : 'Hapana'}</Badge></p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <Button variant="secondary" className="flex-1" onClick={() => setStep(step - 1)}>
              Rudi
            </Button>
          )}
          {step < 3 ? (
            <Button
              className="flex-1"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              icon={<ChevronRight size={18} />}
            >
              Endelea
            </Button>
          ) : (
            <Button
              className="flex-1"
              loading={loading}
              onClick={handleSubmit}
            >
              {createType === 'vote' ? 'Chapisha Kura' : 'Chapisha Kadirio'}
            </Button>
          )}
        </div>
      </div>

      <Toast
        message={toastMessage}
        type={toastType}
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

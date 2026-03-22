'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import TopBar from '@/components/layout/TopBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Mkadamnasi ni nini? (What is Mkadamnasi?)',
    answer:
      'Mkadamnasi ni jukwaa la kwanza Tanzania la kupiga kura, kukadiria, na kupanga kwa siri. Unaweza kushiriki bila mtu yeyote kujua ni wewe.',
  },
  {
    question: 'Je, ninaweza kutumia bila akaunti? (Can I use it without an account?)',
    answer:
      'Ndiyo! Unaweza kutumia Mkadamnasi bila kujisajili. Lakini kwa kujisajili utapata faida zaidi kama vile kuhifadhi maendeleo yako na kupata pointi.',
  },
  {
    question: 'Kura yangu ni siri kweli? (Is my vote truly anonymous?)',
    answer:
      'Ndiyo kabisa. Hatuhifadhi taarifa yoyote inayoweza kukutambulisha unapopiga kura au kukadiria. Faragha yako ni kipaumbele chetu.',
  },
  {
    question: 'Ninawezaje kupata pointi? (How do I earn points?)',
    answer:
      'Unapata pointi kwa kupiga kura, kukadiria, kuunda kura mpya, na kushiriki kila siku (daily streak). Pointi zaidi = daraja la juu zaidi!',
  },
  {
    question: 'Nini maana ya viwango (levels)?',
    answer:
      'Viwango vinaonyesha ushiriki wako. Unapoanza ni "Mwanafunzi" na unapoendelea kupata pointi, unapanda hadi "Mtaalamu", "Mkongwe", na zaidi.',
  },
  {
    question: 'Ninawezaje kuripoti maudhui yasiyofaa? (How to report inappropriate content?)',
    answer:
      'Bonyeza alama ya bendera kwenye kura au kadirio lolote linalokiuka sheria zetu. Timu yetu itapitia ripoti yako haraka iwezekanavyo.',
  },
  {
    question: 'Je, ninaweza kuunda kura yangu mwenyewe? (Can I create my own poll?)',
    answer:
      'Ndiyo! Bonyeza kitufe cha "+" chini ya skrini ili kuunda kura mpya. Unaweza kuchagua aina, jamii, na muda wa kura yako.',
  },
  {
    question: 'Ninawezaje kubadilisha lugha? (How do I change language?)',
    answer:
      'Kwa sasa Mkadamnasi inapatikana kwa Kiswahili na Kiingereza. Nenda kwenye Mipangilio (Settings) kubadilisha lugha yako.',
  },
  {
    question: 'Akaunti yangu imefungwa, nifanye nini? (My account is banned, what to do?)',
    answer:
      'Ikiwa akaunti yako imefungwa, ina maana kulikuwa na ukiukaji wa masharti ya matumizi. Wasiliana nasi kwa barua pepe ili kupata maelezo zaidi.',
  },
];

function FAQAccordion({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <Card className="overflow-hidden" padding="sm">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 text-left p-2"
        aria-expanded={isOpen}
      >
        <HelpCircle size={20} className="text-brand-primary shrink-0 mt-0.5" />
        <span className="flex-1 text-sm font-semibold text-neutral-900">
          {item.question}
        </span>
        <ChevronDown
          size={20}
          className={cn(
            'text-neutral-500 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-2 pb-2 pl-11">
          <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </Card>
  );
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <TopBar title="Msaada (Help)" showBack />

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-primary-light mb-4">
            <HelpCircle size={28} className="text-brand-primary" />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">
            Maswali Yanayoulizwa Mara kwa Mara
          </h1>
          <p className="text-sm text-neutral-600 mt-2">
            Frequently Asked Questions (FAQ)
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3 mb-10">
          {faqs.map((faq, index) => (
            <FAQAccordion
              key={index}
              item={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact section */}
        <Card padding="lg" className="text-center">
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            Bado una swali? (Still have a question?)
          </h2>
          <p className="text-sm text-neutral-600 mb-6">
            Wasiliana nasi na tutakusaidia haraka iwezekanavyo.
          </p>
          <div className="space-y-3">
            <Button
              variant="secondary"
              size="md"
              className="w-full"
              icon={<Mail size={18} />}
              onClick={() => window.location.href = 'mailto:support@mkadamnasi.co.tz'}
            >
              Tuma Barua Pepe (Email Us)
            </Button>
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              icon={<MessageCircle size={18} />}
              onClick={() => window.open('https://wa.me/255700000000', '_blank')}
            >
              WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

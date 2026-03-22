'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
} from 'lucide-react';

const faqs = [
  {
    q: 'Jinsi ya kudai biashara yangu? (How do I claim my business?)',
    a: 'Nenda kwenye ukurasa wa "Dai Biashara", tafuta biashara yako, kisha tuma ombi la kudai. Tutahakiki na kukujibu ndani ya siku 2-3. Go to the "Claim Business" page, search for your business, then submit a claim request.',
  },
  {
    q: 'Ninawezaje kuunda kura? (How can I create a poll?)',
    a: 'Nenda kwenye "Kura Zangu" na bonyeza "Unda Kura Mpya". Jaza maelezo na chaguo, kisha chapisha. Navigate to "My Polls" and click "Create New Poll". Fill in the details and options, then publish.',
  },
  {
    q: 'Jinsi ya kuangalia matokeo ya tathmini? (How to check rating results?)',
    a: 'Nenda kwenye ukurasa wa "Tathmini" kuona muhtasari, ugawaji, na maoni ya wateja. Visit the "Ratings" page to see overview, distribution, and customer reviews.',
  },
  {
    q: 'Tofauti kati ya mipango ni nini? (What are the plan differences?)',
    a: 'Mpango wa Bure unakupa huduma za msingi. Premium inakupa uchambuzi wa kina na kura zisizo na kikomo. Enterprise inakupa API access na msaada wa kibinafsi. Free plan gives basic features. Premium gives deep analytics and unlimited polls. Enterprise gives API access and dedicated support.',
  },
  {
    q: 'Jinsi ya kupata badge ya uthibitisho? (How to get a verified badge?)',
    a: 'Dai biashara yako, kisha sasisha kuwa mpango wa Premium au Enterprise. Biashara zilizothibitishwa hupata badge maalum. Claim your business, then upgrade to Premium or Enterprise. Verified businesses get a special badge.',
  },
];

export default function BusinessHelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Msaada (Help)</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Pata majibu na msaada kwa biashara yako. Get answers and support for your business.
        </p>
      </div>

      {/* FAQ */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4 flex items-center gap-2">
          <HelpCircle size={18} className="text-brand-primary" />
          Maswali Yanayoulizwa Mara kwa Mara (FAQ)
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-neutral-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-100 transition-colors"
              >
                <span className="text-sm font-medium text-neutral-900 pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <ChevronUp size={18} className="text-neutral-500 shrink-0" />
                ) : (
                  <ChevronDown size={18} className="text-neutral-500 shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-neutral-700 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card padding="lg">
        <h2 className="text-base font-bold text-neutral-900 mb-4">
          Wasiliana Nasi (Contact Us)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="mailto:biashara@mkadamnasi.co.tz"
            className="flex items-center gap-3 p-4 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all"
          >
            <Mail size={20} className="text-brand-primary" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Barua pepe</p>
              <p className="text-xs text-neutral-500">biashara@mkadamnasi.co.tz</p>
            </div>
          </a>
          <a
            href="tel:+255700000000"
            className="flex items-center gap-3 p-4 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all"
          >
            <Phone size={20} className="text-brand-primary" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Simu</p>
              <p className="text-xs text-neutral-500">+255 700 000 000</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 p-4 rounded-xl border border-neutral-300 hover:border-brand-primary hover:bg-brand-primary-light transition-all"
          >
            <MessageSquare size={20} className="text-brand-primary" />
            <div>
              <p className="text-sm font-medium text-neutral-900">WhatsApp</p>
              <p className="text-xs text-neutral-500">+255 700 000 000</p>
            </div>
          </a>
        </div>
      </Card>
    </div>
  );
}

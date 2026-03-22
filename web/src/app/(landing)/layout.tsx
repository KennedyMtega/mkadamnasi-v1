'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#for-business', label: 'For Business' },
  { href: '#download', label: 'Download' },
];

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-neutral-0/95 backdrop-blur-sm border-b border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
                <span className="text-neutral-0 font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Mkadamnasi</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-neutral-700 hover:text-brand-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/business/login"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors shadow-brand"
              >
                Business Login
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-neutral-300 bg-neutral-0 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-neutral-700 hover:text-brand-primary py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/business/login"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-2.5 rounded-xl bg-brand-primary text-neutral-0 font-semibold text-sm hover:bg-brand-primary-dark transition-colors"
            >
              Business Login
            </Link>
          </div>
        )}
      </nav>

      {children}

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center">
                  <span className="text-neutral-0 font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold">Mkadamnasi</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Sauti Yako, Siri Yako.
                <br />
                Your Voice, Your Secret.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-neutral-500 uppercase tracking-wider">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">How It Works</a></li>
                <li><a href="#download" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Download</a></li>
                <li><Link href="/business/login" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Business Portal</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-neutral-500 uppercase tracking-wider">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Kuhusu Sisi (About)</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Faragha (Privacy)</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Masharti (Terms)</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Wasiliana Nasi (Contact)</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-bold mb-4 text-neutral-500 uppercase tracking-wider">Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Twitter / X</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Instagram</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">Facebook</a></li>
                <li><a href="#" className="text-sm text-neutral-500 hover:text-neutral-0 transition-colors">WhatsApp</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-700">
            <p className="text-center text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} Mkadamnasi. Haki zote zimehifadhiwa (All rights reserved).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

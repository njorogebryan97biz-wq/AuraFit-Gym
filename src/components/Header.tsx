/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Dumbbell, Menu, X, Phone } from 'lucide-react';

interface HeaderProps {
  onJoinClick: () => void;
  currentPage: 'landing' | 'timetable' | 'aicoach' | 'gallery';
  onNavigate: (page: 'landing' | 'timetable' | 'aicoach' | 'gallery', section?: string) => void;
}

export default function Header({ onJoinClick, currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Services', id: 'services', page: 'landing' as const },
    { name: 'Timetable', id: 'schedule', page: 'timetable' as const },
    { name: 'About', id: 'about', page: 'landing' as const },
    { name: 'AI Coach', id: 'ai-coach', page: 'aicoach' as const },
    { name: 'Gallery', id: 'gallery', page: 'gallery' as const },
    { name: 'Testimonials', id: 'testimonials', page: 'landing' as const },
    { name: 'Contact', id: 'contact', page: 'landing' as const },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);
    if (item.page === currentPage) {
      if (item.page === 'landing') {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (item.page === 'landing') {
        onNavigate('landing', item.id);
      } else {
        onNavigate(item.page);
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => {
            if (currentPage === 'landing') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              onNavigate('landing');
            }
          }}
        >
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-neutral-100 to-orange-400 bg-clip-text text-transparent">
            AURA<span className="text-orange-500 font-medium font-sans">FIT</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.page && item.page !== 'landing';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(255,94,0,0.15)] border border-orange-500/20' 
                    : 'text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://wa.me/254700000000?text=Hi%20Aura%20Gym!%20I%20want%20to%20inquire%20about%20memberships."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-neutral-300 hover:text-orange-500 font-medium text-sm transition-colors duration-200"
          >
            <Phone className="w-4 h-4 text-orange-500" />
            <span>+254 700 000 000</span>
          </a>
          <button
            onClick={onJoinClick}
            id="nav-join-btn"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join Now
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d11]/95 border-b border-white/5 px-4 pt-2 pb-6 space-y-3 shadow-2xl backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = currentPage === item.page && item.page !== 'landing';
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-orange-500 bg-orange-500/10 border-l-4 border-l-orange-500'
                    : 'text-neutral-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </button>
            );
          })}
          <div className="pt-4 border-t border-white/5 flex flex-col space-y-4">
            <a
              href="https://wa.me/254700000000?text=Hi%20Aura%20Gym!%20I%20want%20to%20inquire%20about%20memberships."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 space-x-3 text-neutral-300 hover:text-orange-500 font-semibold"
            >
              <Phone className="w-5 h-5 text-orange-500" />
              <span>+254 700 000 000</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onJoinClick();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl text-center shadow-lg"
            >
              Join Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

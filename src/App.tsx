/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UserCheck, Users, Apple, Dumbbell, Flame, Sparkles, 
  MessageSquare, Star, Share2, Instagram, Facebook, 
  Send, ShieldCheck, MapPin, Award, ArrowUpRight, Check,
  Smartphone, MessageCircle, AlertCircle, X
} from 'lucide-react';

import { SERVICES, TESTIMONIALS, GALLERY } from './data';
import Header from './components/Header';
import ScheduleSection from './components/ScheduleSection';
import AICoach from './components/AICoach';
import CheckoutModal from './components/CheckoutModal';
import GymScrollProgress from './components/GymScrollProgress';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'timetable' | 'aicoach' | 'gallery'>('landing');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'facilities' | 'classes' | 'transformations'>('all');
  
  // Custom cursor refs & states for bypass re-render performance
  const cursorRingRef = React.useRef<HTMLDivElement>(null);
  const cursorDotRef = React.useRef<HTMLDivElement>(null);
  const [isHoveringCta, setIsHoveringCta] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  // Scroll position state for parallax & sticky pulse CTA
  const [scrollY, setScrollY] = useState(0);

  React.useEffect(() => {
    // Scroll listener for sticky CTA and parallax background behavior
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check if device is touch/mobile
    const checkMobile = () => {
      setIsMobileDevice(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Mouse movement tracker for desktop custom neon cursor crosshair - high performance native ref updates
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Determine if cursor is hovering over any CTA or clickable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isCta = !!target.closest('button, a, input, select, textarea, [role="button"], .hover-interactive-trigger, .btn-tap-shrink');
        setIsHoveringCta(isCta);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Custom contact form states
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Global Floating Virtual WhatsApp active message state
  const [waNotification, setWaNotification] = useState<{ show: boolean, message: string } | null>(null);

  // Sound generator
  function playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      console.log("Audio preview blocked by browser interaction restrictions.");
    }
  }

  const triggerWaNotification = (message: string) => {
    playNotificationSound();
    setWaNotification({ show: true, message });
    
    // Automatically fade out after 8 seconds
    setTimeout(() => {
      setWaNotification(prev => prev ? { ...prev, show: false } : null);
    }, 8000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactPhone) return;

    setContactSuccess(true);
    triggerWaNotification(
      `Welcome to *Aura Gym!* 🏋️\n\n` +
      `We received your contact details for *${contactName || "Athlete"}*. Our head coach Trainer Bryan (+254 700 000 000) will call you within 1 hour for your complimentary posture scan. Let's make it count! 🔥`
    );

    // Reset form
    setContactName('');
    setContactPhone('');
    setContactMsg('');
    
    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  const handlePaymentSuccess = (payload: { name: string; phone: string; packageName: string }) => {
    triggerWaNotification(
      `Welcome to *Aura Gym & Fitness*, *${payload.name}*! 🏋️‍♀️🔥\n\n` +
      `Your M-PESA transaction KES payment verified. Your *${payload.packageName}* membership is active and confirmed! ✅ See you on the training floor!`
    );
  };

  const shareClass = (name: string) => {
    const waUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
      `Hey! Check out this awesome *${name}* session at Aura Gym Nairobi. Let's schedule this workout together! 🏋️`
    )}`;
    window.open(waUrl, '_blank');
  };

  // Icon mapping helper
  const getIconElement = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-orange-500" />;
      case 'Users': return <Users className="w-6 h-6 text-orange-500" />;
      case 'Apple': return <Apple className="w-6 h-6 text-orange-500" />;
      case 'Dumbbell': return <Dumbbell className="w-6 h-6 text-orange-500" />;
      case 'Flame': return <Flame className="w-6 h-6 text-orange-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-orange-500" />;
      default: return <Dumbbell className="w-6 h-6 text-orange-500" />;
    }
  };

  const filteredGallery = galleryCategory === 'all' 
    ? GALLERY 
    : GALLERY.filter(item => item.category === galleryCategory);

  return (
    <div className={`bg-[#0a0a0c] text-white min-h-screen relative font-sans antialiased overflow-x-hidden ${!isMobileDevice ? 'custom-cursor-active' : ''}`}>
      
      {/* Dynamic Background Noise/Mesh */}
      <div className="absolute top-0 left-0 right-0 h-screen bg-gradient-to-b from-[#ff5e00]/5 via-transparent to-transparent pointer-events-none select-none z-0" />

      {/* Gym Scroll Progress Indicator (Dumbbell/Weight Pulley System) */}
      <GymScrollProgress />

      {/* Header component */}
      <Header 
        currentPage={currentPage}
        onJoinClick={() => setCheckoutOpen(true)} 
        onNavigate={(page, section) => {
          setCurrentPage(page);
          if (section) {
            setTimeout(() => {
              const element = document.getElementById(section);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }, page === 'landing' ? 120 : 0);
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }
        }} 
      />

      {/* LANDING PAGE VIEWS */}
      {currentPage === 'landing' && (
        <>
          {/* 1. HERO SECTION */}
      <section id="hero" className="relative h-screen min-h-[650px] md:min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Absolute Background looping video with high visibility, smooth fit, and static fallback */}
        <div 
          className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-100 ease-out"
          style={{ 
            backgroundImage: `url('/src/assets/images/hero_workout_scene_1781097290681.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.2}px) scale(1.05)`
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-opacity duration-1000"
            src="/api/resolve-video"
            onCanPlay={(e) => {
              (e.target as HTMLVideoElement).style.opacity = "0.8";
            }}
            style={{ opacity: 0 }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 text-center animate-fade-in">
          <div className="inline-flex items-center space-x-2.5 bg-[#0a0a0c]/80 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8 hover:bg-black/90 transition-all duration-300 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest font-mono text-neutral-100">Nairobi's Premier Athletic Arena &bull; Open Active</span>
          </div>

          <h1 className="text-4xl md:text-8xl font-black font-display tracking-tight text-white uppercase leading-none mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.95)]">
            Transform Your Body.<br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 bg-clip-text text-transparent animate-rgb-glow text-glow drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">Transform Your Life.</span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-neutral-100 max-w-3xl mx-auto leading-relaxed font-sans font-medium drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] bg-black/30 md:bg-transparent p-4 md:p-0 rounded-2xl backdrop-blur-[2px] md:backdrop-blur-none">
            Aura is a high-octane physical training sanctuary. Empower your lifting mechanics in our premium Olympic strength cages, expand cardiovascular power in our HIIT zones, and create custom diets with our Gemini AI Coach.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full sm:w-auto px-8 py-4.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-2xl shadow-orange-500/25 cursor-pointer hover:shadow-orange-500/40 hover:-translate-y-0.5 btn-tap-shrink animate-pulse-neon transition-all duration-300 flex items-center justify-center gap-3 font-display text-base"
            >
              <span>Join Now (M-PESA)</span>
              <ArrowUpRight className="w-5 h-5 text-white" />
            </button>
            
            <button
              onClick={() => {
                setCurrentPage('timetable');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="w-full sm:w-auto px-8 py-4.5 bg-neutral-950/70 hover:bg-neutral-900 border border-white/10 hover:border-orange-500/30 text-white font-bold rounded-2xl backdrop-blur-md btn-tap-shrink transition-all duration-300 flex items-center justify-center gap-2 text-base font-display cursor-pointer"
            >
              <span>View Classes Schedule</span>
            </button>
          </div>

          {/* Secure details indicators banner */}
          <div className="mt-16 pt-12 border-t border-white/5 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-neutral-400 max-w-4xl mx-auto text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>Safaricom STK Payment Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-orange-500" />
              <span>Certified Expert Coaches</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>VIP Lockers & Recovery Baths</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="py-24 bg-[#0c0c10] relative">
        {/* Grid backgrounds */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none select-none"
             style={{ backgroundImage: `url('/src/assets/images/gym_interior_zone_1781097304252.png')` }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 px-4 py-2 rounded-full font-mono">
              Core Capabilities
            </span>
            <h2 className="mt-4 text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl">
              High-Performance <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Training Spheres</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              Each discipline is curated under certified supervision. Take structural control of your fitness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((srv, index) => (
              <div
                key={srv.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="bg-[#121216]/80 border border-white/5 rounded-3xl p-8 hover:bg-neutral-900/90 transition-all duration-300 group hover:border-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1 relative animate-feed-in animate-flicker-hover"
              >
                {/* Icon Circle */}
                <div className="p-4 bg-neutral-900 rounded-2xl w-max border border-white/5 group-hover:border-orange-500/20 group-hover:bg-[#ff5e00]/5 transition-colors mb-6">
                  {getIconElement(srv.icon)}
                </div>

                <h3 className="text-xl font-bold text-white font-display group-hover:text-orange-400 transition-colors">
                  {srv.name}
                </h3>
                
                {srv.price && (
                  <span className="inline-block mt-2 font-mono text-[11px] bg-white/5 font-semibold text-neutral-400 px-3 py-1 rounded-full border border-white/5">
                    {srv.price}
                  </span>
                )}

                <p className="mt-4 text-sm text-neutral-400 leading-relaxed font-sans font-light">
                  {srv.description}
                </p>

                {/* Integration triggers */}
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-neutral-500 font-mono">Coach Assumed: active</span>
                  <a
                    href={`https://wa.me/254700000000?text=Hi%20Aura!%20I%20want%20to%20inquire%20about%20the%20${encodeURIComponent(srv.name)}%20program.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-xs font-bold text-orange-500 hover:text-orange-400 btn-tap-shrink group-hover:translate-x-1 transition-transform"
                    aria-label={`Inquire about ${srv.name} on WhatsApp`}
                  >
                    <span>Quick Chat</span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#ff5e00]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT & TRAINER FOCUS SECTION */}
      <section id="about" className="py-24 bg-[#07070a] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text details - Fade-in left effect */}
            <div className="lg:col-span-7 space-y-6 transform translate-x-0 transition-all duration-1000 hover:translate-x-1">
              <div className="flex items-center space-x-3 text-orange-500 font-mono text-sm animate-shimmer-logo mb-2 bg-orange-500/10 px-4 py-1.5 w-max rounded-full font-bold tracking-widest uppercase">
                <Dumbbell className="w-5 h-5 text-orange-500" />
                <span>Aura Gym Elite Logo Shimmer</span>
              </div>
              
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 px-4 py-2 rounded-full font-mono inline-block">
                Who We Are
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
                Our Mission:<br />
                <span className="bg-gradient-to-r from-white via-neutral-100 to-orange-400 bg-clip-text text-transparent">Complete Physiology Dominance</span>
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-sans font-light">
                Aura is not just a commercial gym; we are a disciplined coaching framework. We recruit, certify, and evaluate national standard trainers who understand biochemistry, biomechanical angles, and performance nutrition targets.
              </p>

              {/* Bento style bullets layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                <div className="p-5 bg-neutral-900/60 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300">
                  <Award className="w-8 h-8 text-orange-500 mb-3" />
                  <h4 className="font-bold text-white font-display">International Certs</h4>
                  <p className="mt-1 text-xs text-neutral-400 leading-normal">Coaches are credentialed in metabolic medicine, physical therapy, or lifting biomechanics.</p>
                </div>
                <div className="p-5 bg-neutral-900/60 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-all duration-300">
                  <ShieldCheck className="w-8 h-8 text-orange-500 mb-3" />
                  <h4 className="font-bold text-white font-display">Elite Equipment Matrix</h4>
                  <p className="mt-1 text-xs text-neutral-400 leading-normal">Olympic plates, deadlift zones, structural frames, and curved speed treadmills.</p>
                </div>
              </div>

              {/* Mention WhatsApp trigger */}
              <div className="pt-6 flex items-center space-x-3.5">
                <p className="text-sm text-neutral-400">
                  Have questions regarding your physical conditions?
                </p>
                <a
                  href="https://wa.me/254700000000?text=Hi%20Coach%20Bryan!%20I%20have%20an%20old%20shoulder%20injury%20and%20want%20to%20know%20how%20Aura%20Gym%20can%20help."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-orange-500 hover:text-orange-400 inline-flex items-center gap-1 btn-tap-shrink hover:underline"
                >
                  <span>Consult Coach Bryan</span>
                  <ArrowUpRight className="w-4 h-4 text-[#ff5e00]" />
                </a>
              </div>
            </div>

            {/* Right side trainer photo card with offset borders - Fade-in right & scale effects */}
            <div className="lg:col-span-5 relative transform translate-x-0 transition-all duration-1000 hover:scale-[1.02] hover:-rotate-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-600 rounded-3xl transform rotate-2 scale-102 opacity-20 pointer-events-none" />
              <div className="relative bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/src/assets/images/trainer_team_1781097316216.png" 
                  alt="Aura Gym Elite Athletic Trainer Team"
                  className="w-full h-auto object-cover referrerPolicy='no-referrer' filter saturate-110 brightness-95"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating micro stats */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-md rounded-2xl border border-white/5 flex justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-wider">Coach Staff</span>
                    <span className="text-sm font-bold text-white block">Coach Sara, Ken, Amanda, Bryan</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-wider">Pass Rate</span>
                    <span className="text-sm font-bold text-orange-500 block">100% Certified</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. MEMBER TESTIMONIALS */}
      <section id="testimonials" className="py-24 bg-[#0a0a0c] relative flex items-center justify-center">
        {/* Blurred group frame of trainers as backdrop */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none select-none filter blur-sm"
          style={{ backgroundImage: `url('/src/assets/images/trainer_team_1781097316216.png')` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#ff5e00] uppercase bg-[#ff5e00]/10 px-4 py-2 rounded-full font-mono">
              Life Transformation stories
            </span>
            <h2 className="mt-4 text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl">
              Shattering Limits, <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Earning Results</span>
            </h2>
            <p className="mt-4 text-lg text-neutral-400">
              There is no fake shortcut. Pure sweat indices, functional coach checklists and consistency make physical results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#121216]/90 border border-white/5 rounded-3xl p-8 shadow-xl flex flex-col justify-between hover:border-orange-500/30 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(255,94,0,0.12)] transition-all duration-300"
              >
                <div>
                  {/* Rating Gold Stars */}
                  <div className="flex items-center space-x-1.5 text-amber-500 mb-6">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 animate-pulse" />
                    ))}
                  </div>

                  <p className="text-neutral-300 text-sm leading-relaxed italic font-sans font-light">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center space-x-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0 referrerPolicy='no-referrer'"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-white text-sm font-display">{t.name}</h4>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block">{t.role}</span>
                    <span className="inline-block mt-1 font-mono text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full font-bold">
                      {t.results}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CONTACT & MEMBERSHIP ACTION */}
      <section id="contact" className="py-24 bg-[#0a0a0c] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none select-none"
          style={{ backgroundImage: `url('/src/assets/images/gym_reception_payment_1781097331712.png')` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column details info */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 px-4 py-2 rounded-full font-mono inline-block">
                Connect With Us
              </span>
              
              <h2 className="text-4xl font-extrabold font-display tracking-tight text-white mb-4">
                Let’s Initiate Your <span className="text-orange-500 text-glow">Transformation</span>
              </h2>
              
              <p className="text-neutral-400 text-sm leading-relaxed font-sans">
                Ready to take complete physiological command? Drop your name and authentic Kenyan phone number. We will contact you or message you within 1 hour to lock your gym trial parameters!
              </p>

              {/* Direct Touch channels - WhatsApp button with pulse styling */}
              <div className="space-y-4 pt-4">
                <a
                  href="https://wa.me/254700000000?text=Hi%20Aura%20Fitness!%20I%20want%20to%20register%20for%20my%20trial%20pass."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-2xl flex items-center justify-between gap-4 transition-all btn-tap-shrink animate-whatsapp-pulse shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Instant WhatsApp Touch</span>
                  </div>
                  <span className="text-xs text-green-500 underline font-semibold font-mono">+254 700 000 000</span>
                </a>

                {/* Secure payments verification badges */}
                <div className="p-4 bg-orange-500/5 rounded-2xl border border-white/10 flex items-center justify-between hover:border-orange-500/30 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-orange-500" />
                    <span className="text-xs font-semibold text-neutral-300">We accept Safaricom M-PESA</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">Secure</span>
                </div>
              </div>

              {/* Social Channels - styled with rotation and glow on hover */}
              <div className="pt-6 space-y-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500 block">Follow our Athlete Arena</span>
                <div className="flex items-center space-x-4">
                  <a href="https://instagram.com/aura_fitness" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-900 border border-white/5 hover:border-orange-500/80 hover:text-orange-500 text-neutral-400 rounded-xl hover:-translate-y-1 hover:rotate-6 hover:shadow-[0_0_15px_rgba(255,94,0,0.4)] transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://facebook.com/aura_fitness" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-900 border border-white/5 hover:border-orange-500/80 hover:text-orange-500 text-neutral-400 rounded-xl hover:-translate-y-1 hover:rotate-6 hover:shadow-[0_0_15px_rgba(255,94,0,0.4)] transition-all duration-300">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://tiktok.com/@aura_fitness" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-900 border border-white/5 hover:border-orange-500/80 hover:text-orange-500 text-neutral-400 font-mono text-xs font-bold rounded-xl hover:-translate-y-1 hover:rotate-6 hover:shadow-[0_0_15px_rgba(255,94,0,0.4)] transition-all duration-300">
                     TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column simple callback Form - Form items bounce in effect */}
            <div className="lg:col-span-7 bg-[#121216] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in hover:border-white/10 transition-colors duration-500">
              <h3 className="text-xl font-bold text-white font-display mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-orange-500 animate-pulse" />
                Book Your Posture Scan Slot
              </h3>

              {contactSuccess ? (
                <div className="p-6 bg-green-500/15 border border-green-500/30 text-green-400 rounded-2xl text-center space-y-3 animate-scale-up">
                  <Check className="w-12 h-12 mx-auto stroke-[3px]" />
                  <h4 className="font-bold text-lg">Inquiry Delivered Successfully!</h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Check your virtual WhatsApp notifications below! We queued you safely in Coach Bryan’s pipeline.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="transition-all duration-500 transform hover:translate-y-[-1px]">
                      <label htmlFor="input-name-field" className="block text-xs font-bold uppercase text-neutral-400 mb-2">My Full Name</label>
                      <input
                        type="text"
                        id="input-name-field"
                        required
                        placeholder="e.g. Ken Njuguna"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none input-focus-glow transition-all"
                      />
                    </div>
                    <div className="transition-all duration-500 transform hover:translate-y-[-1px]">
                      <label htmlFor="input-phone-field" className="block text-xs font-bold uppercase text-neutral-400 mb-2">WhatsApp Phone (07...)</label>
                      <input
                        type="tel"
                        id="input-phone-field"
                        required
                        placeholder="e.g. 0711223344"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-orange-500 focus:outline-none input-focus-glow transition-all"
                      />
                    </div>
                  </div>

                  <div className="transition-all duration-500 transform hover:translate-y-[-1px]">
                    <label htmlFor="input-msg-field" className="block text-xs font-bold uppercase text-neutral-400 mb-2">Tell us your targets & limits</label>
                    <textarea
                      id="input-msg-field"
                      rows={3}
                      placeholder="e.g. I want to build strength and recover structural knee joints stability."
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white focus:border-orange-500 focus:outline-none input-focus-glow transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer font-display btn-tap-shrink animate-pulse-neon"
                  >
                    <span>Request Complimentary Consultation Slot</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
        </>
      )}

      {/* TIMETABLE DEDICATED PAGE */}
      {currentPage === 'timetable' && (
        <div className="animate-fade-in relative z-10">
          {/* Elegant header banner */}
          <div className="relative pt-32 pb-16 bg-[#0a0a0c] overflow-hidden border-b border-white/5">
            <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#ff5e00]/10 to-transparent pointer-events-none select-none z-0" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 px-4 py-2 rounded-full font-mono inline-block">
                Weekly Class Matrix
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tight leading-none mb-4">
                Class <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Schedule Timetable</span>
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
                Secure your position. Select from clinical power weightlifting, extreme metabolic HIIT conditioning, posture alignment, and restorative wellness slots.
              </p>
              
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="mt-6 text-xs font-mono uppercase tracking-widest text-orange-500 hover:text-orange-400 font-bold hover:underline inline-flex items-center gap-2 cursor-pointer btn-tap-shrink"
              >
                <span>&larr; Back to Main Sanctuary</span>
              </button>
            </div>
          </div>
          
          <div className="bg-[#0c0c10] py-12">
            <ScheduleSection onNotifyWhatsApp={triggerWaNotification} />
          </div>
        </div>
      )}

      {/* AI COACH DEDICATED PAGE */}
      {currentPage === 'aicoach' && (
        <div className="animate-fade-in relative z-10">
          {/* Elegant header banner */}
          <div className="relative pt-32 pb-16 bg-[#0a0a0c] overflow-hidden border-b border-white/5">
            <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#ff5e00]/10 to-transparent pointer-events-none select-none z-0" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <span className="text-xs font-bold tracking-widest text-[#ff5e00] uppercase bg-[#ff5e00]/10 px-4 py-2 rounded-full font-mono inline-block">
                Empowered by Gemini AI Agent
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tight leading-none mb-4">
                Virtual AI <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Direct Coach</span>
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
                Tailor an elite, individualized gym, nutrition and hydration workout blueprint customized in real-time. Fast-tracked for your exact metabolic age, weight, and fitness benchmarks.
              </p>
              
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="mt-6 text-xs font-mono uppercase tracking-widest text-orange-400 hover:text-orange-300 font-bold hover:underline inline-flex items-center gap-2 cursor-pointer btn-tap-shrink"
              >
                <span>&larr; Back to Main Sanctuary</span>
              </button>
            </div>
          </div>
          
          <AICoach onNotifyWhatsApp={triggerWaNotification} />
        </div>
      )}

      {/* GALLERY DEDICATED PAGE */}
      {currentPage === 'gallery' && (
        <div className="animate-fade-in relative z-10">
          {/* Elegant header banner */}
          <div className="relative pt-32 pb-16 bg-[#0a0a0c] overflow-hidden border-b border-white/5">
            <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#ff5e00]/10 to-transparent pointer-events-none select-none z-0" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-[#ff5e00]/10 px-4 py-2 rounded-full font-mono inline-block">
                Atmosphere Gallery
              </span>
              <h1 className="mt-4 text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tight leading-none mb-4">
                Our Athletic <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Gym & Turf</span>
              </h1>
              <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-400 font-sans font-light leading-relaxed">
                Browse through raw, high-intensity moments captured on our Westlands turf floor, clean premium recovery spaces, and real member achievements.
              </p>
              
              <button
                onClick={() => {
                  setCurrentPage('landing');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="mt-6 text-xs font-mono uppercase tracking-widest text-orange-500 hover:text-orange-400 font-bold hover:underline inline-flex items-center gap-2 cursor-pointer btn-tap-shrink"
              >
                <span>&larr; Back to Main Sanctuary</span>
              </button>
            </div>
          </div>

          {/* 6. INTERACTIVE GALLERY / TRANSFORMATION CAROUSEL */}
          <section id="gallery" className="py-24 bg-[#0a0a0c] relative orange-grid-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-bold tracking-widest text-[#ff5e00] uppercase bg-[#ff5e00]/10 px-4 py-2 rounded-full font-mono">
                  Gym Visualized
                </span>
                <h2 className="mt-4 text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl">
                  Sparks inside our <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Athletic Temple</span>
                </h2>
                <p className="mt-4 text-lg text-neutral-400">
                  Browse our training zones, athlete squads in action, and verified 6-month structural body transformations.
                </p>
              </div>

              {/* Section categories filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['all', 'facilities', 'classes', 'transformations'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setGalleryCategory(cat as any)}
                    className={`py-2 px-5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all duration-300 font-mono ${
                      galleryCategory === cat
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                        : 'bg-neutral-900 border-white/5 text-neutral-400 hover:text-white hover:border-white/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Gallery Carousel Grid (Swipe-friendly inertia scroll with snap alignment on mobile) */}
              <div className="flex overflow-x-auto overflow-y-hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 scrollbar-thin scrollbar-thumb-orange-500 max-w-7xl mx-auto">
                {filteredGallery.map((img) => (
                  <div
                    key={img.id}
                    className="group relative bg-[#121216] rounded-3xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-500 shadow-xl snap-start shrink-0 w-[290px] md:w-auto hover:scale-[1.02] hover:-rotate-1 hover:shadow-orange-500/10"
                  >
                    {/* 3D aspect zooming image container */}
                    <div className="aspect-video w-full overflow-hidden relative">
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-90 group-hover:saturate-110 brightness-90 group-hover:brightness-100"
                      />
                      {/* Neon vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="p-5 relative z-10 bg-gradient-to-b from-transparent to-black">
                      <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest">{img.category}</span>
                      <h4 className="mt-1 font-bold text-white text-md font-display leading-tight">{img.title}</h4>
                      
                      {/* Share button integrations */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 font-mono">Aura Core Media</span>
                        <button
                          onClick={() => {
                            const waUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
                              `Check out the amazing *${img.title}* facility at Aura Gym! Join next week: https://fitness-coaching-62.aura.build/`
                            )}`;
                            window.open(waUrl, '_blank');
                          }}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white btn-tap-shrink transition-colors"
                          title="Share to WhatsApp"
                        >
                          <Share2 className="w-4 h-4 text-[#ff5e00]" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#050507] border-t border-white/5 py-12 text-center text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-widest">AURA FIT</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            Nairobi Athletic Turf, Ground Floor Westlands Building, Ring Road. Unleash clinical physical power under certified guidance in beautiful neon atmosphere.
          </p>
          <div className="pt-6 border-t border-white/5 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Aura Gym Inc. M-PESA is a certified registered Safaricom TM. All rights active.
          </div>
        </div>
      </footer>

      {/* GLOBAL SIMULATED WHATSAPP NOTIFIER BANNER BUBBLE */}
      {waNotification && waNotification.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in w-full max-w-sm bg-[#121216] border border-green-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-green-500/10">
          <div className="bg-[#075e54] p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-bold text-xs block font-sans">AURA FIT - Trainer Bryan</span>
                <span className="text-[10px] text-green-200 block font-mono">Auto Notifications Agent</span>
              </div>
            </div>
            
            <button
              onClick={() => setWaNotification(prev => prev ? { ...prev, show: false } : null)}
              className="p-1 hover:bg-white/10 text-green-100 rounded-lg"
              title="Close System alert"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="p-4 bg-[#233329]/80 backdrop-blur-md">
            <p className="text-xs text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#2c3e50]/40 p-3 rounded-xl border border-white/5">
              {waNotification.message}
            </p>
            
            <div className="mt-3.5 flex items-center gap-1.5 justify-end text-[9px] text-green-400 font-mono font-medium tracking-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              <span>Simulated WhatsApp Push Delivered</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky bottom CTA bar with neon pulse */}
      {isMobileDevice && scrollY > 250 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 p-4.5 flex items-center justify-between shadow-2xl animate-scale-up">
          <div>
            <span className="block text-[9px] uppercase font-mono tracking-widest text-neutral-400">Exclusive Trial Pass</span>
            <span className="text-sm font-black text-white font-display uppercase tracking-tight block">AURA VIP SHIFT</span>
          </div>
          <button
            onClick={() => setCheckoutOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#ff5e00] to-[#e60000] text-white font-black text-xs uppercase tracking-widest rounded-xl animate-pulse-neon btn-tap-shrink shadow-lg shadow-orange-500/20 whitespace-nowrap"
          >
            Join VIP Now
          </button>
        </div>
      )}

      {/* Custom Crosshair Neon Cursor for desktops with optimized zero-latency tracking */}
      {!isMobileDevice && (
        <>
          {/* Main glowing ring */}
          <div 
            ref={cursorRingRef}
            className="fixed pointer-events-none z-50 rounded-full border-2 mix-blend-screen shadow-[0_0_15px_rgba(255,94,0,0.5)] transition-[width,height,background-color,border-color] duration-150 ease-out"
            style={{ 
              width: isHoveringCta ? '56px' : '32px',
              height: isHoveringCta ? '56px' : '32px',
              backgroundColor: isHoveringCta ? 'rgba(255, 94, 0, 0.1)' : 'transparent',
              borderColor: isHoveringCta ? '#fb923c' : '#f97316',
              left: 0,
              top: 0,
              transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)'
            }}
          />
          {/* Internal point/crosshair */}
          <div 
            ref={cursorDotRef}
            className="fixed pointer-events-none z-50 rounded-full transition-[width,height,background-color] duration-150 ease-out"
            style={{ 
              width: isHoveringCta ? '12px' : '6px',
              height: isHoveringCta ? '12px' : '6px',
              backgroundColor: isHoveringCta ? '#fb923c' : '#f97316',
              left: 0,
              top: 0,
              transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)'
            }}
          />
        </>
      )}

      {/* Membership checkout modal overlay */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}

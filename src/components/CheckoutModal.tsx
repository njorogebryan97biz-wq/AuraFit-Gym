/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Smartphone, Check, ArrowRight, Loader } from 'lucide-react';
import { PLANS } from '../data';
import { MembershipPlan } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payload: { name: string; phone: string; packageName: string }) => void;
}

export default function CheckoutModal({ isOpen, onClose, onPaymentSuccess }: CheckoutModalProps) {
  const [step, setStep] = React.useState<'plans' | 'form' | 'progress' | 'success'>('plans');
  const [selectedPlan, setSelectedPlan] = React.useState<MembershipPlan>(PLANS[0]);
  
  // Form inputs
  const [userName, setUserName] = React.useState('');
  const [userPhone, setUserPhone] = React.useState('');
  
  // Progress states
  const [progressStep, setProgressStep] = React.useState(0);
  const [progressLogs, setProgressLogs] = React.useState<string[]>([]);
  const [waMessage, setWaMessage] = React.useState('');

  const mpesaLogo = "https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg";

  React.useEffect(() => {
    if (isOpen) {
      setStep('plans');
      setProgressStep(0);
      setProgressLogs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNextToForm = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setStep('form');
  };

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    const regex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    return regex.test(cleaned);
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Please provide your authentic name for registration.");
      return;
    }
    if (!validatePhone(userPhone)) {
      alert("Please provide a valid M-PESA compliant phone number (e.g., 0712345678 or 254712345678).");
      return;
    }

    setStep('progress');
    setProgressLogs(['Establishing secure tunnel handshake with Safaricom Daraja API gateway...']);
    setProgressStep(1);

    // Call simulated payment endpoint on the server
    try {
      const payRes = await fetch('/api/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: userPhone,
          name: userName,
          amount: selectedPlan.price,
          packageName: selectedPlan.name
        })
      });

      const payData = await payRes.json();
      if (!payData.success) {
        throw new Error(payData.error || "STK Push failed.");
      }

      // Step 2 timer
      setTimeout(() => {
        setProgressLogs(prev => [
          ...prev, 
          `Secure STK Push request triggered successfully! Checkout Code: ${payData.checkoutRequestID}`,
          `PLEASE CHOOSE A SAFE SPOT, VIEW YOUR PHONE SCREEN AND ENTER YOUR M-PESA PASSCODE PIN WITHIN THE SAFARICOM DIALOG BOX NOW...`
        ]);
        setProgressStep(2);
      }, 1500);

      // Step 3 timer
      setTimeout(() => {
        setProgressLogs(prev => [
          ...prev,
          `PIN received. Processing electronic ledger clearance with Central Bank authorization systems...`
        ]);
        setProgressStep(3);
      }, 3500);

      // Step 4 Success timer
      setTimeout(async () => {
        // Retrieve beautiful dynamic WhatsApp confirmation from backend
        try {
          const waRes = await fetch('/api/whatsapp-callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: userPhone,
              name: userName,
              packageName: selectedPlan.name
            })
          });
          const waData = await waRes.json();
          if (waData.success) {
            setWaMessage(waData.formattedMessage);
          }
        } catch (err) {
          console.warn(err);
        }

        setProgressLogs(prev => [...prev, `M-PESA transaction successfully verified! Welcome as Aura champion!`]);
        setProgressStep(4);
        setStep('success');
        onPaymentSuccess({ name: userName, phone: userPhone, packageName: selectedPlan.name });
      }, 5500);

    } catch (err: any) {
      alert(err || "Check connection status.");
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Black glass overlay */}
      <div className="fixed inset-0 bg-[#000]/80 backdrop-blur-md" onClick={onClose} />

      {/* Main Glass Modal - Slide-in Right motion effect */}
      <div className="bg-[#121216]/95 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col md:flex-row animate-slide-in">
        
        {/* Close Switch */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white rounded-xl hover:scale-110 transition-all z-20"
          aria-label="Close Checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Left Side (Billing Summary or Motivation) */}
        <div className="md:w-5/12 bg-[#1b1b22] p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 select-none pointer-events-none"
               style={{ backgroundImage: `url('/src/assets/images/gym_reception_payment_1781097331712.png')` }} />
          
          <div className="relative z-10">
            <span className="font-mono text-xs text-orange-400 font-bold uppercase tracking-widest">Aura Secured Checkout</span>
            <h4 className="mt-2 text-2xl font-bold text-white font-display">Power Unleashed</h4>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-sans">
              "An investment in cellular strength and endocrine power is the absolute highest reward currency. Stay consistent, stay humble."
            </p>
          </div>

          <div className="mt-12 space-y-4 pt-6 border-t border-white/5 relative z-10">
            <h5 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-400">Selected Pass Summary</h5>
            <div className="p-4 bg-neutral-900 rounded-2xl border border-white/5">
              <span className="text-xs font-bold font-mono text-orange-500">{selectedPlan.billingPeriod}</span>
              <h4 className="text-lg font-bold text-white mt-1">{selectedPlan.name}</h4>
              <p className="text-2xl font-extrabold font-display text-white mt-3.5">
                KES {selectedPlan.price.toLocaleString()}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span>Safaricom M-PESA STK Verified Gateway</span>
            </div>
          </div>
        </div>

        {/* Modal Right Side (Steps Controller) */}
        <div className="md:w-7/12 p-8 flex flex-col justify-center">
          
          {/* Step 1: Browse Membership Level Options */}
          {step === 'plans' && (
            <div className="animate-fade-in space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white font-display">Select Membership Tier</h3>
                <p className="text-sm text-neutral-400 mt-1">Select the subscription model that works for your schedule.</p>
              </div>

              <div className="space-y-3">
                {PLANS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 ${
                      selectedPlan.id === p.id
                        ? 'bg-orange-500/10 border-orange-500 shadow-xl'
                        : 'bg-neutral-900 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2 text-sm md:text-md font-display">
                        {p.name}
                        {p.popular && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-orange-500 text-white font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-snug">
                        {p.features[0]} &middot; {p.features[1]}
                      </p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      <span className="text-lg font-bold font-display text-white">
                        KES {p.price.toLocaleString()}
                      </span>
                      <p className="text-[10px] text-neutral-500 font-mono font-medium lowercase">
                        {p.billingPeriod}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleNextToForm(selectedPlan)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Pay details form */}
          {step === 'form' && (
            <form onSubmit={handleInitiatePayment} className="animate-fade-in space-y-6">
              <div>
                <button
                  type="button"
                  onClick={() => setStep('plans')}
                  className="text-xs font-mono text-orange-500 mb-2 hover:underline inline-flex items-center gap-1"
                >
                  &larr; Back to Packages
                </button>
                <h3 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-orange-500" />
                  M-PESA Digital Wallet
                </h3>
                <p className="text-sm text-neutral-400 mt-1">Enter your details to initiate an instant STK Push pin prompt.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="user-name" className="block text-xs font-bold uppercase text-neutral-400 mb-2">Full Legal Name</label>
                  <input
                    type="text"
                    id="user-name"
                    required
                    placeholder="e.g. Bryan Njoroge"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-white focus:border-orange-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="user-phone" className="block text-xs font-bold uppercase text-neutral-400 mb-1">M-PESA Phone Number</label>
                  <p className="text-[10px] text-neutral-500 mb-2">Accepts formats: 0712345678 or 254712345678</p>
                  <input
                    type="tel"
                    id="user-phone"
                    required
                    placeholder="e.g. 0712345678"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/5 rounded-xl px-4 py-3.5 text-white font-mono focus:border-orange-500 focus:outline-none transition-colors placeholder-neutral-600"
                  />
                </div>
              </div>

              {/* Verified Badge / Secure Badge */}
              <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <img src={mpesaLogo} alt="M-PESA logo" className="h-8 w-auto referrerPolicy='no-referrer'" />
                  <div>
                    <span className="text-[11px] font-bold text-white font-sans block">Safaricom Secure Pay</span>
                    <span className="text-[10px] text-neutral-400 block">Encrypted via Central bank ledger</span>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#7cfc00]/10 hover:bg-[#7cfc00]/20 border border-[#7cfc00]/30 text-[#befc0b] font-bold rounded-xl shadow-lg transition-all duration-300 uppercase tracking-wide flex items-center justify-center gap-2 font-display"
              >
                <span>Pay with M-PESA in 2 clicks</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 3: STK Progress logging logs */}
          {step === 'progress' && (
            <div className="animate-fade-in space-y-6 py-6 text-center">
              <div className="relative inline-block">
                <Loader className="w-16 h-16 animate-spin text-orange-500 mx-auto" />
                <img src={mpesaLogo} alt="M-PESA logo" className="h-5 absolute top-5.5 left-5.5 referrerPolicy='no-referrer'" />
              </div>

              <div>
                <h4 className="text-xl font-bold font-display text-white">Awaiting PIN Authentication</h4>
                <p className="text-xs text-orange-500 font-mono mt-1.5 animate-pulse">DO NOT REFRESH &bull; SAFARICOM STK PROMPT FIRED</p>
              </div>

              <div className="bg-[#1b1b22]/70 rounded-2xl p-4 text-left border border-white/5 max-h-[160px] overflow-y-auto space-y-2 font-mono text-xs text-neutral-400 divide-y divide-white/5 scrollbar-thin">
                {progressLogs.map((log, idx) => (
                  <div key={idx} className="pt-2 flex items-start gap-1.5 text-neutral-300">
                    <span className="text-orange-500 shrink-0">&raquo;</span>
                    <span className="leading-relaxed">{log}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                <span>Standard verification takes ~10 seconds.</span>
              </div>
            </div>
          )}

          {/* Step 4: Success, show auto WhatsApp bubble */}
          {step === 'success' && (
            <div className="animate-fade-in space-y-6 text-center">
              {/* Massive bounce & scale checkmark with shimmer */}
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/30 text-4xl animate-scale-up animate-pulse-neon">
                <Check className="w-10 h-10 text-white stroke-[3px]" />
              </div>

              <div>
                <h3 className="text-3xl font-extrabold font-display text-white">Payment CONFIRMED!</h3>
                <p className="text-sm text-neutral-400 mt-1">Your smart wellness pass and AI Planner have been fully unlocked.</p>
              </div>

              {/* WhatsApp auto notification layout preview with fade-in and shimmer */}
              {waMessage && (
                <div className="mt-6 border border-white/5 rounded-2xl p-4 bg-[#075e54]/5 text-left shadow-inner text-neutral-300 animate-slide-in animate-shimmer-logo">
                  <div className="flex items-center space-x-2 border-b border-white/5 pb-2.5 mb-2.5">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-mono text-[10px] uppercase font-bold text-green-400 tracking-wider">Aura WhatsApp Notification System</span>
                  </div>
                  <div className="bg-[#2c3e50]/40 p-3.5 rounded-xl border border-white/5 font-sans text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                    {waMessage}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold rounded-xl transition-all"
              >
                Launch Workout Arena
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

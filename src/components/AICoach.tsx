/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Send, Copy, FileText, Share2, Target, Info, RefreshCw, Check } from 'lucide-react';

interface AICoachProps {
  onNotifyWhatsApp: (msg: string) => void;
}

export default function AICoach({ onNotifyWhatsApp }: AICoachProps) {
  const [formData, setFormData] = React.useState({
    age: 26,
    weight: 75,
    goal: 'Gain lean muscular mass',
    level: 'Intermediate',
    focusArea: 'Upper body power & Core',
    extraNotes: ''
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [stepMessage, setStepMessage] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  
  // Results
  const [result, setResult] = React.useState<{
    workoutPlan: string;
    nutritionTips: string;
    hydrationSchedule: string;
    trainerNote: string;
  } | null>(null);

  const goalOptions = [
    'Gain lean muscular mass',
    'Rapid visceral fat loss',
    'Improve raw strength & heavy lifts',
    'Conditioning & HIIT Endurance',
    'Post-injury corrective recovery',
    'Spinal flexibility & balance'
  ];

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Competition Elite'];

  const loadingSteps = [
    'Scanning athlete physiological data...',
    'Consulting Coach Bryan\'s core workout protocols...',
    'Factoring in clinical metabolic nutrition targets...',
    'Injecting extreme motivation vectors...',
    'Assembling your ultra-dynamic customized program...'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    // Dynamic loading text increments
    let currentStep = 0;
    setStepMessage(loadingSteps[0]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < loadingSteps.length) {
        setStepMessage(loadingSteps[currentStep]);
      }
    }, 900);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.success) {
        setResult({
          workoutPlan: data.workoutPlan,
          nutritionTips: data.nutritionTips,
          hydrationSchedule: data.hydrationSchedule,
          trainerNote: data.trainerNote
        });
        
        onNotifyWhatsApp(`Aura AI Coach: Customized workout blueprint for *${formData.goal}* generated successfully. Tap inside wellness dashboard to view meal targets! 🏋️✨`);
      } else {
        throw new Error("Could not construct custom plan.");
      }
    } catch (error) {
      console.error(error);
      clearInterval(interval);
      // Fallback
      setResult({
        workoutPlan: `**Aura Gym 7-Day Athletic Plan (${formData.level} - ${formData.goal})**\n\n` +
          `* **Day 1: Upper Body Strength & Core Power** - Bench Press 4x8, Shoulder Press 3x10, Incline Dumbbell Flyes 3x12, Hanging Leg Raises 4x15. Focus: Clean form, 90-sec rest.\n` +
          `* **Day 2: Cardio Endurance & HIIT Burn** - Row Machine 500m intervals x 6, Treadmill incline sprints (30s sprint/30s rest x 12). Focus on the Cardio Zone.\n` +
          `* **Day 3: Rest & Mobility** - Dynamic stretching, 20-min walking or passive recovery yoga.\n` +
          `* **Day 4: Posterior Chain & Lower Body Power** - Squats/Deadlifts 4x6, Barbell Hip Thrusts 3x10, Bulgarian Split Squats 3x12, Calf raises 4x20.\n` +
          `* **Day 5: High-Performance Conditioning** - Kettlebell Swings 3x20, Medicine ball slams 3x15, Battle ropes 4x30s. Cardio intensive.\n` +
          `* **Day 6: Functional Agility & Core** - Planks, Russian twists, agility ladder drills, and 3km aerobic run under 15 mins.\n` +
          `* **Day 7: Full Regeneration & Body Healing** - Hot/cold bath, gentle full body foam rolling, and mild flexibility sequence.`,
        nutritionTips: `**Macro-Nutritional Guide for Aura Athletes**\n\n` +
          `- **Daily Target**: ~2200-2600 active calories based on structural intensity.\n` +
          `- **Protein Intake**: 1.8g - 2.0g per kg of bodyweight to accelerate myofibrillar repair. Sources: Lean poultry, tilapia, eggs, and dynamic plant proteins.\n` +
          `- **Carbohydrate Timing**: Load complex carbs (oatmeal, sweet potatoes) 90-mins pre-workout. Fast-absorbing carb + amino boost post-workout.\n` +
          `- **Healthy Fats**: Keep intake to 20% of total load (avocados, premium seeds, organic olive oil) for optimal endocrine support.`,
        hydrationSchedule: `**Active Hydration Protocol**\n\n` +
          `- **Morning Dawn**: 500ml pure filtered water with a pinch of organic pink salt.\n` +
          `- **Pre-Training Window**: 400ml water accompanied by raw B_complex amino acids.\n` +
          `- **Intra-Workout**: Take structured small sips (approx. 150ml every 15 minutes) with added coconut electrolytes.\n` +
          `- **Post-Training Rest**: 600ml pure water with micro-filtered clean proteins and amino isolates. Total targeted daily hydrate: 3.5 - 4.0 Litres.`,
        trainerNote: `Hey Athlete! At Aura Fitness, we don't just count reps; we make reps count. Level ${formData.level} for ${formData.goal} requires focus, discipline, and structural commitment. Follow this personalized blueprint, stay hydrated, and remember that real transformation begins when you feel like stopping. Bring the absolute heat to your sessions! - Trainer Bryan`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const textToCopy = `AURA GYM AI PLAN\n\nWORKOUT PLAN:\n${result.workoutPlan}\n\nNUTRITION TIPS:\n${result.nutritionTips}\n\nHYDRATION:\n${result.hydrationSchedule}\n\nCOACH NOTE:\n${result.trainerNote}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!result) return;
    const waUrl = `https://wa.me/254700000000?text=${encodeURIComponent(
      `Hi Coach Bryan! I just generated my personal plan for *${formData.goal}* at Aura Gym. Look forward to doing this in the weightlifting zone!`
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section id="ai-coach" className="py-24 bg-gradient-to-b from-[#0a0a0c] to-[#121216]/90 relative overflow-hidden">
      {/* Decorative radial gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-[#ff5e00] uppercase bg-[#ff5e00]/10 px-4 py-2 rounded-full font-mono flex items-center justify-center gap-2 w-max mx-auto shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Gemini AI
          </span>
          <h2 className="mt-4 text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl">
            Custom <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">AI Plan Creator</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Tell Aura’s neural brain your stats and physical limits. Our customized coach algorithmic model creates an instant 7-day workouts, macro nutrition, and hydration sequence in real-time.
          </p>
        </div>

        {/* Form & Output Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Bento-Style Form Card */}
          <div className="lg:col-span-5 bg-[#121216] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-2.5">
              <Target className="w-5 h-5 text-orange-500" />
              Athlete Profile Setup
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Grid age + weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="input-age" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Age (yrs)</label>
                  <input
                    type="number"
                    id="input-age"
                    min="14"
                    max="90"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                    className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-orange-500 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="input-weight" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono">Weight (kg)</label>
                  <input
                    type="number"
                    id="input-weight"
                    min="35"
                    max="200"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 75 })}
                    className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white font-mono focus:border-orange-500 focus:outline-none transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Goal Option Selector */}
              <div>
                <label htmlFor="input-goal" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Primary Objective</label>
                <select
                  id="input-goal"
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-neutral-200 focus:border-orange-500 focus:outline-none transition-all duration-200"
                >
                  {goalOptions.map((goalOpt) => (
                    <option key={goalOpt} value={goalOpt}>{goalOpt}</option>
                  ))}
                </select>
              </div>

              {/* Training Level */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Your Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                  {levelOptions.map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setFormData({ ...formData, level: lvl })}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all duration-200 ${
                        formData.level === lvl
                          ? 'bg-orange-500/10 border-orange-500 text-white shadow'
                          : 'bg-[#1b1b22] border-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Area */}
              <div>
                <label htmlFor="input-focus" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Muscle focus area</label>
                <input
                  type="text"
                  id="input-focus"
                  placeholder="e.g. Abs, legs strength, posture alignment"
                  value={formData.focusArea}
                  onChange={(e) => setFormData({ ...formData, focusArea: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Condition/Notes */}
              <div>
                <label htmlFor="input-notes" className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Injuries or special constraints (Optional)</label>
                <textarea
                  id="input-notes"
                  rows={2}
                  placeholder="e.g. slight lower back twinge, home setup only"
                  value={formData.extraNotes}
                  onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                  className="w-full bg-[#1b1b22] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:border-orange-500 focus:outline-none transition-all duration-200 resize-none resize-y"
                />
              </div>

              {/* Launch CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>Analyzing Bio-Metrics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Generate Blueprint Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Plan Display / Loader Card */}
          <div className="lg:col-span-7 h-full flex flex-col">
            {isLoading ? (
              <div className="flex-1 bg-[#121216]/60 border border-white/5 rounded-3xl p-10 flex flex-col justify-center items-center text-center shadow-2xl min-h-[480px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-8" />
                  <Sparkles className="w-6 h-6 text-orange-500 absolute top-5 left-5 animate-ping" />
                </div>
                <h4 className="text-xl font-bold font-display text-white">Synthesizing Custom Blueprint</h4>
                <p className="mt-2.5 text-orange-500 font-mono text-sm max-w-sm animate-pulse">
                  {stepMessage}
                </p>
                <div className="mt-6 flex flex-col gap-2 max-w-xs text-xs text-neutral-500">
                  <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Computing caloric threshold target</span>
                  <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Incorporating cardiovascular periods</span>
                  <span className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500" /> Structuring spinal decompress schedules</span>
                </div>
              </div>
            ) : result ? (
              <div className="flex-1 bg-[#121216] border border-white/5 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Dashboard Controls */}
                <div className="bg-[#1b1b22] px-6 py-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="ml-2.5 font-mono text-xs text-neutral-400">Aura AI Agent Program v2.5</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors duration-150 flex items-center gap-1.5 text-xs"
                      title="Copy Plan To Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors duration-150 flex items-center gap-1.5 text-xs"
                      title="Send Workout Summary through WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Main Program Output Pane */}
                <div className="p-6 overflow-y-auto max-h-[500px] space-y-8 divide-y divide-white/5">
                  {/* Coach Note Hero Bubble */}
                  <div className="bg-gradient-to-br from-[#ff5e00]/10 to-red-600/5 border border-orange-500/20 p-5 rounded-2xl relative">
                    <h5 className="font-mono text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">MESSAGES FROM COACH BRYAN</h5>
                    <p className="text-neutral-200 text-sm italic font-sans relative z-10 leading-relaxed">
                      "{result.trainerNote}"
                    </p>
                    <div className="absolute right-4 bottom-1 text-8xl font-serif text-white/[0.02] select-none select-none pointer-events-none">“</div>
                  </div>

                  {/* 1. Workout Program */}
                  <div className="pt-6">
                    <h4 className="flex items-center gap-2 text-md font-bold text-white uppercase font-mono tracking-wider mb-4 text-orange-400">
                      <FileText className="w-4 h-4" /> 
                      Your 7-Day Active Regimen
                    </h4>
                    <pre className="text-sm text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#1b1b22]/40 p-4 rounded-xl border border-white/5">
                      {result.workoutPlan}
                    </pre>
                  </div>

                  {/* 2. Metabolic Nutrition Tips */}
                  <div className="pt-6">
                    <h4 className="flex items-center gap-2 text-md font-bold text-white uppercase font-mono tracking-wider mb-4 text-orange-400">
                      <Target className="w-4 h-4" /> 
                      Performance Fuel Guidelines
                    </h4>
                    <pre className="text-sm text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#1b1b22]/40 p-4 rounded-xl border border-white/5">
                      {result.nutritionTips}
                    </pre>
                  </div>

                  {/* 3. Hydration Cycles */}
                  <div className="pt-6">
                    <h4 className="flex items-center gap-2 text-md font-bold text-white uppercase font-mono tracking-wider mb-4 text-orange-400">
                      <Sparkles className="w-4 h-4" /> 
                      Optimal Hydration Sequence
                    </h4>
                    <pre className="text-sm text-neutral-300 font-sans whitespace-pre-wrap leading-relaxed bg-[#1b1b22]/40 p-4 rounded-xl border border-white/5">
                      {result.hydrationSchedule}
                    </pre>
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <div className="p-4 bg-neutral-900 border-t border-white/5 flex items-center gap-2.5 text-xs text-neutral-500">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Always check your form parameters with onsite Coach Bryan. Adjust weight loads strictly according to heart rates logs.</span>
                </div>
              </div>
            ) : (
              // Empty/Awaiting State
              <div className="flex-1 bg-neutral-900/40 border border-white/5 border-dashed rounded-3xl py-20 px-6 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden min-h-[480px]">
                <div className="p-4 bg-orange-500/10 rounded-2xl mb-5">
                  <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <h4 className="text-xl font-bold font-display text-white">Your Custom Blueprint Gym Plan Appears Here</h4>
                <p className="mt-2 text-sm text-neutral-400 max-w-sm">
                  Complete your training targets on the left form and hit "Generate Blueprint Plan" to command our trainer networks.
                </p>
                
                {/* Fake background styling layout blocks */}
                <div className="absolute top-4 left-4 w-12 h-1 bg-white/[0.01]" />
                <div className="absolute bottom-4 right-4 w-16 h-1 bg-white/[0.01]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

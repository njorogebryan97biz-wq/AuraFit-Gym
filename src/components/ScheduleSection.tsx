/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { SCHEDULE } from '../data';
import { ClassScheduleItem } from '../types';

interface ScheduleSectionProps {
  onNotifyWhatsApp: (msg: string) => void;
}

export default function ScheduleSection({ onNotifyWhatsApp }: ScheduleSectionProps) {
  const [selectedDay, setSelectedDay] = React.useState<ClassScheduleItem['day']>('Monday');
  const [bookedClassId, setBookedClassId] = React.useState<string | null>(null);
  const [showBookSuccess, setShowBookSuccess] = React.useState<string | null>(null);

  const days: ClassScheduleItem['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const filteredSchedule = SCHEDULE.filter((item) => item.day === selectedDay);

  const handleBook = (item: ClassScheduleItem) => {
    setBookedClassId(item.id);
    
    // Simulate booking with 1 second delay
    setTimeout(() => {
      setBookedClassId(null);
      setShowBookSuccess(item.className);
      
      onNotifyWhatsApp(`Aura Booking Alert: You have reserved a spot for *${item.className}* at *${item.time}* on *${item.day}* with trainer *${item.trainer}*. Get ready to sweat! 💪`);
      
      // Clear success alert after 4 seconds
      setTimeout(() => {
        setShowBookSuccess(null);
      }, 4000);
    }, 1000);
  };

  return (
    <section id="schedule" className="py-24 bg-[#0a0a0c] relative overflow-hidden orange-grid-light">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-orange-500 uppercase bg-orange-500/10 px-4 py-2 rounded-full font-mono">
            Weekly Timetable
          </span>
          <h2 className="mt-4 text-4xl font-extrabold font-display tracking-tight text-white sm:text-5xl">
            Choose Your <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">Power Session</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            From sunrise cardio burners to sunset heavyweight lifting. Choose a slot of your convenience, reserve with 1-click, and unlock the warrior within you.
          </p>
        </div>

        {/* Dynamic Day Filters Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 font-display ${
                selectedDay === day
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/20 scale-105'
                  : 'bg-neutral-900 border border-white/5 text-neutral-400 hover:text-white hover:border-orange-500/30'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Timetable Rows Grid */}
        <div className="bg-[#121216]/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
          {filteredSchedule.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-neutral-400 text-lg">No classes scheduled on this day. Explore off-peak practice spaces or book personal sessions with Coach Bryan.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredSchedule.map((item, index) => {
                const isBooked = showBookSuccess === item.className;
                return (
                  <div
                    key={item.id}
                    style={{ animationDelay: `${index * 75}ms` }}
                    className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-neutral-900/40 border-l-4 border-l-transparent hover:border-l-orange-500 hover:shadow-[0_4px_25px_rgba(255,100,0,0.06)] transition-all duration-300 animate-feed-in"
                  >
                    {/* Time & Title Info */}
                    <div className="flex items-start md:items-center space-x-6">
                      <div className="p-4 bg-neutral-900 rounded-2xl flex flex-col justify-center items-center text-center w-24 h-24 border border-white/5">
                        <Clock className="w-5 h-5 text-orange-500 mb-2" />
                        <span className="text-[10px] font-bold font-mono text-neutral-400 tracking-tight">
                          {item.time.split(' - ')[0]}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-3">
                          {item.className}
                          {/* Capacity labels */}
                          {item.capacityLevel === 'full' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                              Almost Full
                            </span>
                          ) : item.capacityLevel === 'medium' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                              Filling Fast
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                              Spots Open
                            </span>
                          )}
                        </h3>
                        
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-400">
                          <span className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-orange-500/60" />
                            <span>Coach: <strong className="text-neutral-300 font-medium">{item.trainer}</strong></span>
                          </span>
                          <span className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-500/60" />
                            <span>Duration: <strong className="text-neutral-300 font-medium">{item.duration}</strong></span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking CTAs */}
                    <div className="flex items-center md:justify-end gap-4">
                      {isBooked ? (
                        <div className="flex items-center space-x-2 bg-green-500/15 border border-green-500/30 text-green-400 px-6 py-3 rounded-xl font-semibold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Reserved & Confirmed on WA!</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBook(item)}
                          disabled={bookedClassId !== null}
                          className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                            bookedClassId === item.id
                              ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                              : 'bg-neutral-900 hover:bg-white hover:text-[#0a0a0c] border border-white/10 text-white'
                          }`}
                        >
                          {bookedClassId === item.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                              <span>Securing Seat...</span>
                            </>
                          ) : (
                            <span>Instant Book Class</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Success Banner Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500 font-mono">
            * Class schedules are subject to minor structural coach reviews. Auto WhatsApp reminders trigger 30-mins prior.
          </p>
        </div>
      </div>
    </section>
  );
}

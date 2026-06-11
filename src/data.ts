/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GymService, ClassScheduleItem, Testimonial, GalleryItem, MembershipPlan } from './types';

export const SERVICES: GymService[] = [
  {
    id: 'pt',
    name: 'Personal Training',
    description: 'Custom 1-on-1 athletic coaching focused on your physiology, posture correction, and hyper-efficient movement patterns.',
    icon: 'UserCheck',
    price: 'KES 2,000 / hr'
  },
  {
    id: 'group',
    name: 'Group Classes',
    description: 'High-energy, metabolic circuits and collective functional fitness with inspiring music and supportive peers.',
    icon: 'Users',
    price: 'Included in Membership'
  },
  {
    id: 'nutrition',
    name: 'Nutrition Coaching',
    description: 'Expert biochemical macros tracking, hormone-balancing meal structures, and personalized fat-loss fueling guidelines.',
    icon: 'Apple',
    price: 'KES 3,500 / month'
  },
  {
    id: 'weight',
    name: 'Weightlifting Zone',
    description: 'All-inclusive raw training area containing premium Olympic bars, weight plates, custom steel cages, and power platforms.',
    icon: 'Dumbbell',
    price: 'Included in Membership'
  },
  {
    id: 'cardio',
    name: 'Cardio Zone',
    description: 'High-tech aerobic machinery, curved sprint treadmills, high-resistance rowers, air bikes, and structural stepper units.',
    icon: 'Flame',
    price: 'Included in Membership'
  },
  {
    id: 'yoga',
    name: 'Yoga & Pilates',
    description: 'Decompression of spinal joints, dynamic structural core stability, controlled breathing flow, and hot thermal workouts.',
    icon: 'Sparkles',
    price: 'Included in Membership'
  }
];

export const SCHEDULE: ClassScheduleItem[] = [
  // Monday
  { id: '1', className: 'HIIT Cardio Blast', time: '06:00 AM - 07:00 AM', day: 'Monday', trainer: 'Coach Sarah', duration: '60 Min', capacityLevel: 'full' },
  { id: '2', className: 'Strength & Conditioning', time: '08:30 AM - 09:30 AM', day: 'Monday', trainer: 'Coach Bryan', duration: '60 Min', capacityLevel: 'medium' },
  { id: '3', className: 'Olympic Weightlifting', time: '05:30 PM - 07:00 PM', day: 'Monday', trainer: 'Coach Ken', duration: '90 Min', capacityLevel: 'full' },
  { id: '4', className: 'Hatha Yoga Flow', time: '07:15 PM - 08:15 PM', day: 'Monday', trainer: 'Coach Amanda', duration: '60 Min', capacityLevel: 'low' },
  
  // Tuesday
  { id: '5', className: 'CrossFit WOD', time: '06:30 AM - 07:30 AM', day: 'Tuesday', trainer: 'Coach Ken', duration: '60 Min', capacityLevel: 'full' },
  { id: '6', className: 'Spin Cycle Burnout', time: '09:00 AM - 10:00 AM', day: 'Tuesday', trainer: 'Coach Sarah', duration: '60 Min', capacityLevel: 'medium' },
  { id: '7', className: 'Powerlifting squat mechanics', time: '06:00 PM - 07:30 PM', day: 'Tuesday', trainer: 'Coach Bryan', duration: '90 Min', capacityLevel: 'medium' },
  
  // Wednesday
  { id: '8', className: 'Kettlebells Circuit', time: '06:00 AM - 07:00 AM', day: 'Wednesday', trainer: 'Coach Elena', duration: '60 Min', capacityLevel: 'medium' },
  { id: '9', className: 'Zone 2 Cardio Rowing', time: '08:00 AM - 09:00 AM', day: 'Wednesday', trainer: 'Coach Sarah', duration: '60 Min', capacityLevel: 'low' },
  { id: '10', className: 'Pilates Decompression', time: '05:30 PM - 06:30 PM', day: 'Wednesday', trainer: 'Coach Elena', duration: '60 Min', capacityLevel: 'medium' },
  { id: '11', className: 'Leg Day Hypertrophy', time: '06:45 PM - 08:00 PM', day: 'Wednesday', trainer: 'Coach Bryan', duration: '75 Min', capacityLevel: 'full' },

  // Thursday
  { id: '12', className: 'Kickboxing Heavybags', time: '06:15 AM - 07:15 AM', day: 'Thursday', trainer: 'Coach Ken', duration: '60 Min', capacityLevel: 'full' },
  { id: '13', className: 'Sleek Mobility Flow', time: '09:30 AM - 10:30 AM', day: 'Thursday', trainer: 'Coach Amanda', duration: '60 Min', capacityLevel: 'low' },
  { id: '14', className: 'HIIT Cardio Blast', time: '05:30 PM - 06:30 PM', day: 'Thursday', trainer: 'Coach Sarah', duration: '60 Min', capacityLevel: 'medium' },
  
  // Friday
  { id: '15', className: 'CrossFit WOD', time: '06:00 AM - 07:00 AM', day: 'Friday', trainer: 'Coach Ken', duration: '60 Min', capacityLevel: 'full' },
  { id: '16', className: 'Full Body Sculpt', time: '08:30 AM - 09:30 AM', day: 'Friday', trainer: 'Coach Elena', duration: '60 Min', capacityLevel: 'medium' },
  { id: '17', className: 'Friday Finisher Challenge', time: '05:30 PM - 06:40 PM', day: 'Friday', trainer: 'Coach Bryan & Ken', duration: '70 Min', capacityLevel: 'full' },

  // Saturday
  { id: '18', className: 'Weekend Warrior Boot Camp', time: '08:00 AM - 09:30 AM', day: 'Saturday', trainer: 'Trainer Squad', duration: '90 Min', capacityLevel: 'full' },
  { id: '19', className: 'Vinyasa Power Yoga', time: '10:00 AM - 11:15 AM', day: 'Saturday', trainer: 'Coach Amanda', duration: '75 Min', capacityLevel: 'medium' },

  // Sunday
  { id: '20', className: 'Full Body Active Recovery', time: '09:00 AM - 10:15 AM', day: 'Sunday', trainer: 'Coach Amanda', duration: '75 Min', capacityLevel: 'low' },
  { id: '21', className: 'Open Lift Practice', time: '11:00 AM - 01:00 PM', day: 'Sunday', trainer: 'Coach Bryan', duration: '120 Min', capacityLevel: 'medium' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Njoroge K.',
    role: 'Creative Director',
    quote: 'Joining Aura completely changed my perspective on heavy conditioning. The trainers didn’t just hand me a template—they refined my lifting mechanics, and Coach Bryan’s guidance keep me injury-free.',
    stars: 5,
    results: 'Dropped 12kg of visceral fat & added 15kg to Bench Press',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't2',
    name: 'Wanjiku M.',
    role: 'Full Stack Engineer',
    quote: 'The group energy at the HIIT Cardio zone is absolutely addictive. After working at a desk all day, spinning under Aura’s neon atmospheric lights resets my focus. Best fitness locker in Nairobi!',
    stars: 5,
    results: 'Decreased body fat index from 29% to 22% in 4 months',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 't3',
    name: 'David O.',
    role: 'Financial Analyst',
    quote: 'The AI Workout Planner coupled with the weightlifting cage zones is a tech nerd’s dream. The M-PESA quick payment makes it simple and the immediate STK Push lets me renew in under 5 seconds.',
    stars: 5,
    results: 'Increased Squat PR to 160kg, gained 5kg lean skeletal muscle',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const GALLERY: GalleryItem[] = [
  { id: 'g1', title: 'Main Weightlifting Cage Matrix', category: 'facilities', imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80' },
  { id: 'g2', title: 'Cardio Zone rowers in action', category: 'classes', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80' },
  { id: 'g3', title: 'Metabolic Group HIIT sessions', category: 'classes', imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80' },
  { id: 'g4', title: 'Luxury locker facilities & wellness lounge', category: 'facilities', imageUrl: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&auto=format&fit=crop&q=80' },
  { id: 'g5', title: 'Before & After: Mike\'s 6-Month Build', category: 'transformations', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80' },
  { id: 'g6', title: 'Decompressing dynamic yoga flow', category: 'classes', imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80' }
];

export const PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Ultimate Monthly Pass',
    price: 4500,
    billingPeriod: 'per month',
    features: [
      'Unlimited access to Cardio & Free Weight Zone',
      'Access to all scheduled premium group classes',
      'Complimentary smart RFID wellness pass entry',
      'Unlimited custom AI Gym Planners with Trainer review',
      'Fully secure M-PESA STK automatic checkout system',
      'Locker room amenities & showers access'
    ],
    popular: true,
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'annual',
    name: 'Annual Athlete Champion',
    price: 36000,
    billingPeriod: 'per year',
    features: [
      'Equal to KES 3,000/month (Save 33% total!)',
      'Guaranteed permanent personal athletic locker room',
      '12 private 1-on-1 Coaching session vouchers',
      'Customized premium metabolic blood nutrition guidelines',
      'Always-unlimited access to all gym locations',
      'Free juice-bar hydration drinks & premium merchandise pack'
    ],
    popular: false,
    color: 'from-amber-400 to-amber-700'
  },
  {
    id: 'dropin',
    name: 'VIP Nomadic Drop-In Pass',
    price: 8000,
    billingPeriod: '10 sessions card',
    features: [
      'Valid for 10 structural visits over 6 months',
      'Ideal for travelers & freelance athletes',
      'Complimentary advanced clinical bio-impedance body scans',
      'Same-day access to premium infrared sauna chambers',
      'Full participation in spin cycle or HIIT classes',
      'Instantly refundable/shareable with friends'
    ],
    popular: false,
    color: 'from-neutral-700 to-neutral-900'
  }
];

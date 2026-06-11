/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GymService {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  price?: string;
}

export interface ClassScheduleItem {
  id: string;
  className: string;
  time: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  trainer: string;
  duration: string;
  capacityLevel: 'low' | 'medium' | 'full'; 
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
  results: string; // e.g., "Lost 15kg in 3 months"
  avatar: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'facilities' | 'classes' | 'transformations';
  imageUrl: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number; // in KES or KES per month
  billingPeriod: string;
  features: string[];
  popular: boolean;
  color: string; // tailwind classes
}

export interface AIPlanRequest {
  age: number;
  weight: number;
  goal: string;
  level: string;
  focusArea: string;
  extraNotes: string;
}

export interface AIPlanResponse {
  success: boolean;
  workoutPlan: string;
  nutritionTips: string;
  hydrationSchedule: string;
  trainerNote: string;
}

export interface CheckoutState {
  step: 'closed' | 'plans' | 'billing-form' | 'stk-progress' | 'success';
  selectedPlan: MembershipPlan | null;
  phoneNumber: string;
  userName: string;
  paymentMethod: 'mpesa';
  stkStatusMessage: string;
  progressPercentage: number;
}

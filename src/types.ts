/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'FR' | 'AR' | 'EN';

export type ActivePage =
  | 'home'
  | 'search'
  | 'profile'
  | 'signup-owner'
  | 'signup-sitter'
  | 'owner-dashboard'
  | 'sitter-dashboard'
  | 'chat'
  | 'about'
  | 'faq'
  | 'administration';

export type AnimalType = 'chien' | 'chat' | 'lapin' | 'oiseau' | 'autre';

export interface Pet {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  age: string;
  photoUrl: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'owner' | 'sitter';
  city: string;
  pets: Pet[];
  isBlocked?: boolean;
}

export interface Sitter {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  acceptedAnimals: AnimalType[];
  pricePerNight: number;
  priceWeekend?: number;
  bio: string;
  photoUrl: string;
  capacityMax: number;
  phone: string;
  availabilities: string[]; // Dates stored as YYYY-MM-DD
}

export interface Booking {
  id: string;
  sitterId: string;
  sitterName: string;
  ownerId: string;
  ownerName: string;
  petName: string;
  petType: AnimalType;
  city: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string; // ISO string
}

export interface ChatConversation {
  sitterId: string;
  sitterName: string;
  sitterPhoto: string;
  sitterCity: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Review {
  id: string;
  sitterId: string;
  authorName: string;
  authorCity: string;
  rating: number;
  date: string;
  text: string;
}

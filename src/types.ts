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
  | 'blog'
  | 'annuaire'
  | 'annonces'
  | 'privacy'
  | 'terms'
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
  isActive?: boolean; // New field for sitter activation
  photoUrl?: string;
  phone?: string;
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
  isActive?: boolean; // Sitter activation status
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
  cancelReason?: string;
  cancelledBy?: 'sitter' | 'owner' | 'admin';
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
  bookingId?: string;
  sitterId: string;
  authorName: string;
  authorCity: string;
  rating: number;
  date: string;
  text: string;
}

export interface AppNotification {
  id: string;
  userId: string; // 'all', 'admin', or specific userId/sitterId
  title: string;
  message: string;
  date: string; // ISO or date string
  read: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl?: string;
}

export interface DirectoryEntry {
  id: string;
  type: 'veterinaire' | 'animalerie';
  name: string;
  address: string;
  city: string;
  phone: string;
  description: string;
  dateAdded: string;
}

export interface Announcement {
  id: string;
  userId: string;
  userName?: string;
  type: 'adoption' | 'lost' | 'found' | 'wanted';
  petType?: string;
  title: string;
  description: string;
  city: string;
  contactPhone?: string;
  photoUrl?: string;
  status: 'pending' | 'approved';
  dateAdded: string;
}



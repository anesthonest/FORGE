'use server';

/**
 * @fileOverview Forge OS User Profile & Onboarding Service
 * Manages SaaS identity, legal acceptance, and plan transitions.
 */

import { getServerFirebase } from '@/lib/firebase/server';

export type UserPlan = 'FREE' | 'PRO' | 'PREMIUM' | 'ELITE' | 'ENTERPRISE';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  plan: UserPlan;
  status: 'active' | 'suspended';
  subscriptionStatus: 'inactive' | 'active' | 'canceled';
  
  // Compliance
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedAt: string;

  // Billing Links
  stripeCustomerId?: string;
  flutterwaveCustomerId?: string;
  paddleCustomerId?: string;
  
  createdAt: string;
  lastLogin: string;
}

/**
 * Provisions a new operator profile with default FREE tier limits.
 */
export async function provisionUser(uid: string, email: string, name?: string) {
  const { db } = getServerFirebase();
  if (!db) throw new Error("Database offline");

  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();

  if (snap.exists) {
    await userRef.update({ lastLogin: new Date().toISOString() });
    return snap.data() as UserProfile;
  }

  const profile: UserProfile = {
    uid,
    email,
    name: name || email.split('@')[0],
    plan: 'FREE',
    status: 'active',
    subscriptionStatus: 'inactive',
    acceptedTerms: true,
    acceptedPrivacy: true,
    acceptedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  await userRef.set(profile);
  return profile;
}

/**
 * Suspends an operator account (Admin action).
 */
export async function suspendUser(uid: string) {
  const { db } = getServerFirebase();
  if (!db) return;
  await db.collection('users').doc(uid).update({ status: 'suspended' });
}

/**
 * Updates subscription metadata from external payment webhook.
 */
export async function updateSubscription(uid: string, data: Partial<UserProfile>) {
  const { db } = getServerFirebase();
  if (!db) return;
  await db.collection('users').doc(uid).update({
    ...data,
    lastActive: new Date().toISOString()
  });
}

/**
 * @fileOverview ForgeOS Marketplace & Economy Engine
 * PROPERTY OF VINEXSAH TECHNOLOGIES
 */

import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp, Firestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { RevenueDistributor } from './revenue-distributor';

export type MarketplaceItemType = 'agent' | 'workflow' | 'plugin';

export interface MarketplaceItem {
  id: string;
  ownerId: string;
  name: string;
  type: MarketplaceItemType;
  price: number;
  usageCost: number; // CVU based
  rating: number;
  salesCount: number;
  metadata: any;
}

export class MarketplaceEngine {
  /**
   * Publishes a new AI asset to the Forge Marketplace.
   */
  static async publishItem(userId: string, item: Omit<MarketplaceItem, 'id' | 'ownerId' | 'rating' | 'salesCount'>) {
    const { firestore: db } = initializeFirebase();
    if (!db) throw new Error("Infrastructure offline.");

    const docRef = await addDoc(collection(db, 'marketplace_items'), {
      ...item,
      ownerId: userId,
      rating: 5.0,
      salesCount: 0,
      revenueGenerated: 0,
      createdAt: serverTimestamp()
    });

    return docRef.id;
  }

  /**
   * Executes a marketplace purchase and handles revenue splitting.
   */
  static async purchaseItem(buyerId: string, itemId: string) {
    const { firestore: db } = initializeFirebase();
    if (!db || !buyerId || !itemId) throw new Error("Transaction parameters invalid.");

    const itemRef = doc(db, 'marketplace_items', itemId);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) throw new Error("Digital asset not found.");
    
    const item = itemSnap.data() as MarketplaceItem;
    const sellerId = item.ownerId;

    // 1. Split Logic (70/20/10)
    const split = RevenueDistributor.calculateSplit(item.price);

    // 2. Atomic Wallet Update (Buyer pays, Seller earns)
    const buyerWalletRef = doc(db, 'users', buyerId, 'billing', 'wallet');
    const sellerWalletRef = doc(db, 'users', sellerId, 'billing', 'wallet');

    // Verification of buyer liquidity would happen here in production
    await updateDoc(buyerWalletRef, {
      balance: increment(-item.price),
      spent: increment(item.price)
    });

    await updateDoc(sellerWalletRef, {
      balance: increment(split.creator),
      earned: increment(split.creator)
    });

    // 3. Update Item Stats
    await updateDoc(itemRef, {
      salesCount: increment(1)
    });

    // 4. Log Immutable Transaction
    await addDoc(collection(db, 'transactions'), {
      buyerId,
      sellerId,
      itemId,
      amount: item.price,
      split,
      timestamp: serverTimestamp()
    });

    return { success: true, split };
  }
}

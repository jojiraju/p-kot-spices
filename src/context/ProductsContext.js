'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { products as staticProducts } from '@/data/products';
import { getDb } from '@/lib/firebase';

// Used until the CMS has quantity options of its own.
export const DEFAULT_WEIGHTS = [
  { label: '100g', value: 0.1 },
  { label: '250g', value: 0.25 },
  { label: '500g', value: 0.5 },
  { label: '1kg', value: 1 },
  { label: '5kg', value: 5 },
];

const ProductsContext = createContext({ products: staticProducts, categories: [], weights: DEFAULT_WEIGHTS, loading: false });

// CMS products may only have the core fields; fill the rest so the pages render safely.
// The CMS stores extra photos in `images`; the pages call them `gallery`.
const normalize = (p) => ({
  details: '',
  usage: '',
  benefits: '',
  unit: 'kg',
  ...p,
  features: Array.isArray(p.features) ? p.features : [],
  packs: Array.isArray(p.packs) ? p.packs : [],
  gallery: Array.isArray(p.images) ? p.images : Array.isArray(p.gallery) ? p.gallery : [],
  inStock: p.inStock !== false,
});

export function ProductsProvider({ children }) {
  const [cms, setCms] = useState(null); // null = not loaded yet
  const [cmsCategories, setCmsCategories] = useState([]);
  const [cmsWeights, setCmsWeights] = useState([]);
  const db = useMemo(() => getDb(), []);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, 'products'),
      (snap) => setCms(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
      () => setCms([]) // on error, fall back to the bundled catalogue
    );
  }, [db]);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, 'categories'),
      (snap) => setCmsCategories(snap.docs.map((d) => d.data().name).filter(Boolean)),
      () => setCmsCategories([])
    );
  }, [db]);

  // Quantity options managed under Settings -> Quantities in the CMS (price factor is relative to the per-kg price).
  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, 'quantities'),
      (snap) =>
        setCmsWeights(
          snap.docs
            .map((d) => d.data())
            .filter((w) => w.label && Number(w.value) > 0)
            .map((w) => ({ label: w.label, value: Number(w.value) }))
            .sort((a, b) => a.value - b.value)
        ),
      () => setCmsWeights([])
    );
  }, [db]);

  const products = useMemo(() => {
    if (!db) return staticProducts; // Firebase not configured
    if (cms === null) return []; // still loading
    if (cms.length === 0) return staticProducts.map(normalize); // CMS empty or unreachable
    // The CMS is the source of truth; bundled data only fills fields the CMS record lacks.
    const bundled = new Map(staticProducts.map((p) => [p.id, p]));
    // Products switched to inactive in the CMS are left out everywhere on the site.
    return cms.filter((c) => c.active !== false).map((c) => normalize({ ...bundled.get(c.id), ...c }));
  }, [cms, db]);

  return (
    <ProductsContext.Provider value={{ products, categories: cmsCategories, weights: cmsWeights.length ? cmsWeights : DEFAULT_WEIGHTS, loading: Boolean(db) && cms === null }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);

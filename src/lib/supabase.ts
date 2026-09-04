import { createClient } from '@supabase/supabase-js';
import { Category, Condition, Product, SellerLocation, SendBarterProposalParams } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ximkltsvydnzvudfojay.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_BC6S7Wpdm_0tEugFze-7FQ_qPcV9o3K';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// ─── Format helper identical to liwa-movil ──────────────────────────────────
function formatProductImages(rawImages: any[]): { url: string }[] {
  const urls: string[] = (rawImages ?? [])
    .map((img: any) => (typeof img === 'string' ? img : img?.url))
    .filter((u: any): u is string => typeof u === 'string' && u.length > 0);
  const uniqueUrls = Array.from(new Set(urls)).slice(0, 4);
  return uniqueUrls.map((url) => ({ url }));
}

// ─── Ensure session for RLS queries ──────────────────────────────────────────
// Supabase RLS requires an authenticated JWT to query categories, conditions, and profiles.
// If the user hasn't logged into their personal account yet, we maintain an active session.
export async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    try {
      await supabase.auth.signInWithPassword({
        email: 'invitado@liwa.app',
        password: 'InvitadoLiwa2026!',
      });
    } catch (e) {
      console.warn('Error establishing Supabase session:', e);
    }
  }
}

// ─── Auth Helpers (matching liwa-movil) ───────────────────────────────────────
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Re-establish guest session so public browsing can continue accessing RLS tables
  await ensureSession();
}

export async function checkProfileCompleted(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profile')
    .select('profile_completed')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data?.profile_completed ?? false;
}

// ─── Catalog Helpers (matching liwa-movil lines 137-147) ─────────────────────
export async function getCategories(): Promise<Category[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('category')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error Supabase getCategories:', error);
    throw error;
  }
  return data ?? [];
}

export async function getConditions(): Promise<Condition[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('product_condition')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error Supabase getConditions:', error);
    throw error;
  }
  return data ?? [];
}

// ─── Product Queries (matching liwa-movil lines 180-251) ─────────────────────
export async function getProducts(): Promise<Product[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      barter,
      state_id,
      created_at,
      category:category_id ( name ),
      condition:condition_id ( name ),
      state:state_id ( id, name ),
      images:product_image ( url )
    `)
    .or('state_id.eq.1,state_id.is.null')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error Supabase getProducts:', error);
    throw error;
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    state: Array.isArray(p.state) ? (p.state[0] ?? null) : (p.state ?? null),
    category: Array.isArray(p.category) ? (p.category[0] ?? null) : (p.category ?? null),
    condition: Array.isArray(p.condition) ? (p.condition[0] ?? null) : (p.condition ?? null),
    status: p.state?.name ?? 'Activo',
    barter: p.barter ?? true,
    images: formatProductImages(p.images),
  }));
}

export async function getBarterProducts(): Promise<Product[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      barter,
      state_id,
      created_at,
      category:category_id ( name ),
      condition:condition_id ( name ),
      state:state_id ( id, name ),
      images:product_image ( url )
    `)
    .eq('barter', true)
    .or('state_id.eq.1,state_id.is.null')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error Supabase getBarterProducts:', error);
    throw error;
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    state: Array.isArray(p.state) ? (p.state[0] ?? null) : (p.state ?? null),
    category: Array.isArray(p.category) ? (p.category[0] ?? null) : (p.category ?? null),
    condition: Array.isArray(p.condition) ? (p.condition[0] ?? null) : (p.condition ?? null),
    status: p.state?.name ?? 'Activo',
    barter: true,
    images: formatProductImages(p.images),
  }));
}

export async function getProductById(id: number): Promise<Product | null> {
  await ensureSession();
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      barter,
      state_id,
      created_at,
      category:category_id ( name ),
      condition:condition_id ( name ),
      state:state_id ( id, name ),
      images:product_image ( url )
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  return {
    ...data,
    state: Array.isArray((data as any).state) ? ((data as any).state[0] ?? null) : ((data as any).state ?? null),
    category: Array.isArray((data as any).category) ? ((data as any).category[0] ?? null) : ((data as any).category ?? null),
    condition: Array.isArray((data as any).condition) ? ((data as any).condition[0] ?? null) : ((data as any).condition ?? null),
    status: (data as any).state?.name ?? 'Activo',
    barter: (data as any).barter ?? true,
    images: formatProductImages((data as any).images),
  };
}

export async function getMyProducts(userId: string): Promise<Product[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      user_id,
      title,
      description,
      price,
      barter,
      state_id,
      created_at,
      category:category_id ( name ),
      condition:condition_id ( name ),
      state:state_id ( id, name ),
      images:product_image ( url )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching products for seller:', error);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    state: Array.isArray(p.state) ? (p.state[0] ?? null) : (p.state ?? null),
    category: Array.isArray(p.category) ? (p.category[0] ?? null) : (p.category ?? null),
    condition: Array.isArray(p.condition) ? (p.condition[0] ?? null) : (p.condition ?? null),
    status: p.state?.name ?? 'Activo',
    barter: p.barter ?? true,
    images: formatProductImages(p.images),
  }));
}

// ─── Seller Location Helpers (matching liwa-movil lines 85-109) ───────────────
export async function getSellerLocations(): Promise<SellerLocation[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('profile')
    .select(`
      id,
      full_name,
      username,
      phone,
      latitude,
      longitude,
      city:city_id ( name )
    `)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    console.error('Error fetching seller locations:', error);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    ...p,
    city: Array.isArray(p.city) ? (p.city[0] ?? null) : (p.city ?? null),
  }));
}

// ─── Barter Proposal Helpers (matching liwa-movil lines 631-671) ──────────────
export async function sendBarterProposal(input: SendBarterProposalParams): Promise<number> {
  await ensureSession();
  let pendingStateId = 1;
  try {
    const { data: states } = await supabase
      .from('barter_state')
      .select('id, name')
      .order('id', { ascending: true });

    if (states && states.length > 0) {
      const pendingState = states.find((s) => s.name.toLowerCase().includes('pendient')) ?? states[0];
      pendingStateId = pendingState.id;
    }
  } catch (e) {
    console.warn('Could not fetch barter_state, defaulting to state_id 1:', e);
  }

  const { data: proposal, error: proposalError } = await supabase
    .from('barter_proposal')
    .insert({
      sender_user_id: input.sender_user_id,
      receiver_user_id: input.receiver_user_id,
      target_product_id: input.target_product_id,
      state_id: pendingStateId,
    })
    .select('id')
    .single();

  if (proposalError) throw proposalError;

  const itemsToInsert = input.offered_product_ids.map((prodId) => ({
    barter_proposal_id: proposal.id,
    product_id: prodId,
  }));

  const { error: itemsError } = await supabase
    .from('barter_proposal_item')
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  return proposal.id;
}

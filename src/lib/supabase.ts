import { createClient } from '@supabase/supabase-js';
import {
  Category,
  Condition,
  Product,
  SellerLocation,
  SendBarterProposalParams,
  LibraryBook,
  UserProfile,
  City,
  Gender,
  Ethnicity,
} from '@/types';

// Fallback taxonomy data in case tables are unpopulated
export const DEFAULT_CITIES: City[] = [
  { id: 1, name: 'Managua' },
  { id: 2, name: 'León' },
  { id: 3, name: 'Granada' },
  { id: 4, name: 'Masaya' },
  { id: 5, name: 'Matagalpa' },
  { id: 6, name: 'Estelí' },
  { id: 7, name: 'Chinandega' },
  { id: 8, name: 'Jinotega' },
  { id: 9, name: 'Rivas' },
  { id: 10, name: 'Carazo' },
  { id: 11, name: 'Nueva Segovia' },
  { id: 12, name: 'Madriz' },
  { id: 13, name: 'Boaco' },
  { id: 14, name: 'Chontales' },
  { id: 15, name: 'Río San Juan' },
  { id: 16, name: 'Bilwi (Puerto Cabezas)' },
  { id: 17, name: 'Bluefields' },
];

export const DEFAULT_GENDERS: Gender[] = [
  { id: 1, name: 'Femenino' },
  { id: 2, name: 'Masculino' },
  { id: 3, name: 'No binario' },
  { id: 4, name: 'Prefiero no decir' },
];

export const DEFAULT_ETHNICITIES: Ethnicity[] = [
  { id: 1, name: 'Mestizo' },
  { id: 2, name: 'Miskito' },
  { id: 3, name: 'Mayangna' },
  { id: 4, name: 'Creol' },
  { id: 5, name: 'Rama' },
  { id: 6, name: 'Ulwa' },
  { id: 7, name: 'Garífuna' },
  { id: 8, name: 'Xiu-Sutiaba' },
  { id: 9, name: 'Chorotega' },
  { id: 10, name: 'Otro / Prefiero no decir' },
];


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

  if (error) return false;
  return data?.profile_completed ?? false;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  await ensureSession();
  const { data, error } = await supabase
    .from('profile')
    .select(`
      id,
      username,
      full_name,
      photo_url,
      phone,
      biography,
      latitude,
      longitude,
      email,
      city_id,
      gender_id,
      ethnicity_id,
      profile_completed,
      city:city_id ( id, name ),
      gender:gender_id ( id, name ),
      ethnicity:ethnicity_id ( id, name )
    `)
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching user profile:', error);
    return null;
  }
  if (!data) return null;

  return {
    ...data,
    city: Array.isArray(data.city) ? (data.city[0] ?? null) : (data.city ?? null),
    gender: Array.isArray(data.gender) ? (data.gender[0] ?? null) : (data.gender ?? null),
    ethnicity: Array.isArray(data.ethnicity) ? (data.ethnicity[0] ?? null) : (data.ethnicity ?? null),
  };
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    username: string;
    full_name: string;
    phone: string;
    city_id: number;
    gender_id: number;
    ethnicity_id: number;
    latitude?: number | null;
    longitude?: number | null;
    email?: string;
    biography?: string | null;
    photo_url?: string | null;
  }
): Promise<UserProfile> {
  await ensureSession();

  const { data: existing } = await supabase
    .from('profile')
    .select('id, email')
    .eq('id', userId)
    .maybeSingle();

  const payload: any = {
    username: profileData.username.trim(),
    full_name: profileData.full_name.trim(),
    phone: profileData.phone.trim(),
    city_id: Number(profileData.city_id),
    gender_id: Number(profileData.gender_id),
    ethnicity_id: Number(profileData.ethnicity_id),
    latitude: profileData.latitude !== undefined && profileData.latitude !== null ? Number(profileData.latitude) : null,
    longitude: profileData.longitude !== undefined && profileData.longitude !== null ? Number(profileData.longitude) : null,
    profile_completed: true,
    updated_at: new Date().toISOString(),
  };

  if (profileData.biography !== undefined) {
    payload.biography = profileData.biography;
  }
  if (profileData.photo_url !== undefined) {
    payload.photo_url = profileData.photo_url;
  }

  let result;
  if (existing) {
    const { data, error } = await supabase
      .from('profile')
      .update(payload)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    result = data;
  } else {
    let emailToUse = profileData.email;
    if (!emailToUse) {
      const { data: authData } = await supabase.auth.getUser();
      emailToUse = authData.user?.email || '';
    }

    const { data, error } = await supabase
      .from('profile')
      .insert({
        id: userId,
        email: emailToUse,
        ...payload,
      })
      .select()
      .single();

    if (error) throw error;
    result = data;
  }

  return result;
}

export async function getCities(): Promise<City[]> {
  await ensureSession();
  try {
    const { data, error } = await supabase
      .from('city')
      .select('id, name')
      .order('name');

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Error fetching cities:', e);
  }
  return DEFAULT_CITIES;
}

export async function getGenders(): Promise<Gender[]> {
  await ensureSession();
  try {
    const { data, error } = await supabase
      .from('gender')
      .select('id, name')
      .order('name');

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Error fetching genders:', e);
  }
  return DEFAULT_GENDERS;
}

export async function getEthnicities(): Promise<Ethnicity[]> {
  await ensureSession();
  try {
    const { data, error } = await supabase
      .from('ethnicity')
      .select('id, name')
      .order('name');

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    console.warn('Error fetching ethnicities:', e);
  }
  return DEFAULT_ETHNICITIES;
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
      images:product_image ( url ),
      seller:user_id ( full_name, phone )
    `)
    .eq('id', id)
    .single();

  if (error) return null;

  let sellerData = Array.isArray((data as any).seller)
    ? ((data as any).seller[0] ?? null)
    : ((data as any).seller ?? null);

  // Fallback direct query to profile table if join didn't populate
  if (!sellerData && data.user_id) {
    try {
      const { data: prof } = await supabase
        .from('profile')
        .select('full_name, phone')
        .eq('id', data.user_id)
        .single();
      if (prof) {
        sellerData = prof;
      }
    } catch {
      // ignore
    }
  }

  return {
    ...data,
    state: Array.isArray((data as any).state) ? ((data as any).state[0] ?? null) : ((data as any).state ?? null),
    category: Array.isArray((data as any).category) ? ((data as any).category[0] ?? null) : ((data as any).category ?? null),
    condition: Array.isArray((data as any).condition) ? ((data as any).condition[0] ?? null) : ((data as any).condition ?? null),
    seller: sellerData,
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
      photo_url,
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
    photo_url: p.photo_url ?? null,
    city: Array.isArray(p.city) ? (p.city[0] ?? null) : (p.city ?? null),
  }));
}

export async function getSellerLocationsWithInventory(): Promise<{
  sellers: SellerLocation[];
  categories: Category[];
}> {
  await ensureSession();

  const [profilesRes, productsRes, categoriesRes] = await Promise.all([
    supabase
      .from('profile')
      .select(`
        id,
        full_name,
        username,
        photo_url,
        phone,
        latitude,
        longitude,
        city:city_id ( name )
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null),
    supabase
      .from('product')
      .select(`
        id,
        user_id,
        title,
        description,
        price,
        barter,
        state_id,
        category_id,
        created_at,
        category:category_id ( id, name ),
        condition:condition_id ( name ),
        state:state_id ( id, name ),
        images:product_image ( url )
      `)
      .or('state_id.eq.1,state_id.is.null')
      .order('created_at', { ascending: false }),
    supabase
      .from('category')
      .select('id, name')
      .order('id'),
  ]);

  const rawProfiles = profilesRes.data ?? [];
  const rawProducts = productsRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  const formattedProducts: Product[] = rawProducts.map((p: any) => ({
    ...p,
    category: Array.isArray(p.category) ? (p.category[0] ?? null) : (p.category ?? null),
    condition: Array.isArray(p.condition) ? (p.condition[0] ?? null) : (p.condition ?? null),
    state: Array.isArray(p.state) ? (p.state[0] ?? null) : (p.state ?? null),
    status: p.state?.name ?? 'Activo',
    barter: p.barter ?? true,
    images: formatProductImages(p.images),
  }));

  const sellers: SellerLocation[] = rawProfiles.map((p: any) => {
    const userProducts = formattedProducts.filter((prod) => prod.user_id === p.id);
    const catNames = Array.from(
      new Set(
        userProducts
          .map((prod) => prod.category?.name)
          .filter((n): n is string => Boolean(n))
      )
    );
    const catIds = Array.from(
      new Set(
        userProducts
          .map((prod) => (prod as any).category_id)
          .filter((id): id is number => typeof id === 'number')
      )
    );

    return {
      id: p.id,
      full_name: p.full_name,
      username: p.username,
      photo_url: p.photo_url ?? null,
      phone: p.phone,
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
      city: Array.isArray(p.city) ? (p.city[0] ?? null) : (p.city ?? null),
      products: userProducts,
      categories: catNames,
      categoryIds: catIds,
    };
  });

  return {
    sellers,
    categories,
  };
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

// ─── Library Helpers ──────────────────────────────────────────────────────────
export async function getLibraryBooks(): Promise<LibraryBook[]> {
  await ensureSession();
  const { data, error } = await supabase
    .from('library')
    .select('id, title_book, url_download, url_image')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error Supabase getLibraryBooks:', error);
    throw error;
  }

  return (data ?? []).map((item: any) => ({
    id: item.id,
    title_book: item.title_book,
    url_download: item.url_download ?? null,
    url_image: item.url_image ?? null,
  }));
}


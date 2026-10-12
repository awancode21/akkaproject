/**
 * ============================================================================
 * SUPABASE CLIENT & SERVICE LAYER (TAHAP 4 & 5)
 * APLIKASI WEB STOK OPNAME 2 TIM (SUPABASE & GOOGLE SHEETS)
 * ============================================================================
 */

import { createClient } from '@supabase/supabase-js';

// Ambil environment variables (Vite standard)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL atau Anon Key belum disetel di environment variables (.env). Periksa konfigurasi Vercel / Vite Anda.');
}

// Inisialisasi Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * ============================================================================
 * AUTHENTICATION & PROFILE HELPERS
 * ============================================================================
 */

export async function getCurrentUserProfile() {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (profileError) {
    console.error('Gagal mengambil profil user:', profileError.message);
    return null;
  }

  return {
    user: session.user,
    profile
  };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * ============================================================================
 * MASTER ITEM QUERIES (OPTIMIZED UNTUK 70,000 SKU DENGAN PAGINATION & SEARCH)
 * ============================================================================
 */

export interface MasterItemFilter {
  searchQuery?: string;
  family?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchMasterItems({ searchQuery = '', family = '', page = 1, pageSize = 50 }: MasterItemFilter) {
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from('items')
    .select('*', { count: 'exact' });

  if (searchQuery) {
    // Cari berdasarkan SKU atau Nama Barang
    query = query.or(`sku.ilike.%${searchQuery}%,nama_barang.ilike.%${searchQuery}%,original_code.ilike.%${searchQuery}%`);
  }

  if (family && family !== 'ALL') {
    query = query.eq('family', family);
  }

  // Paginasi server-side agar browser tidak lag memuat 70.000 SKU sekaligus
  const { data, count, error } = await query
    .range(offset, offset + pageSize - 1)
    .order('sku', { ascending: true });

  if (error) {
    console.error('Gagal mengambil master items:', error.message);
    throw error;
  }

  return {
    items: data || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page
  };
}

/**
 * ============================================================================
 * STOCK OPNAME RESULTS & COMPARE HELPERS
 * ============================================================================
 */

export async function fetchStockOpnameCompareView(soId: string) {
  const { data, error } = await supabase
    .from('v_stock_opname_compare')
    .select('*')
    .eq('so_id', soId);

  if (error) {
    console.error('Gagal mengambil view compare SO:', error.message);
    throw error;
  }

  return data || [];
}

export async function saveStockOpnameResult(payload: {
  assignment_id: string;
  so_id: string;
  sku: string;
  tim: 'Tim 1' | 'Tim 2';
  petugas_id: string;
  qty_hitung: number;
  satuan: string;
  metode_input: 'WEB' | 'BARCODE';
  catatan?: string;
}) {
  const { data, error } = await supabase
    .from('stock_opname_results')
    .upsert(payload, { onConflict: 'assignment_id' })
    .select()
    .single();

  if (error) {
    console.error('Gagal menyimpan hasil hitung:', error.message);
    throw error;
  }

  return data;
}

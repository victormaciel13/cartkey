// app/service/api.ts
import { supabase } from './supabase';
import { TOWERS, TowerId } from '../../constants/towers';

// ─── Tipos ──────────────────────────────────────────────────────────────────
export type Role = 'morador' | 'portaria' | 'admin';

export type User = {
  id: string;
  apartment: string;        // '101' (morador) | '000' (admin) | '999' (portaria)
  towerId: TowerId | null;
  role: Role;
  fullName?: string | null;
};

export type TowersSummaryItem = {
  towerId: TowerId;
  name: string;
  availableCarts: number;
};

export type StatusResponse = {
  availableCarts: number;
  cartsInUse: { id: number; apartment: string | null }[];
  myCart: { id: number; towerId: TowerId; since: string } | null;
  towersSummary: TowersSummaryItem[];
};

// ─── E-mail sintetico (a chave: torre + apto -> e-mail interno) ───────────────
function buildAuthEmail(towerId: TowerId | null, apartment: string): string {
  if (apartment === '000') return 'admin@cartkey.app';
  if (apartment === '999') return 'portaria@cartkey.app';
  return `${apartment}.${(towerId ?? 'MAR').toLowerCase()}@cartkey.app`;
}

// ─── BLE / ESP32 (mock por enquanto) ──────────────────────────────────────────
async function sendBleCommand(towerId: TowerId, command: 'UNLOCK' | 'LOCK') {
  console.log(`[MOCK BLE] Torre=${towerId} Comando=${command}`);
  await new Promise((r) => setTimeout(r, 400));
  return true;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function validateAccessCode(code: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('validate_access_code', {
    p_code: code.trim(),
  });
  if (error) throw error;
  return !!data;
}

export async function signUp(params: {
  towerId: TowerId;
  apartment: string;
  password: string;
  fullName: string;
  accessCode: string;
}): Promise<User> {
  const { towerId, apartment, password, fullName, accessCode } = params;

  const okCode = await validateAccessCode(accessCode);
  if (!okCode) throw new Error('Codigo do condominio invalido.');

  const { data: apt, error: aptErr } = await supabase
    .from('apartments')
    .select('id, number')
    .eq('tower_id', towerId)
    .eq('number', Number(apartment))
    .maybeSingle();
  if (aptErr) throw aptErr;
  if (!apt) throw new Error('Apartamento nao existe nesta torre.');

  const email = buildAuthEmail(towerId, apartment);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        apartment_id: apt.id,
        tower_id: towerId,
        apartment_number: apt.number,
        full_name: fullName,
      },
    },
  });
  if (error) {
    if (error.message?.toLowerCase().includes('already registered')) {
      throw new Error('Este apartamento ja possui cadastro.');
    }
    throw error;
  }

  return {
    id: data.user!.id,
    apartment,
    towerId,
    role: 'morador',
    fullName,
  };
}

export async function login(params: {
  towerId: TowerId;
  apartment: string;
  password: string;
}): Promise<User> {
  const { towerId, apartment, password } = params;
  const email = buildAuthEmail(towerId, apartment);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Apartamento ou senha incorretos.');
  return loadUser(data.user!.id);
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

async function loadUser(uid: string): Promise<User> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, tower_id, apartment_number, full_name')
    .eq('id', uid)
    .single();
  if (error) throw error;

  const apartment =
    profile.role === 'admin'
      ? '000'
      : profile.role === 'portaria'
      ? '999'
      : String(profile.apartment_number ?? '');

  return {
    id: uid,
    apartment,
    towerId: (profile.tower_id as TowerId) ?? null,
    role: profile.role as Role,
    fullName: profile.full_name,
  };
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  try {
    return await loadUser(data.user.id);
  } catch {
    return null;
  }
}

// ─── Status / acoes ──────────────────────────────────────────────────────────
type CartRow = {
  id: number;
  tower_id: TowerId;
  status: 'LIVRE' | 'EM_USO';
  holder_id: string | null;
  holder_apartment_number: number | null;
  since: string | null;
};

function formatSince(ts: string | null): string {
  if (!ts) return 'ha pouco';
  try {
    return new Date(ts).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'ha pouco';
  }
}

export async function getStatus(towerId: TowerId): Promise<StatusResponse> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('carts')
    .select('id, tower_id, status, holder_id, holder_apartment_number, since');
  if (error) throw error;

  const carts = (data ?? []) as CartRow[];
  const inTower = carts.filter((c) => c.tower_id === towerId);

  const availableCarts = inTower.filter((c) => c.status === 'LIVRE').length;
  const cartsInUse = inTower
    .filter((c) => c.status === 'EM_USO')
    .map((c) => ({
      id: c.id,
      apartment: c.holder_apartment_number ? String(c.holder_apartment_number) : null,
    }));

  const mine = user
    ? carts.find((c) => c.holder_id === user.id && c.status === 'EM_USO')
    : undefined;
  const myCart = mine
    ? { id: mine.id, towerId: mine.tower_id, since: formatSince(mine.since) }
    : null;

  const towersSummary: TowersSummaryItem[] = TOWERS.map((t) => ({
    towerId: t.id,
    name: t.name,
    availableCarts: carts.filter((c) => c.tower_id === t.id && c.status === 'LIVRE').length,
  }));

  return { availableCarts, cartsInUse, myCart, towersSummary };
}

export async function unlockCart(towerId: TowerId): Promise<StatusResponse> {
  const { error } = await supabase.rpc('unlock_cart', { p_tower: towerId });
  if (error) throw new Error(error.message);
  await sendBleCommand(towerId, 'UNLOCK');
  return getStatus(towerId);
}

export async function returnCart(towerId: TowerId): Promise<StatusResponse> {
  const { data, error } = await supabase.rpc('return_cart');
  if (error) throw new Error(error.message);
  const lockedTower = ((data as CartRow | null)?.tower_id as TowerId) ?? towerId;
  await sendBleCommand(lockedTower, 'LOCK');
  return getStatus(towerId);
}
// app/service/api.ts
import { TOWERS, TowerId } from '../../constants/towers';

// ========================
// TIPOS INTERNOS
// ========================

type CartStatus = 'LIVRE' | 'EM_USO';

type Cart = {
  id: number;
  status: CartStatus;
  apartment: string | null;
  since: string | null;
  towerId: TowerId;
};

let mockState: { carts: Cart[] } = {
  carts: [
    // Torre Mar
    { id: 1, status: 'LIVRE', apartment: null, since: null, towerId: 'MAR' },
    { id: 2, status: 'LIVRE', apartment: null, since: null, towerId: 'MAR' },

    // Torre Serra
    { id: 3, status: 'LIVRE', apartment: null, since: null, towerId: 'SERRA' },
    { id: 4, status: 'LIVRE', apartment: null, since: null, towerId: 'SERRA' },

    // Torre Cidade
    { id: 5, status: 'LIVRE', apartment: null, since: null, towerId: 'CIDADE' },
    { id: 6, status: 'LIVRE', apartment: null, since: null, towerId: 'CIDADE' },
  ],
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ========================
// TIPOS EXPORTADOS
// ========================

export type TowersSummaryItem = {
  towerId: TowerId;
  name: string;
  availableCarts: number;
};

export type StatusResponse = {
  // Status da torre consultada
  availableCarts: number;
  cartsInUse: { id: number; apartment: string | null }[];

  // Carrinho do morador (em qualquer torre)
  myCart: { id: number; towerId: TowerId; since: string } | null;

  // Visão geral de todas as torres
  towersSummary: TowersSummaryItem[];
};

export type User = {
  apartment: string;
};

// ========================
// LOGIN (APENAS APARTAMENTO)
// ========================

export async function login(apartment: string): Promise<User> {
  await delay(300);
  return { apartment };
}

// ========================
// RESUMO DAS TORRES
// ========================

function buildTowersSummary(): TowersSummaryItem[] {
  return TOWERS.map((tower) => {
    const available = mockState.carts.filter(
      (c) => c.towerId === tower.id && c.status === 'LIVRE'
    ).length;

    return {
      towerId: tower.id,
      name: tower.name,
      availableCarts: available,
    };
  });
}

// ========================
// STATUS POR TORRE
// ========================

export async function getStatus(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(250);

  const cartsInTower = mockState.carts.filter((c) => c.towerId === towerId);

  const cartsInUse = cartsInTower.filter((c) => c.status === 'EM_USO');
  const availableCarts = cartsInTower.filter(
    (c) => c.status === 'LIVRE'
  ).length;

  // Carrinho do morador em QUALQUER torre
  const myCartGlobal = mockState.carts.find(
    (c) => c.apartment === apartment && c.status === 'EM_USO'
  );

  return {
    availableCarts,
    cartsInUse: cartsInUse.map((c) => ({
      id: c.id,
      apartment: c.apartment,
    })),
    myCart: myCartGlobal
      ? {
          id: myCartGlobal.id,
          towerId: myCartGlobal.towerId,
          since: myCartGlobal.since || 'há pouco',
        }
      : null,
    towersSummary: buildTowersSummary(),
  };
}

// ========================
// DESTRAVAR CARRINHO
// ========================

export async function unlockCart(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(350);

  // Se já estiver com carrinho em qualquer torre, não libera outro
  const already = mockState.carts.find(
    (c) => c.apartment === apartment && c.status === 'EM_USO'
  );

  if (already) {
    return getStatus(apartment, towerId);
  }

  // Procura carrinho livre na torre escolhida
  const freeCart = mockState.carts.find(
    (c) => c.status === 'LIVRE' && c.towerId === towerId
  );

  if (!freeCart) {
    return getStatus(apartment, towerId);
  }

  freeCart.status = 'EM_USO';
  freeCart.apartment = apartment;
  freeCart.since = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Futuro: aqui o backend chamará o ESP32 da torre correspondente

  return getStatus(apartment, towerId);
}

// ========================
// DEVOLVER CARRINHO
// ========================

export async function returnCart(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(300);

  // Devolve carrinho em QUALQUER torre
  const myCart = mockState.carts.find(
    (c) => c.apartment === apartment && c.status === 'EM_USO'
  );

  if (myCart) {
    myCart.status = 'LIVRE';
    myCart.apartment = null;
    myCart.since = null;
  }

  return getStatus(apartment, towerId);
}

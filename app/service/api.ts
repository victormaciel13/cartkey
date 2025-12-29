import { TOWERS, TowerId } from '../../constants/towers';


async function sendBleCommand(
  towerId: TowerId,
  command: 'UNLOCK' | 'LOCK'
): Promise<boolean> {
  console.log(`[MOCK BLE] Torre=${towerId} Comando=${command}`);
  // pequeno delay só para parecer "real"
  await new Promise((resolve) => setTimeout(resolve, 500));
  return true;
}

// ===============================
//   LÓGICA DO CARTKEY
// ===============================

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

export type TowersSummaryItem = {
  towerId: TowerId;
  name: string;
  availableCarts: number;
};

export type StatusResponse = {
  availableCarts: number; // da torre consultada
  cartsInUse: { id: number; apartment: string | null }[]; // da torre consultada
  myCart: { id: number; towerId: TowerId; since: string } | null; // carrinho do morador (em qualquer torre)
  towersSummary: TowersSummaryItem[]; // visão geral de todas as torres
};

export type User = {
  apartment: string;
};

// login APENAS com apartamento
export async function login(apartment: string): Promise<User> {
  await delay(300);
  return { apartment };
}

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

export async function getStatus(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(300);

  const cartsInTower = mockState.carts.filter((c) => c.towerId === towerId);

  const cartsInUse = cartsInTower.filter((c) => c.status === 'EM_USO');
  const availableCarts = cartsInTower.filter(
    (c) => c.status === 'LIVRE'
  ).length;

  // carrinho do morador em QUALQUER torre
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

export async function unlockCart(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(400);

  // Se já estiver com carrinho (em qualquer torre), só retorna status
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

  // Aqui seria o BLE real – por enquanto só simula
  await sendBleCommand(towerId, 'UNLOCK');

  return getStatus(apartment, towerId);
}

export async function returnCart(
  apartment: string,
  towerId: TowerId
): Promise<StatusResponse> {
  await delay(300);

  // Procura carrinho do morador em QUALQUER torre
  const myCart = mockState.carts.find(
    (c) => c.apartment === apartment && c.status === 'EM_USO'
  );

  if (myCart) {
    const myCartTower = myCart.towerId;

    myCart.status = 'LIVRE';
    myCart.apartment = null;
    myCart.since = null;

    await sendBleCommand(myCartTower, 'LOCK');
  }

  return getStatus(apartment, towerId);
}

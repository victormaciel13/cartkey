// constants/towers.ts

export type TowerId = 'MAR' | 'SERRA' | 'CIDADE';

export type Tower = {
  id: TowerId;
  name: string;
};

export const TOWERS: Tower[] = [
  { id: 'MAR', name: 'Torre Mar' },
  { id: 'SERRA', name: 'Torre Serra' },
  { id: 'CIDADE', name: 'Torre Cidade' },
];

// app/screens/admin/AdminNavigator.tsx
//
// Navegador central do módulo gerencial.
// Substitui o HomeScreen quando o usuário logado for portaria (ap. 999) ou admin (ap. 000).
// Todos os imports de telas gerenciais ficam aqui — o resto do app não precisa saber deles.

import React, { useState } from 'react';
import AdminDashboardScreen   from './AdminDashboardScreen';
import MoradoresScreen        from './MoradoresScreen';
import CarrinhosScreen        from './CarrinhosScreen';
import HistoricoScreen        from './Historicoscreen';
import ReconhecimentoScreen   from './Reconhecimentoscreen';
import Cadastrofacialscreen   from './Cadastrofacialscreen';
import ConfiguracoesScreen    from './Configuracoesscreen';

export type AdminScreen =
  | 'dashboard'
  | 'moradores'
  | 'carrinhos'
  | 'historico'
  | 'reconhecimento'
  | 'cadastro-facial'
  | 'configuracoes';

export type AdminRole = 'admin' | 'portaria';

type Props = {
  role: AdminRole;
  onLogout: () => void;
};

export default function AdminNavigator({ role, onLogout }: Props) {
  const [screen, setScreen] = useState<AdminScreen>('dashboard');

  const navigate = (s: AdminScreen) => setScreen(s);
  const goBack   = () => setScreen('dashboard');

  switch (screen) {
    case 'dashboard':
      return (
        <AdminDashboardScreen
          role={role}
          onNavigate={navigate}
          onLogout={onLogout}
        />
      );
    case 'moradores':
      return (
        <MoradoresScreen
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    case 'carrinhos':
      return (
        <CarrinhosScreen
          onBack={goBack}
        />
      );
    case 'historico':
      return (
        <HistoricoScreen
          onBack={goBack}
        />
      );
    case 'reconhecimento':
      return (
        <ReconhecimentoScreen
          onNavigate={navigate}
          onBack={goBack}
        />
      );
    case 'cadastro-facial':
      return (
        <Cadastrofacialscreen
          onBack={() => setScreen('reconhecimento')}
        />
      );
    case 'configuracoes':
      return (
        <ConfiguracoesScreen
          onBack={goBack}
        />
      );
    default:
      return (
        <AdminDashboardScreen
          role={role}
          onNavigate={navigate}
          onLogout={onLogout}
        />
      );
  }
}
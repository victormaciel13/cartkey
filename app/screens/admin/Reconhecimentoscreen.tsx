// app/screens/admin/ReconhecimentoScreen.tsx
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminScreen } from './AdminNavigator';

type Props = {
  onNavigate: (screen: AdminScreen) => void;
  onBack: () => void;
};

const FACE_STATS = [
  { label: 'Cadastrados',  value: '31', color: '#2ecc71', icon: 'face-recognition' },
  { label: 'Pendentes',    value: '17', color: '#f4a261', icon: 'face-man-outline'  },
  { label: 'Bloqueados',   value: '2',  color: '#e63946', icon: 'face-man-shimmer'  },
];

const RECENT_VERIFICATIONS = [
  { name: 'Ana Beatriz',   apt: '101', time: '14:32', ok: true  },
  { name: 'Carlos Souza',  apt: '202', time: '13:15', ok: true  },
  { name: 'Desconhecido',  apt: '—',   time: '12:48', ok: false },
  { name: 'Pedro Alves',   apt: '404', time: '11:20', ok: true  },
];

export default function ReconhecimentoScreen({ onNavigate, onBack }: Props) {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Reconhecimento Facial</Text>
          <Text style={styles.headerSub}>Gestão biométrica</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsRow}>
          {FACE_STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { borderColor: s.color + '44' }]}>
              <MaterialCommunityIcons name={s.icon as any} size={24} color={s.color} />
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Status do sistema */}
        <Text style={styles.sectionTitle}>Status do Sistema</Text>
        <View style={styles.card}>
          {[
            { label: 'Câmera Torre Mar',    status: 'online',   color: '#2ecc71' },
            { label: 'Câmera Torre Serra',  status: 'online',   color: '#2ecc71' },
            { label: 'Câmera Torre Cidade', status: 'offline',  color: '#e63946' },
            { label: 'Modelo de IA',        status: 'ativo',    color: '#2ecc71' },
            { label: 'Banco de faces',      status: '31 rostos',color: '#00b4d8' },
          ].map((item, i, arr) => (
            <View
              key={item.label}
              style={[styles.statusRow, i < arr.length - 1 && styles.statusRowBorder]}
            >
              <View style={[styles.statusDot, { backgroundColor: item.color }]} />
              <Text style={styles.statusLabel}>{item.label}</Text>
              <Text style={[styles.statusValue, { color: item.color }]}>{item.status}</Text>
            </View>
          ))}
        </View>

        {/* Ações */}
        <Text style={styles.sectionTitle}>Ações</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate('cadastro-facial')}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#9b59b622' }]}>
              <MaterialCommunityIcons name="face-recognition" size={28} color="#9b59b6" />
            </View>
            <Text style={styles.actionTitle}>Cadastrar Face</Text>
            <Text style={styles.actionSub}>Registrar novo morador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate('moradores')}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#0077b622' }]}>
              <MaterialCommunityIcons name="account-group" size={28} color="#0077b6" />
            </View>
            <Text style={styles.actionTitle}>Ver Moradores</Text>
            <Text style={styles.actionSub}>Gerenciar cadastros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => onNavigate('historico')}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#f4a26122' }]}>
              <MaterialCommunityIcons name="history" size={28} color="#f4a261" />
            </View>
            <Text style={styles.actionTitle}>Histórico</Text>
            <Text style={styles.actionSub}>Ver acessos recentes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.75}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e6394622' }]}>
              <MaterialCommunityIcons name="account-cancel" size={28} color="#e63946" />
            </View>
            <Text style={styles.actionTitle}>Bloqueios</Text>
            <Text style={styles.actionSub}>Gerenciar acessos</Text>
          </TouchableOpacity>
        </View>

        {/* Verificações recentes */}
        <Text style={styles.sectionTitle}>Verificações Recentes</Text>
        <View style={styles.card}>
          {RECENT_VERIFICATIONS.map((v, i) => (
            <View
              key={i}
              style={[styles.verifyRow, i < RECENT_VERIFICATIONS.length - 1 && styles.verifyRowBorder]}
            >
              {/* Face scan animation placeholder */}
              <View style={[styles.faceIconWrap, { backgroundColor: v.ok ? '#2ecc7122' : '#e6394622' }]}>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={20}
                  color={v.ok ? '#2ecc71' : '#e63946'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.verifyName}>{v.name}</Text>
                <Text style={styles.verifySub}>Ap. {v.apt}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.verifyStatus, { color: v.ok ? '#2ecc71' : '#e63946' }]}>
                  {v.ok ? '✓ Reconhecido' : '✗ Falha'}
                </Text>
                <Text style={styles.verifyTime}>{v.time}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: '#001a33' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.3)',
  },
  backBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: '#002a50', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#e8f0f7', fontSize: 18, fontWeight: '800' },
  headerSub:   { color: '#7a98b8', fontSize: 12 },
  scroll:      { padding: 16, paddingBottom: 40 },
  sectionTitle:{ color: '#7a98b8', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },

  statsRow:  { flexDirection: 'row', gap: 10 },
  statCard:  { flex: 1, backgroundColor: '#002a50', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1 },
  statNum:   { fontSize: 24, fontWeight: '800', marginTop: 6 },
  statLabel: { color: '#7a98b8', fontSize: 11, marginTop: 2 },

  card:       { backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  statusRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  statusRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.2)' },
  statusDot:  { width: 8, height: 8, borderRadius: 4 },
  statusLabel:{ flex: 1, color: '#e8f0f7', fontSize: 14 },
  statusValue:{ fontSize: 13, fontWeight: '700' },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard:  { width: '47.5%', backgroundColor: '#002a50', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  actionIcon:  { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionTitle: { color: '#e8f0f7', fontWeight: '700', fontSize: 14 },
  actionSub:   { color: '#7a98b8', fontSize: 12, marginTop: 3 },

  verifyRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  verifyRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.2)' },
  faceIconWrap:    { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  verifyName:      { color: '#e8f0f7', fontWeight: '600', fontSize: 14 },
  verifySub:       { color: '#7a98b8', fontSize: 12, marginTop: 1 },
  verifyStatus:    { fontSize: 13, fontWeight: '700' },
  verifyTime:      { color: '#7a98b8', fontSize: 12, marginTop: 2 },
});
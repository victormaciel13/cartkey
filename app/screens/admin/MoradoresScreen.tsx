// app/screens/admin/MoradoresScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminScreen } from './AdminNavigator';

type Props = {
  onNavigate: (screen: AdminScreen) => void;
  onBack: () => void;
};

type Morador = {
  id: number;
  name: string;
  apt: string;
  tower: string;
  face: boolean;
  status: 'ativo' | 'bloqueado' | 'pendente';
};

const MORADORES: Morador[] = [
  { id: 1,  name: 'Ana Beatriz',     apt: '101', tower: 'Torre Mar',    face: true,  status: 'ativo'     },
  { id: 2,  name: 'Carlos Souza',    apt: '202', tower: 'Torre Serra',  face: true,  status: 'ativo'     },
  { id: 3,  name: 'Mariana Lima',    apt: '305', tower: 'Torre Cidade', face: false, status: 'pendente'  },
  { id: 4,  name: 'Pedro Alves',     apt: '404', tower: 'Torre Mar',    face: true,  status: 'ativo'     },
  { id: 5,  name: 'Juliana Costa',   apt: '501', tower: 'Torre Serra',  face: false, status: 'pendente'  },
  { id: 6,  name: 'Rafael Mendes',   apt: '602', tower: 'Torre Cidade', face: true,  status: 'bloqueado' },
  { id: 7,  name: 'Fernanda Dias',   apt: '103', tower: 'Torre Mar',    face: true,  status: 'ativo'     },
  { id: 8,  name: 'Lucas Ferreira',  apt: '210', tower: 'Torre Serra',  face: false, status: 'pendente'  },
  { id: 9,  name: 'Camila Rocha',    apt: '312', tower: 'Torre Cidade', face: true,  status: 'ativo'     },
  { id: 10, name: 'Bruno Martins',   apt: '411', tower: 'Torre Mar',    face: true,  status: 'ativo'     },
];

const STATUS_CFG = {
  ativo:     { color: '#2ecc71', label: 'Ativo'     },
  bloqueado: { color: '#e63946', label: 'Bloqueado' },
  pendente:  { color: '#f4a261', label: 'Pendente'  },
};

export default function MoradoresScreen({ onNavigate, onBack }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativo' | 'pendente' | 'bloqueado'>('todos');

  const filtered = MORADORES.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.apt.includes(search);
    const matchFilter = filterStatus === 'todos' || m.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Moradores</Text>
          <Text style={styles.headerSub}>{MORADORES.length} cadastrados</Text>
        </View>
        <TouchableOpacity
          onPress={() => onNavigate('cadastro-facial')}
          style={styles.addBtn}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#00f5d4" />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={18} color="#7a98b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou apartamento..."
          placeholderTextColor="#7a98b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filters}>
        {(['todos', 'ativo', 'pendente', 'bloqueado'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilterStatus(f)}
            style={[styles.filterBtn, filterStatus === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filterStatus === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((m) => {
          const sc = STATUS_CFG[m.status];
          return (
            <View key={m.id} style={styles.card}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: m.face ? '#0077b6' : '#334' }]}>
                <Text style={styles.avatarText}>{m.name.slice(0, 2).toUpperCase()}</Text>
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{m.name}</Text>
                <Text style={styles.sub}>Ap. {m.apt} · {m.tower}</Text>
                <View style={styles.tagsRow}>
                  <View style={[styles.tag, { borderColor: m.face ? '#2ecc7144' : '#f4a26144', backgroundColor: m.face ? '#2ecc7111' : '#f4a26111' }]}>
                    <MaterialCommunityIcons
                      name={m.face ? 'face-recognition' : 'face-recognition'}
                      size={10}
                      color={m.face ? '#2ecc71' : '#f4a261'}
                    />
                    <Text style={[styles.tagText, { color: m.face ? '#2ecc71' : '#f4a261' }]}>
                      {m.face ? 'Face OK' : 'Sem face'}
                    </Text>
                  </View>
                  <View style={[styles.tag, { borderColor: sc.color + '44', backgroundColor: sc.color + '11' }]}>
                    <Text style={[styles.tagText, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                </View>
              </View>

              {/* Ação rápida */}
              {!m.face && (
                <TouchableOpacity
                  onPress={() => onNavigate('cadastro-facial')}
                  style={styles.registerFaceBtn}
                >
                  <MaterialCommunityIcons name="face-recognition" size={16} color="#00f5d4" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#001a33' },
  header:  {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.3)',
  },
  backBtn:     { width: 38, height: 38, borderRadius: 19, backgroundColor: '#002a50', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#e8f0f7', fontSize: 18, fontWeight: '800' },
  headerSub:   { color: '#7a98b8', fontSize: 12 },
  addBtn:      { width: 38, height: 38, borderRadius: 19, backgroundColor: '#00f5d422', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00f5d444' },

  searchRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, backgroundColor: '#002a50', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  searchInput: { flex: 1, color: '#e8f0f7', fontSize: 14 },

  filtersScroll:    { maxHeight: 44 },
  filters:          { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterBtn:        { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', backgroundColor: '#002a50' },
  filterBtnActive:  { backgroundColor: '#0077b633', borderColor: '#0077b6' },
  filterText:       { color: '#7a98b8', fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#00b4d8' },

  list:  { padding: 16, gap: 10, paddingBottom: 40 },
  card:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  avatar:     { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  name: { color: '#e8f0f7', fontWeight: '700', fontSize: 15 },
  sub:  { color: '#7a98b8', fontSize: 12, marginTop: 1 },
  tagsRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  tag:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  tagText: { fontSize: 11, fontWeight: '700' },
  registerFaceBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00f5d422', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#00f5d444' },
});
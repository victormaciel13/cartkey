// app/screens/admin/HistoricoScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onBack: () => void;
};

type Log = {
  id: number;
  name: string;
  apt: string;
  tower: string;
  cart: string;
  time: string;
  date: string;
  method: 'facial' | 'manual';
  status: 'ok' | 'falha' | 'bloqueado';
};

const LOGS: Log[] = [
  { id: 1,  name: 'Ana Beatriz',   apt: '101', tower: 'Torre Mar',    cart: '#1', time: '14:32', date: '22/04', method: 'facial', status: 'ok'       },
  { id: 2,  name: 'Carlos Souza',  apt: '202', tower: 'Torre Serra',  cart: '#3', time: '13:15', date: '22/04', method: 'facial', status: 'ok'       },
  { id: 3,  name: 'Desconhecido',  apt: '—',   tower: 'Torre Mar',    cart: '—',  time: '12:48', date: '22/04', method: 'facial', status: 'falha'    },
  { id: 4,  name: 'Pedro Alves',   apt: '404', tower: 'Torre Mar',    cart: '#2', time: '11:20', date: '22/04', method: 'facial', status: 'ok'       },
  { id: 5,  name: 'Rafael Mendes', apt: '602', tower: 'Torre Cidade', cart: '—',  time: '10:05', date: '22/04', method: 'facial', status: 'bloqueado'},
  { id: 6,  name: 'Fernanda Dias', apt: '103', tower: 'Torre Mar',    cart: '#1', time: '09:40', date: '22/04', method: 'facial', status: 'ok'       },
  { id: 7,  name: 'Camila Rocha',  apt: '312', tower: 'Torre Cidade', cart: '#5', time: '08:55', date: '22/04', method: 'facial', status: 'ok'       },
  { id: 8,  name: 'Desconhecido',  apt: '—',   tower: 'Torre Serra',  cart: '—',  time: '21:10', date: '21/04', method: 'facial', status: 'falha'    },
  { id: 9,  name: 'Bruno Martins', apt: '411', tower: 'Torre Mar',    cart: '#2', time: '19:33', date: '21/04', method: 'facial', status: 'ok'       },
  { id: 10, name: 'Lucas Ferreira',apt: '210', tower: 'Torre Serra',  cart: '—',  time: '18:20', date: '21/04', method: 'manual', status: 'ok'       },
];

const STATUS_CFG = {
  ok:        { color: '#2ecc71', label: 'Liberado',  icon: 'check-circle'   },
  falha:     { color: '#e63946', label: 'Falha',     icon: 'close-circle'   },
  bloqueado: { color: '#f4a261', label: 'Bloqueado', icon: 'minus-circle'   },
};

type FilterStatus = 'todos' | 'ok' | 'falha' | 'bloqueado';

export default function HistoricoScreen({ onBack }: Props) {
  const [filter, setFilter] = useState<FilterStatus>('todos');

  const filtered = filter === 'todos' ? LOGS : LOGS.filter((l) => l.status === filter);

  const okCount  = LOGS.filter((l) => l.status === 'ok').length;
  const failCount = LOGS.filter((l) => l.status !== 'ok').length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Histórico de Acessos</Text>
          <Text style={styles.headerSub}>{LOGS.length} registros</Text>
        </View>
      </View>

      {/* Mini stats */}
      <View style={styles.miniStats}>
        <View style={styles.miniStatItem}>
          <Text style={[styles.miniStatNum, { color: '#2ecc71' }]}>{okCount}</Text>
          <Text style={styles.miniStatLabel}>Liberados</Text>
        </View>
        <View style={styles.miniStatDivider} />
        <View style={styles.miniStatItem}>
          <Text style={[styles.miniStatNum, { color: '#e63946' }]}>{failCount}</Text>
          <Text style={styles.miniStatLabel}>Falhas/Bloqueios</Text>
        </View>
        <View style={styles.miniStatDivider} />
        <View style={styles.miniStatItem}>
          <Text style={[styles.miniStatNum, { color: '#0077b6' }]}>{LOGS.length}</Text>
          <Text style={styles.miniStatLabel}>Total</Text>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtersRow}>
        {(['todos', 'ok', 'falha', 'bloqueado'] as FilterStatus[]).map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'todos' ? 'Todos' : f === 'ok' ? 'Liberados' : f === 'falha' ? 'Falhas' : 'Bloqueados'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item: log }) => {
          const sc = STATUS_CFG[log.status];
          return (
            <View style={[styles.logCard, { borderLeftColor: sc.color }]}>
              {/* Ícone status */}
              <MaterialCommunityIcons name={sc.icon as any} size={24} color={sc.color} />

              {/* Info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.logTop}>
                  <Text style={styles.logName}>{log.name}</Text>
                  <View style={[styles.badge, { backgroundColor: sc.color + '22', borderColor: sc.color + '44' }]}>
                    <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                </View>

                <View style={styles.logMeta}>
                  <Text style={styles.logMetaText}>{log.tower}</Text>
                  <Text style={styles.logMetaDot}>·</Text>
                  <Text style={styles.logMetaText}>Ap. {log.apt}</Text>
                  <Text style={styles.logMetaDot}>·</Text>
                  <Text style={styles.logMetaText}>Cart. {log.cart}</Text>
                </View>

                <View style={styles.logBottom}>
                  <View style={styles.methodTag}>
                    <MaterialCommunityIcons
                      name={log.method === 'facial' ? 'face-recognition' : 'hand-pointing-up'}
                      size={10}
                      color="#00f5d4"
                    />
                    <Text style={styles.methodText}>
                      {log.method === 'facial' ? 'Facial' : 'Manual'}
                    </Text>
                  </View>
                  <Text style={styles.logTime}>{log.date} · {log.time}</Text>
                </View>
              </View>
            </View>
          );
        }}
      />
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

  miniStats:      { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.3)' },
  miniStatItem:   { flex: 1, alignItems: 'center' },
  miniStatNum:    { fontSize: 22, fontWeight: '800' },
  miniStatLabel:  { color: '#7a98b8', fontSize: 11, marginTop: 2 },
  miniStatDivider:{ width: 1, backgroundColor: 'rgba(0,119,182,0.3)' },

  filtersRow:      { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterBtn:       { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', backgroundColor: '#002a50' },
  filterBtnActive: { backgroundColor: '#0077b633', borderColor: '#0077b6' },
  filterText:      { color: '#7a98b8', fontSize: 12, fontWeight: '600' },
  filterTextActive:{ color: '#00b4d8' },

  list:    { padding: 16, paddingBottom: 40 },
  logCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#002a50', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)',
    borderLeftWidth: 3,
  },
  logTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  logName:    { color: '#e8f0f7', fontWeight: '700', fontSize: 15, flex: 1 },
  badge:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText:  { fontSize: 11, fontWeight: '700' },
  logMeta:    { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  logMetaText:{ color: '#7a98b8', fontSize: 12 },
  logMetaDot: { color: '#7a98b844', fontSize: 12 },
  logBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodTag:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  methodText: { color: '#00f5d4', fontSize: 11, fontWeight: '600' },
  logTime:    { color: '#7a98b8', fontSize: 12 },
});
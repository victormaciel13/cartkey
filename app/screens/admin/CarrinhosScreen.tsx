// app/screens/admin/CarrinhosScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onBack: () => void;
};

type Cart = {
  id: number;
  tower: string;
  status: 'livre' | 'em_uso';
  apartment: string | null;
  since: string | null;
};

const CARTS: Cart[] = [
  { id: 1, tower: 'Torre Mar',    status: 'em_uso', apartment: '101', since: '13:45' },
  { id: 2, tower: 'Torre Mar',    status: 'livre',  apartment: null,  since: null   },
  { id: 3, tower: 'Torre Serra',  status: 'livre',  apartment: null,  since: null   },
  { id: 4, tower: 'Torre Serra',  status: 'livre',  apartment: null,  since: null   },
  { id: 5, tower: 'Torre Cidade', status: 'em_uso', apartment: '305', since: '14:10' },
  { id: 6, tower: 'Torre Cidade', status: 'livre',  apartment: null,  since: null   },
];

const TOWERS = ['Torre Mar', 'Torre Serra', 'Torre Cidade'];

export default function CarrinhosScreen({ onBack }: Props) {
  const [towerFilter, setTowerFilter] = useState<string>('Todas');

  const filtered = towerFilter === 'Todas'
    ? CARTS
    : CARTS.filter((c) => c.tower === towerFilter);

  const livres  = filtered.filter((c) => c.status === 'livre').length;
  const em_uso  = filtered.filter((c) => c.status === 'em_uso').length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Carrinhos</Text>
          <Text style={styles.headerSub}>{CARTS.length} no total</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Resumo */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: '#2ecc7144' }]}>
            <MaterialCommunityIcons name="cart-outline" size={24} color="#2ecc71" />
            <Text style={[styles.summaryNum, { color: '#2ecc71' }]}>{livres}</Text>
            <Text style={styles.summarySub}>Livres</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: '#f4a26144' }]}>
            <MaterialCommunityIcons name="cart-check" size={24} color="#f4a261" />
            <Text style={[styles.summaryNum, { color: '#f4a261' }]}>{em_uso}</Text>
            <Text style={styles.summarySub}>Em uso</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: '#0077b644' }]}>
            <MaterialCommunityIcons name="cart-variant" size={24} color="#0077b6" />
            <Text style={[styles.summaryNum, { color: '#0077b6' }]}>{filtered.length}</Text>
            <Text style={styles.summarySub}>Total</Text>
          </View>
        </View>

        {/* Filtro por torre */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 4 }} contentContainerStyle={styles.filters}>
          {(['Todas', ...TOWERS]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTowerFilter(t)}
              style={[styles.filterBtn, towerFilter === t && styles.filterBtnActive]}
            >
              <Text style={[styles.filterText, towerFilter === t && styles.filterTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de carrinhos */}
        {filtered.map((cart) => (
          <View key={cart.id} style={[styles.cartCard, cart.status === 'em_uso' && styles.cartCardInUse]}>
            <View style={[styles.cartIconWrap, { backgroundColor: cart.status === 'em_uso' ? '#f4a26122' : '#2ecc7122' }]}>
              <MaterialCommunityIcons
                name={cart.status === 'em_uso' ? 'cart-check' : 'cart-outline'}
                size={28}
                color={cart.status === 'em_uso' ? '#f4a261' : '#2ecc71'}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.cartId}>Carrinho #{cart.id}</Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: cart.status === 'em_uso' ? '#f4a26122' : '#2ecc7122',
                  borderColor: cart.status === 'em_uso' ? '#f4a26144' : '#2ecc7144',
                }]}>
                  <Text style={[styles.statusText, { color: cart.status === 'em_uso' ? '#f4a261' : '#2ecc71' }]}>
                    {cart.status === 'em_uso' ? 'Em uso' : 'Livre'}
                  </Text>
                </View>
              </View>
              <Text style={styles.cartTower}>{cart.tower}</Text>
              {cart.status === 'em_uso' && cart.apartment && (
                <Text style={styles.cartInfo}>
                  Ap. {cart.apartment} · desde {cart.since}
                </Text>
              )}
            </View>

            {/* Ação forçar devolução */}
            {cart.status === 'em_uso' && (
              <TouchableOpacity style={styles.returnBtn}>
                <MaterialCommunityIcons name="lock-open" size={16} color="#e63946" />
              </TouchableOpacity>
            )}
          </View>
        ))}

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
  scroll:      { padding: 16, paddingBottom: 40, gap: 10 },

  summaryRow:  { flexDirection: 'row', gap: 10, marginBottom: 6 },
  summaryCard: { flex: 1, backgroundColor: '#002a50', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1 },
  summaryNum:  { fontSize: 26, fontWeight: '800', marginTop: 4 },
  summarySub:  { color: '#7a98b8', fontSize: 12 },

  filters:         { paddingBottom: 12, gap: 8 },
  filterBtn:       { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', backgroundColor: '#002a50' },
  filterBtnActive: { backgroundColor: '#0077b633', borderColor: '#0077b6' },
  filterText:      { color: '#7a98b8', fontSize: 13, fontWeight: '600' },
  filterTextActive:{ color: '#00b4d8' },

  cartCard:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  cartCardInUse:  { borderColor: '#f4a26144' },
  cartIconWrap:   { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cartId:         { color: '#e8f0f7', fontWeight: '700', fontSize: 16 },
  cartTower:      { color: '#7a98b8', fontSize: 12, marginTop: 2 },
  cartInfo:       { color: '#f4a261', fontSize: 12, marginTop: 2 },
  statusBadge:    { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, borderWidth: 1 },
  statusText:     { fontSize: 11, fontWeight: '700' },
  returnBtn:      { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e6394622', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e6394644' },
});
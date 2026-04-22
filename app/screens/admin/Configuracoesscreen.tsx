// app/screens/admin/ConfiguracoesScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onBack: () => void;
};

export default function ConfiguracoesScreen({ onBack }: Props) {
  const [liveness, setLiveness]     = useState(true);
  const [notifyFail, setNotifyFail] = useState(true);
  const [autoBlock, setAutoBlock]   = useState(false);
  const [thresh, setThresh]         = useState(85);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Configurações</Text>
          <Text style={styles.headerSub}>Sistema · Câmeras · Reconhecimento</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Reconhecimento Facial */}
        <Text style={styles.sectionTitle}>Reconhecimento Facial</Text>
        <View style={styles.card}>
          {/* Threshold slider placeholder */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Threshold de confiança</Text>
              <Text style={styles.settingSub}>Nível mínimo para aceitar um rosto ({thresh}%)</Text>
            </View>
          </View>
          {/* Visual slider fake */}
          <View style={styles.sliderWrap}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${thresh}%` }]} />
              <View style={[styles.sliderThumb, { left: `${thresh - 2}%` as any }]} />
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>60%</Text>
              <Text style={styles.sliderLabelText}>99%</Text>
            </View>
          </View>
          <View style={styles.sliderBtns}>
            <TouchableOpacity onPress={() => setThresh(Math.max(60, thresh - 5))} style={styles.sliderBtn}>
              <Text style={styles.sliderBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.threshVal}>{thresh}%</Text>
            <TouchableOpacity onPress={() => setThresh(Math.min(99, thresh + 5))} style={styles.sliderBtn}>
              <Text style={styles.sliderBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <ToggleRow
            label="Detecção de vivacidade"
            sub="Impede uso de fotos estáticas"
            value={liveness}
            onToggle={() => setLiveness(v => !v)}
          />
          <ToggleRow
            label="Notificar falhas"
            sub="Alerta a portaria em tempo real"
            value={notifyFail}
            onToggle={() => setNotifyFail(v => !v)}
          />
          <ToggleRow
            label="Bloquear após 3 falhas"
            sub="Requer desbloqueio manual pelo admin"
            value={autoBlock}
            onToggle={() => setAutoBlock(v => !v)}
            last
          />
        </View>

        {/* Câmeras */}
        <Text style={styles.sectionTitle}>Câmeras</Text>
        <View style={styles.card}>
          {[
            { name: 'Torre Mar',    ip: '192.168.1.10', status: 'online'  },
            { name: 'Torre Serra',  ip: '192.168.1.11', status: 'online'  },
            { name: 'Torre Cidade', ip: '192.168.1.12', status: 'offline' },
          ].map((cam, i, arr) => (
            <View key={cam.name} style={[styles.camRow, i < arr.length - 1 && styles.rowBorder]}>
              <View style={[styles.camDot, { backgroundColor: cam.status === 'online' ? '#2ecc71' : '#e63946' }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.camName}>{cam.name}</Text>
                <Text style={styles.camIp}>{cam.ip}</Text>
              </View>
              <Text style={[styles.camStatus, { color: cam.status === 'online' ? '#2ecc71' : '#e63946' }]}>
                {cam.status}
              </Text>
            </View>
          ))}
        </View>

        {/* BLE / Travas */}
        <Text style={styles.sectionTitle}>Travas BLE</Text>
        <View style={styles.card}>
          {[
            { tower: 'Torre Mar',    uuid: 'cart-mar-ble'    },
            { tower: 'Torre Serra',  uuid: 'cart-serra-ble'  },
            { tower: 'Torre Cidade', uuid: 'cart-cidade-ble' },
          ].map((t, i, arr) => (
            <View key={t.tower} style={[styles.camRow, i < arr.length - 1 && styles.rowBorder]}>
              <MaterialCommunityIcons name="bluetooth" size={18} color="#0077b6" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.camName}>{t.tower}</Text>
                <Text style={styles.camIp}>{t.uuid}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#f4a26122', borderColor: '#f4a26144' }]}>
                <Text style={[styles.badgeText, { color: '#f4a261' }]}>Simulado</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Salvar */}
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <MaterialCommunityIcons name="content-save" size={20} color="#001a33" />
          <Text style={styles.saveBtnText}>Salvar Configurações</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

// ── Toggle Row ────────────────────────────────────────────────────────────────
function ToggleRow({
  label, sub, value, onToggle, last,
}: {
  label: string; sub: string; value: boolean; onToggle: () => void; last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[styles.toggleRow, !last && styles.rowBorder]}
      activeOpacity={0.7}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingSub}>{sub}</Text>
      </View>
      <View style={[styles.toggle, { backgroundColor: value ? '#0077b6' : '#334' }]}>
        <View style={[styles.toggleThumb, { left: value ? 20 : 2 }]} />
      </View>
    </TouchableOpacity>
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

  card:       { backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)' },
  rowBorder:  { borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.2)' },

  settingRow: { paddingVertical: 10 },
  settingLabel:{ color: '#e8f0f7', fontSize: 14, fontWeight: '600' },
  settingSub:  { color: '#7a98b8', fontSize: 12, marginTop: 2 },

  sliderWrap:    { paddingVertical: 8 },
  sliderTrack:   { height: 6, backgroundColor: '#001a33', borderRadius: 3, position: 'relative', overflow: 'visible' },
  sliderFill:    { height: 6, backgroundColor: '#0077b6', borderRadius: 3 },
  sliderThumb:   { position: 'absolute', top: -6, width: 18, height: 18, borderRadius: 9, backgroundColor: '#00b4d8', borderWidth: 2, borderColor: '#001a33' },
  sliderLabels:  { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  sliderLabelText: { color: '#7a98b8', fontSize: 11 },
  sliderBtns:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, paddingVertical: 8 },
  sliderBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: '#001a33', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,119,182,0.4)' },
  sliderBtnText: { color: '#00b4d8', fontSize: 20, fontWeight: '700' },
  threshVal:     { color: '#00f5d4', fontSize: 22, fontWeight: '800', minWidth: 60, textAlign: 'center' },

  toggleRow:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  toggle:     { width: 44, height: 26, borderRadius: 13, position: 'relative' },
  toggleThumb:{ position: 'absolute', top: 3, width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' },

  camRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  camDot:    { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  camName:   { color: '#e8f0f7', fontSize: 14, fontWeight: '600' },
  camIp:     { color: '#7a98b8', fontSize: 12, marginTop: 1 },
  camStatus: { fontSize: 13, fontWeight: '700' },
  badge:     { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  saveBtn:     { marginTop: 24, backgroundColor: '#00f5d4', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  saveBtnText: { color: '#001a33', fontWeight: '800', fontSize: 16 },
});
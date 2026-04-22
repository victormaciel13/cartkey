// app/screens/admin/CadastroFacialScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  onBack: () => void;
};

type Step = 1 | 2 | 3;

const MORADORES_PENDENTES = [
  { id: 3,  name: 'Mariana Lima',   apt: '305', tower: 'Torre Cidade' },
  { id: 5,  name: 'Juliana Costa',  apt: '501', tower: 'Torre Serra'  },
  { id: 8,  name: 'Lucas Ferreira', apt: '210', tower: 'Torre Serra'  },
];

export default function CadastroFacialScreen({ onBack }: Props) {
  const [step, setStep]         = useState<Step>(1);
  const [selected, setSelected] = useState<typeof MORADORES_PENDENTES[0] | null>(null);

  function handleSelectMorador(m: typeof MORADORES_PENDENTES[0]) {
    setSelected(m);
    setStep(2);
  }

  function handleCapture() {
    setStep(3);
  }

  function handleReset() {
    setStep(1);
    setSelected(null);
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#001a33" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={step > 1 ? () => setStep((s) => (s - 1) as Step) : onBack} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#e8f0f7" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Cadastro Facial</Text>
          <Text style={styles.headerSub}>Passo {step} de 3</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressWrap}>
        {([1, 2, 3] as Step[]).map((s) => (
          <View key={s} style={styles.progressItem}>
            <View style={[styles.progressDot, step >= s && styles.progressDotActive]}>
              {step > s ? (
                <MaterialCommunityIcons name="check" size={12} color="#001a33" />
              ) : (
                <Text style={[styles.progressNum, step === s && styles.progressNumActive]}>{s}</Text>
              )}
            </View>
            {s < 3 && <View style={[styles.progressLine, step > s && styles.progressLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Step 1: Selecionar morador ── */}
        {step === 1 && (
          <>
            <Text style={styles.stepTitle}>Selecione o Morador</Text>
            <Text style={styles.stepSub}>Escolha quem terá o rosto cadastrado</Text>

            <Text style={styles.sectionLabel}>⚠ Pendentes de cadastro facial</Text>
            {MORADORES_PENDENTES.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.moradorCard}
                onPress={() => handleSelectMorador(m)}
                activeOpacity={0.75}
              >
                <View style={styles.moradorAvatar}>
                  <Text style={styles.moradorAvatarText}>{m.name.slice(0, 2).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moradorName}>{m.name}</Text>
                  <Text style={styles.moradorSub}>Ap. {m.apt} · {m.tower}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#7a98b8" />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* ── Step 2: Capturar foto ── */}
        {step === 2 && selected && (
          <>
            <Text style={styles.stepTitle}>Capturar Rosto</Text>
            <Text style={styles.stepSub}>Posicione o rosto de {selected.name} na câmera</Text>

            {/* Morador selecionado */}
            <View style={styles.selectedCard}>
              <View style={styles.moradorAvatar}>
                <Text style={styles.moradorAvatarText}>{selected.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.moradorName}>{selected.name}</Text>
                <Text style={styles.moradorSub}>Ap. {selected.apt} · {selected.tower}</Text>
              </View>
            </View>

            {/* Câmera placeholder */}
            <View style={styles.cameraBox}>
              {/* Oval guia */}
              <View style={styles.cameraOval}>
                {/* Corner brackets */}
                <View style={[styles.corner, { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3 }]} />
                <View style={[styles.corner, { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3 }]} />
                <View style={[styles.corner, { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3 }]} />
                <View style={[styles.corner, { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3 }]} />
              </View>
              <Text style={styles.cameraHint}>CÂMERA</Text>
              <Text style={styles.cameraSubHint}>expo-camera será aqui</Text>
            </View>

            {/* Dicas */}
            <View style={styles.tipsCard}>
              {[
                'Rosto centralizado e bem iluminado',
                'Olhe diretamente para a câmera',
                'Remova óculos ou máscaras',
              ].map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <MaterialCommunityIcons name="check-circle" size={14} color="#00f5d4" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Botão capturar */}
            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
              <MaterialCommunityIcons name="face-recognition" size={22} color="#001a33" />
              <Text style={styles.captureBtnText}>Capturar Rosto</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── Step 3: Concluído ── */}
        {step === 3 && selected && (
          <View style={styles.successWrap}>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name="check" size={52} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Cadastro Concluído!</Text>
            <Text style={styles.successSub}>
              O rosto de {selected.name} foi registrado com sucesso.{'\n'}
              Ela já pode desbloquear carrinhos pelo reconhecimento facial.
            </Text>

            <View style={styles.successCard}>
              <View style={styles.moradorAvatar}>
                <Text style={styles.moradorAvatarText}>{selected.name.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.moradorName}>{selected.name}</Text>
                <Text style={[styles.moradorSub, { color: '#2ecc71' }]}>✓ Face cadastrada</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.captureBtn} onPress={handleReset} activeOpacity={0.8}>
              <Text style={styles.captureBtnText}>Cadastrar Outro</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backLink} onPress={onBack}>
              <Text style={styles.backLinkText}>Voltar ao menu</Text>
            </TouchableOpacity>
          </View>
        )}

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
  scroll:      { padding: 20, paddingBottom: 40 },

  progressWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,119,182,0.3)' },
  progressItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  progressDot:  { width: 28, height: 28, borderRadius: 14, backgroundColor: '#002a50', borderWidth: 2, borderColor: 'rgba(0,119,182,0.4)', alignItems: 'center', justifyContent: 'center' },
  progressDotActive: { backgroundColor: '#00f5d4', borderColor: '#00f5d4' },
  progressNum:  { color: '#7a98b8', fontSize: 13, fontWeight: '700' },
  progressNumActive: { color: '#001a33' },
  progressLine: { flex: 1, height: 2, backgroundColor: 'rgba(0,119,182,0.3)', marginHorizontal: 4 },
  progressLineActive: { backgroundColor: '#00f5d4' },

  stepTitle:    { color: '#e8f0f7', fontSize: 20, fontWeight: '800', marginBottom: 6 },
  stepSub:      { color: '#7a98b8', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  sectionLabel: { color: '#f4a261', fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },

  moradorCard:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', marginBottom: 10 },
  moradorAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0077b6', alignItems: 'center', justifyContent: 'center' },
  moradorAvatarText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  moradorName:   { color: '#e8f0f7', fontWeight: '700', fontSize: 15 },
  moradorSub:    { color: '#7a98b8', fontSize: 12, marginTop: 2 },

  selectedCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#0077b644', marginBottom: 20 },

  cameraBox:  { height: 300, backgroundColor: '#000d1a', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,119,182,0.4)', alignItems: 'center', justifyContent: 'center', marginBottom: 16, overflow: 'hidden' },
  cameraOval: { width: 160, height: 200, borderRadius: 100, borderWidth: 2, borderColor: '#00f5d4', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  corner:     { position: 'absolute', width: 16, height: 16, borderColor: '#00f5d4' },
  cameraHint: { position: 'absolute', bottom: 16, color: '#00f5d4', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  cameraSubHint: { position: 'absolute', bottom: 4, color: '#7a98b8', fontSize: 10 },

  tipsCard:  { backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(0,119,182,0.3)', marginBottom: 16, gap: 8 },
  tipRow:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipText:   { color: '#7a98b8', fontSize: 13 },

  captureBtn:     { backgroundColor: '#00f5d4', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 },
  captureBtnText: { color: '#001a33', fontWeight: '800', fontSize: 16 },

  successWrap:  { alignItems: 'center', paddingTop: 20 },
  successIcon:  { width: 96, height: 96, borderRadius: 48, backgroundColor: '#2ecc71', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { color: '#e8f0f7', fontSize: 24, fontWeight: '800', marginBottom: 10 },
  successSub:   { color: '#7a98b8', fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  successCard:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#002a50', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#2ecc7144', marginBottom: 20, width: '100%' },
  backLink:     { marginTop: 8 },
  backLinkText: { color: '#00b4d8', fontSize: 14, fontWeight: '600' },
});
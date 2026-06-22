// components/TowerPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TOWERS, TowerId } from '../constants/towers';
import { Palette, Radius, Spacing, FontSize, FontWeight, A11y } from '../constants/theme';

type Props = {
  value: TowerId;
  onChange: (id: TowerId) => void;
  label?: string;
};

const TowerPicker: React.FC<Props> = ({ value, onChange, label = 'Torre' }) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {TOWERS.map((t) => {
          const active = t.id === value;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => onChange(t.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={t.name}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {t.name.replace('Torre ', '')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  label: {
    color: Palette.textMuted,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  option: {
    flex: 1,
    minHeight: A11y.minHit,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  optionActive: {
    borderColor: Palette.primaryBorder,
    backgroundColor: Palette.primarySoft,
  },
  optionText: { color: Palette.textMuted, fontSize: FontSize.md, fontWeight: FontWeight.bold },
  optionTextActive: { color: Palette.primary },
});

export default TowerPicker;
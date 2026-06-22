// components/TowerPicker.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TowerId } from '../constants/towers';
import { Palette, Radius, Spacing, FontSize, FontWeight } from '../constants/theme';

type TowerOption = {
  id: TowerId;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
};

const TOWERS: TowerOption[] = [
  { id: 'MAR',    label: 'Mar',    icon: 'waves' },
  { id: 'SERRA',  label: 'Serra',  icon: 'image-filter-hdr' },
  { id: 'CIDADE', label: 'Cidade', icon: 'city-variant' },
];

type Props = {
  value: TowerId;
  onChange: (towerId: TowerId) => void;
};

const TowerPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Torre</Text>
      <View style={styles.row}>
        {TOWERS.map((tower) => {
          const selected = tower.id === value;
          return (
            <TouchableOpacity
              key={tower.id}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => onChange(tower.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Torre ${tower.label}`}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={tower.icon}
                size={24}
                color={selected ? Palette.primary : Palette.textMuted}
              />
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {tower.label}
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
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: 2,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderWidth: 1.5,
    borderColor: Palette.border,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
  },
  optionSelected: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(43, 137, 190, 0.12)',
  },
  optionText: { color: Palette.textMuted, fontSize: FontSize.sm, fontWeight: '600' },
  optionTextSelected: { color: Palette.primary, fontWeight: FontWeight.bold },
});

export default TowerPicker;
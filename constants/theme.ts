/**
 * CartKey — Design System (fonte única de verdade)
 * ------------------------------------------------------------------
 * Antes existiam duas paletas convivendo no app (a antiga #001a33/#0077b6
 * e a nova #0A1628/#00C9A7). Este arquivo unifica tudo: cores, espaçamentos,
 * raios, tipografia e regras de acessibilidade.
 *
 * Toda tela deve importar daqui — nada de cor "na mão".
 */
import { Platform, TextStyle } from 'react-native';

/* ─── Cores ──────────────────────────────────────────────────────── */
export const Palette = {
  // Fundos (navy profundo → superfícies elevadas)
  bg:          '#0A1628',
  bgElevated:  '#0F1E38',
  surface:     '#13233F',
  surfaceAlt:  '#1B2E4F',
  border:      'rgba(148,163,184,0.16)',
  borderStrong:'rgba(148,163,184,0.28)',

  // Marca (teal)
  primary:       '#00D1A7',
  primaryStrong: '#00B391',
  primarySoft:   'rgba(0,209,167,0.14)',
  primaryBorder: 'rgba(0,209,167,0.38)',
  onPrimary:     '#04221C', // texto escuro sobre botão teal (alto contraste)

  // Apoio (azul informação)
  info:       '#4FC3F7',
  infoSoft:   'rgba(79,195,247,0.13)',
  infoBorder: 'rgba(79,195,247,0.30)',

  // Roxo (reconhecimento facial)
  purple:     '#A78BFA',
  purpleSoft: 'rgba(167,139,250,0.14)',

  // Status
  success:       '#34D399',
  successSoft:   'rgba(52,211,153,0.14)',
  warning:       '#FBBF24',
  warningSoft:   'rgba(251,191,36,0.14)',
  warningBorder: 'rgba(251,191,36,0.34)',
  danger:        '#F87171',
  dangerSoft:    'rgba(248,113,113,0.14)',
  dangerBorder:  'rgba(248,113,113,0.34)',

  // Texto — contraste reforçado p/ leitura confortável em qualquer idade
  text:      '#F1F5F9', // principal
  textMuted: '#AEBCD2', // secundário (mais claro que o antigo #7a98b8)
  textFaint: '#7E8DA6', // terciário (use pouco)
  white:     '#FFFFFF',
} as const;

/* ─── Espaçamento ────────────────────────────────────────────────── */
export const Spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
} as const;

/* ─── Raios ──────────────────────────────────────────────────────── */
export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/* ─── Tipografia ─────────────────────────────────────────────────────
 * Escala com piso elevado: o menor tamanho é 13px (antes havia 10/11px).
 * Body baseline = 17px, confortável para idosos sem ficar gigante.
 */
export const FontSize = {
  xs: 13,
  sm: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  display: 44,
} as const;

export const FontWeight = {
  regular: '400',
  medium:  '600',
  bold:    '700',
  heavy:   '800',
} as const satisfies Record<string, TextStyle['fontWeight']>;

/* ─── Acessibilidade ─────────────────────────────────────────────────
 * minHit: área mínima de toque (44–48px) — vale p/ criança e idoso.
 */
export const A11y = {
  minHit: 48,
} as const;

/* ─── Sombra padrão dos cards ────────────────────────────────────── */
export const Shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 4 },
  default: {},
});

/* ─── Compat: tema antigo do Expo (mantido p/ hooks existentes) ───── */
const tintColorLight = Palette.primary;
const tintColorDark = Palette.primary;

export const Colors = {
  light: {
    text: Palette.text,
    background: Palette.bg,
    tint: tintColorLight,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: Palette.text,
    background: Palette.bg,
    tint: tintColorDark,
    icon: Palette.textMuted,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});
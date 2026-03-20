// Design system constants for AI研修 7つの習慣 video series

export const COLORS = {
  navy: '#1B2A4A',
  accent: '#2E75B6',
  offWhite: '#F0F4F8',
  textDark: '#333333',
  textSub: '#555555',
  teal: '#0D9488',
  orange: '#E67E22',
  white: '#FFFFFF',
  // Comparison slide colors
  ngBackground: '#FDE8E8',
  okBackground: '#E8F5E9',
  ngText: '#C0392B',
  okText: '#27AE60',
} as const;

export const FONTS = {
  main: '"Noto Sans JP", sans-serif',
} as const;

export const LAYOUT = {
  width: 1920,
  height: 1080,
  padding: 80,
  titleFontSize: 64,
  subtitleFontSize: 36,
  bodyFontSize: 32,
  smallFontSize: 24,
  footerHeight: 60,
  accentBarHeight: 6,
} as const;

export const TIMING = {
  fps: 30,
  slideFrames: 900, // 30 seconds per slide
} as const;

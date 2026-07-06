import { vars } from "nativewind";

export const warmThemes = {
  light: vars({
    "--color-background": "#FFFDF9",     // Soft Warm White (Cream)
    "--color-card": "#FFFFFF",           // Pure White for clean cards
    "--color-primary": "#E65F2B",        // Spicy Chili Orange (Main Buttons/Brand)
    "--color-secondary": "#F3A83B",      // Honey/Mustard Yellow (Secondary accents)
    "--color-accent": "#8A3324",         // Rich Terracotta Brown (Active states/highlights)
    "--color-text-main": "#2E2522",      // Deep Espresso Coffee (High contrast text)
    "--color-text-muted": "#7A6E67",     // Warm Stone Gray (Subtitles/secondary text)
    "--color-border": "#EFEAE4",         // Light Oatmeal (Borders/Dividers)
  }),
  
  dark: vars({
    "--color-background": "#1A1412",     // Deep Charcoal with a hint of warm coffee
    "--color-card": "#261E1B",           // Warm Dark Brown/Gray for cards
    "--color-primary": "#F07138",        // Bright Vibrant Chili (Pops on dark mode)
    "--color-secondary": "#F5B352",      // Bright Warm Honey Yellow
    "--color-accent": "#E65F2B",         // Spicy Orange Accent
    "--color-text-main": "#FFF8F5",      // Off-White/Cream text (Easy on eyes)
    "--color-text-muted": "#A3938B",     // Faded Warm Gray text
    "--color-border": "#3B302C",         // Dark Cocoa for borders
  }),
};
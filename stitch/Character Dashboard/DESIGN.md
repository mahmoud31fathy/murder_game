---
name: Obsidian Noir
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#e1bfbb'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#a88a86'
  outline-variant: '#59413e'
  surface-tint: '#ffb4ac'
  primary: '#ffb4ac'
  on-primary: '#690007'
  primary-container: '#991b1b'
  on-primary-container: '#ffaaa1'
  inverse-primary: '#b02d29'
  secondary: '#ffb77d'
  on-secondary: '#4d2600'
  secondary-container: '#d97707'
  on-secondary-container: '#432100'
  tertiary: '#94ccff'
  on-tertiary: '#003352'
  tertiary-container: '#00527f'
  on-tertiary-container: '#8cc5f8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ac'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#8e1214'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#cde5ff'
  tertiary-fixed-dim: '#94ccff'
  on-tertiary-fixed: '#001d32'
  on-tertiary-fixed-variant: '#004b74'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  evidence-gap: 32px
---

## Brand & Style
The design system is engineered to evoke a sense of high-stakes investigation and forensic intensity. It targets an audience seeking immersive, narrative-driven experiences where every detail feels like a potential clue. 

The aesthetic is a hybrid of **Glassmorphism** and **Grit**. Surfaces are treated as physical evidence overlays—translucent glass panes floating over a dark, atmospheric void. The mood is clinical yet visceral, combining the precision of a modern investigative interface with the tactile, "rough-around-the-edges" feel of a crime scene file. High contrast is used to direct the eye to critical intelligence, while backdrop blurs simulate the depth and mystery of a rain-slicked city at night.

## Colors
The palette is dominated by the void. **Obsidian (#09090b)** and **Zinc-950** form the foundation, creating a low-light environment where shadows feel heavy. 

- **Primary (Blood Red):** Used exclusively for high-tension interactions, critical warnings, and "guilty" indicators.
- **Secondary (Amber):** Used for "TOP SECRET" statuses, active leads, and flashlight-style highlights.
- **Surface:** Translucent layers utilize a 40-60% opacity of Zinc-900 to allow background textures or "evidence" to peek through the UI.
- **Text:** Stark White (#FFFFFF) for maximum legibility against the dark void, with Zinc-400 used for "classified" or secondary metadata.

## Typography
The typography strategy contrasts the old world with the new. 

**Libre Caslon Text** is used for headlines to mimic the authoritative, traditional feel of a detective’s typewriter or a legal document. It provides the "mystery" and "narrative" voice. 

**Geist** provides a sharp, technical counterpoint for body copy, ensuring that complex clues and logs remain highly readable. 

**JetBrains Mono** is utilized for metadata, timestamps, and "classified" labels, evoking a sense of digital forensics and raw data processing.

## Layout & Spacing
The layout follows a **Fixed Grid** model to maintain a structured, "dossier" feel. On desktop, content is centered within a 1200px container to simulate a desk surface.

- **Margins:** 24px on mobile, scaling to 64px on desktop.
- **Rhythm:** A strict 4px baseline grid ensures technical precision. 
- **Asymmetry:** While the containers are structured, "Evidence" components (Polaroids, notes) should be slightly rotated (1-3 degrees) and placed with irregular spacing to break the digital perfection and feel like physical items tossed on a table.

## Elevation & Depth
Depth is achieved through **Glassmorphism** and backdrop filters rather than traditional shadows.

1.  **Base Layer:** The darkest Zinc-950, textured with a subtle film grain or "gritty" noise overlay.
2.  **Floating Panes:** Background blur (`backdrop-filter: blur(12px)`) with a 1px border of `white / 10%` to define the edges of "glass" menus.
3.  **Physical Elevation:** For items like Polaroids or "torn paper" clues, use a sharp, high-offset shadow (`8px 8px 0px black / 40%`) to make them feel like they are physically resting on the desk.

## Shapes
The shape language is primarily **Sharp (Soft)**. 
- **UI Elements:** Buttons and input fields use a tight 4px radius (`rounded-sm`) to maintain a serious, clinical tone.
- **Physical Media:** "Torn paper" elements use irregular mask-paths to simulate jagged edges. 
- **Polaroids:** Perfectly square corners with thick bottom margins for handwritten captions.

## Components
- **Buttons:** High-contrast blocks. Default state is semi-transparent glass with a white border. Primary "Investigate" buttons use a solid Blood Red (#991b1b) with a hover effect that increases brightness.
- **Cards:** Defined by `backdrop-blur` and a thin `white/10%` border. If the card contains "Classified" info, overlay a semi-transparent "TOP SECRET" stamp in Amber at a 15-degree angle.
- **Evidence Polaroids:** White borders with a subtle "yellowed paper" texture. Images should have a slight desaturation and high grain. Captions must use a handwritten-style serif or the Label font.
- **Stamps:** The "TOP SECRET" and "CASE CLOSED" stamps should use a grunge texture mask to simulate fading ink.
- **Input Fields:** Minimalist lines. Only the bottom border is visible unless focused, where a subtle Amber glow appears.
- **Torn Paper Notes:** Background-color of Zinc-100 (light) with dark text, utilizing a "torn" CSS mask-image on the top and bottom edges.
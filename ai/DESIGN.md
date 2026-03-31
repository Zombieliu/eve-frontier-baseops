# Design System Specification: Industrial Command Interface

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Hard-Wired Sentinel."**

This is not a consumer-grade dashboard; it is a high-stakes, industrial command console designed for the harsh reality of EVE Frontier. To move beyond "standard" sci-fi UI, we reject the clean, rounded aesthetics of modern SaaS. Instead, we embrace **Tactical Brutalism**. The layout must feel like a physical piece of hardware—rigid, heavy, and engineered. 

We break the "template" look through:
- **Intentional Asymmetry:** Data modules should not always mirror each other. Use offset headers and staggered grid alignments to mimic custom-built machinery.
- **High-Density Operation:** Information is power. We prioritize data density over "white space," using the spacing scale to create tight, controlled groupings that feel pressurized and functional.
- **Cinematic Depth:** We use ultra-dark layering to create a "cockpit" feel, where the UI isn't just a screen, but a window into deep space operations.

---

## 2. Colors & Surface Logic

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. In an industrial environment, boundaries are defined by physical shifts in material. Use the `surface-container` tiers to define areas. A `surface-container-low` section sitting on a `surface` background creates a natural, structural break without the visual "noise" of a line.

### Surface Hierarchy & Nesting
Treat the UI as a series of interlocking armor plates. 
- **Base Layer:** `surface` (#131314) for the deep background.
- **Primary Modules:** `surface-container` (#201f20) for main operational blocks.
- **Sub-Panels:** `surface-container-high` (#2a2a2b) for nested data inputs or secondary controls.
- **Inset Wells:** `surface-container-lowest` (#0e0e0f) for read-only data feeds, creating a "recessed" look.

### The "Hazard & Glow" Rule
Use the **Amber Hazard Glow** (`primary-container`: #ff7e00) sparingly. It is not a decorative accent; it is a status indicator. Use it for critical CTAs, active warnings, or localized "light leaks" behind panels to simulate glowing internal hardware components.

### Signature Textures
Apply a subtle "Smoke" or "Noise" texture (2-4% opacity) over `surface` layers to mimic brushed gunmetal. Avoid standard linear gradients. Instead, use a radial gradient of `primary` to `primary-container` at 5% opacity in corners of active panels to simulate a screen's phosphor glow.

---

## 3. Typography
Our typography is engineered for legibility under combat stress.

- **Display & Headlines (Space Grotesk):** These are your "Machine IDs." Use `display-sm` for sector coordinates and `headline-md` for system alerts. The wide, technical stance of Space Grotesk provides an authoritative, industrial tone.
- **Body & Technical Data (Inter):** Inter is our "Readout" font. Use `body-sm` (0.75rem) for high-density telemetry. The clarity of Inter ensures that even at small scales, operational data remains crisp.
- **Labeling (Space Grotesk):** All UI labels (e.g., "THRUST," "VELOCITY") must use `label-sm` in uppercase with a slight letter-spacing increase (0.05rem) to mimic stamped metal plates.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Stacking**, not light-source shadows. 
- To "lift" a component, move one step up the surface scale (e.g., `surface-container-low` to `surface-container-high`).
- **Forbid:** Traditional 90-degree drop shadows.

### Ambient Shadows
If a floating modal is required (e.g., a critical tactical overlay), use an **Ambient Shadow**:
- **Color:** A tinted version of `on-surface` (#e5e2e3) at 4% opacity.
- **Blur:** Large (24px - 40px) to simulate a soft light diffusion rather than a shadow cast by an office lamp.

### The "Ghost Border" Fallback
If visual separation is failing due to high data density, use a **Ghost Border**:
- **Token:** `outline-variant` (#584235).
- **Opacity:** 15%.
- **Style:** Hairline (1px). This mimics the faint seam between two machined parts.

---

## 5. Components

### Buttons (Tactical Actuators)
- **Primary:** `primary-container` (#ff7e00) background with `on-primary` (#512400) text. Sharp 0px corners. Use a 1px `top-border` of `primary-fixed` to simulate a beveled edge.
- **Tertiary:** No background. `outline` (#a78b7b) text. On hover, apply a `surface-container-highest` background.

### Input Fields (Data Ports)
- **Style:** Recessed appearance using `surface-container-lowest` background. 
- **States:** Active state uses a 1px `ghost-border` of `primary`. Error states use `error` (#ffb4ab) with a subtle glow (2px blur).

### Chips (Status Tags)
- **Selection Chips:** Use `secondary-container` (#3e4e34) for military green status. 
- **Shape:** Strictly 0px radius. Use a notched corner (clip-path) on the top-right for a more "military-spec" look.

### Cards & Lists (Telemetry Modules)
- **Rule:** Forbid divider lines.
- **Separation:** Use `0.4rem` (spacing-2) vertical gaps or alternating shifts between `surface-container-low` and `surface-container-lowest`.
- **Interaction:** On hover, the background should shift to `surface-container-highest` to provide immediate feedback in high-density views.

---

## 6. Do's and Don'ts

### Do:
- **Do** use `0.1rem` (spacing-0.5) for tight, technical groupings of data.
- **Do** use "Optical Alignment": Headers should feel "bolted" to the top-left of their containers.
- **Do** utilize `backdrop-blur` (8px - 12px) for any floating HUD elements to maintain the cinematic feel of EVE Frontier.

### Don't:
- **Don't** use border-radius. Every element in this system uses `0px` radius for a sharp, aggressive, industrial feel.
- **Don't** use pure black (#000000). Use `surface-container-lowest` (#0e0e0f) to maintain texture and depth.
- **Don't** use "Soft" icons. Use sharp, geometric, and technical iconography that matches the stroke weight of the `label-sm` typography.
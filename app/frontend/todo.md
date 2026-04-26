# NEURAL PATHFINDER — Learning Interface Refactor

## Design
- Palette: #090909 bg, rgba(255,255,255,0.02) sidebar, rgba(255,255,255,0.06) borders, #f0f0f0 text, #666 muted
- Font: 'JetBrains Mono', monospace
- Glassmorphism: backdrop-blur(12px), white glow shadows
- Sharp corners (max 4px radius)

## Development Tasks
- [x] Add left sidebar with algo nav + mini stats + Grid Visualizer toggle
- [x] Main area: Section 1 Explanation (header, paragraphs, badges, CSS flow diagram)
- [x] Section 2: Python code block with line numbers + syntax highlighting + Copy
- [x] Section 3: Graph traversal visualization (10-15 nodes, animated) with live Queue/Stack
- [x] Hill Climbing: CSS-drawn landscape with climbing point trap animation
- [x] Preserve entire grid component inside a right-side drawer (480px desktop)
- [x] Fade transition between algorithm selections
- [x] Lint + final check

## Files
- src/pages/Index.tsx — refactored component
- src/index.css — add drawer + code block + graph animation styles
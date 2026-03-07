# Sutavra Mitra's Portfolio

A clean, modern, and high-performance developer portfolio built with pure HTML, CSS, and Vanilla JavaScript. Designed with a dark, high-contrast aesthetic and complex interactive animations.

## Live Demo
Currently configured to run locally or be deployed instantly via Vercel/GitHub Pages.

## Features

### Immersive Design
- **High-Contrast Dark Theme**: Pure black background with striking crimson and dark-red glowing accents.
- **Cinematic Hero Section**: Subtle ken-burns scale animation combined with a scroll-based dissolve effect into the dark background.
- **Responsive Layout**: Fully responsive CSS Grid and Flexbox implementation that scales beautifully from mobile devices to 4K displays.

### Performance & Technology 
- **Zero Dependencies**: Built without heavy JavaScript frameworks (No React/Vue/Next.js) ensuring instantaneous load times and lightweight execution.
- **Custom Animations**: All animations (reveal on scroll, smooth navigation, hover physics) are cleanly written in vanilla JS and CSS.

### Interactive Elements
- **Multilingual Name Scrambler**: The hero title cycles through English, Bengali, and Hindi using a custom cyberpunk text-scramble sorting algorithm.
- **Particle Physics System**: A custom HTML5 Canvas particle network that gently drifts in the background and reacts fluidly by repelling away from the user's cursor.
- **Magnetic Hover Physics**: Navigation links and project cards implement custom cursor math to subtly follow the mouse, creating a tactile "magnetic" feel.
- **Custom Cursor Glow**: A soft red ambient light that trails the user's mouse pointer across the screen, including shockwave ring effects upon clicking.
- **Functional Contact Form**: Pre-configured to utilize FormSubmit for backend-less email delivery directly to the owner.

## Development Setup

The project uses relative pathing and vanilla web technologies, so no complex build tools are required.

To run the site locally:

1. Clone the repository:
```bash
git clone https://github.com/sutavrario/portfolio.git
```

2. Navigate into the directory:
```bash
cd portfolio
```

3. Open `index.html` directly in your browser, OR run a local development server for the best experience (recommended):
```bash
npx serve .
```

4. View the site at `http://localhost:3000`.

## Directory Structure
- `index.html` — The core markup, semantic structure, and content.
- `style.css` — All styling, layout grids, CSS variables, media queries, and CSS keyframe animations.
- `script.js` — All interactive logic including canvas particles, magnetic hover math, scroll observers, and contact form AJAX integration.
- Image assets (e.g. `IMG_4288 2.jpeg`, `proj1.png` - `proj5.png`) for background and project cards.

## Deployment 
Because this is a static site without a build step, it can be deployed for free in seconds by linking the GitHub repository to:
- **Vercel**
- **GitHub Pages**
- **Netlify**

## Contact
- **Email**: mitrasutavra65@gmail.com
- **LinkedIn**: [Sutavra Mitra](https://www.linkedin.com/in/sutavrariomitra6/)
- **GitHub**: [@sutavrario](https://github.com/sutavrario)

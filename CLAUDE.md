# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite and HMR
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all JavaScript/JSX files

### Single File Operations
- ESLint specific file: `npx eslint src/components/ComponentName.jsx`
- Build and test changes: `npm run build && npm run preview`

## Tech Stack & Architecture

### Frontend Framework
- **React 18** with functional components and hooks
- **Vite** for fast development and building
- **React Router DOM** for client-side routing

### UI & Styling  
- **Chakra UI** as the primary component library
- **Framer Motion** for animations
- **React Icons** for iconography
- **Emotion** for CSS-in-JS styling

### Project Structure
```
src/
├── App.jsx              # Main app with routing and home page layout
├── main.jsx             # React app entry point
├── components/          # All React components
│   ├── Dashboard.jsx    # Multi-page dashboard with routing logic
│   ├── DashboardNavbar.jsx
│   ├── Hero.jsx         # Landing page sections
│   ├── Navbar.jsx
│   └── [other components]
├── assets/              # Static assets
└── [CSS files]
```

### Routing Architecture
- **SPA with client-side routing** using React Router
- **Home route (`/`)**: Complete landing page with all sections in sequence
- **Dashboard routes**: Multi-page dashboard at `/dashboard/*` with sub-pages:
  - `/dashboard` - Dashboard home with stats and quick actions
  - `/dashboard/comunidad` - Community features
  - `/dashboard/clases` - Classes (placeholder)
  - `/dashboard/herramientas` - Tools page
  - `/dashboard/crm` - CRM functionality
- Dashboard uses URL-based conditional rendering in single component

### Component Patterns
- Components use Chakra UI's Box, Container, VStack, HStack for layout
- Responsive design with Chakra's responsive props: `{{ base: 4, md: 6, lg: 8 }}`
- Color scheme uses orange variants (`#F59E0B`, `#D97706`, `#B45309`) as primary
- Icons from React Icons (primarily FontAwesome icons via `react-icons/fa`)

### Business Context
This is a Bar Mitzvah preparation platform ("barmitzvatop") with:
- Landing page showcasing benefits, struggles, pricing, and instructor info
- Student dashboard for tracking progress, lessons, and community
- Personalized Torah portion (Parashá) assignments
- Progress tracking with statistics and achievements
- Community features and private classes

## Deployment
- **Netlify**: Configured with SPA redirects in `netlify.toml`
- **Vercel**: Alternative deployment option with `vercel.json`
- Both include security headers and proper SPA routing configuration
- Build output goes to `dist/` directory

## Code Conventions
- Use JSX for all React components
- Follow ESLint configuration in `eslint.config.js`
- Prefer functional components with hooks
- Use Chakra UI components over custom CSS
- Import React Icons as needed: `import { FaIcon } from 'react-icons/fa'`
- Use React Router's `useLocation` for route-based conditional logic
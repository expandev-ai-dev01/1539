# TODO List App

Sistema de gerenciamento de tarefas

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                    # Application configuration
│   ├── App.tsx            # Root component
│   └── router.tsx         # Routing configuration
├── pages/                 # Page components
│   ├── layouts/          # Layout components
│   ├── Home/             # Home page
│   └── NotFound/         # 404 page
├── domain/               # Business domains (to be added)
├── core/                 # Shared components and utilities
│   ├── components/       # Generic UI components
│   ├── lib/             # Library configurations
│   ├── utils/           # Utility functions
│   ├── types/           # Global types
│   └── constants/       # Global constants
└── assets/              # Static assets
    └── styles/          # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- React Router 7.9.3
- TanStack Query 5.90.2
- Tailwind CSS 3.4.14
- Zustand 5.0.8
- React Hook Form 7.63.0
- Zod 4.1.11

## Next Steps

1. Add authentication domain
2. Create task management domain
3. Implement task CRUD operations
4. Add task categorization
5. Implement priority system
6. Add deadline functionality
7. Create task completion tracking
8. Implement search functionality
9. Add notifications system
10. Create task sharing features
11. Implement calendar view
12. Add multi-platform sync
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is "Mister Winner" - a Next.js 15 raffle/lottery system built with TypeScript, Firebase, and Tailwind CSS. Users can register, login, and participate in raffles with 2, 4, 5, or 6 digit numbers. The system includes an admin panel for managing raffles and draws.

## Development Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Code Quality Standards
- **Strict TypeScript**: Avoid using `any` type, maintain strict typing throughout
- **ESLint Compliance**: All code must respect ESLint rules (next/core-web-vitals, next/typescript)
- **Design Principles**: Follow SOLID, KISS, and DRY principles with React thinking patterns

## Architecture & Design System

### Component Structure
The project has a dual component system:
- `src/components/ui/` - Base UI components (Button.tsx, Card.tsx, input.tsx, etc.)
- `src/components/shared/` - Shared components with form integrations and advanced features
- Both systems need consistent styling updates to match the new "Mister Winner" design theme

### Design Theme - "Mister Winner"
- **Colors**: Cyan/Teal gradient scheme (`from-cyan-600 to-teal-600`)
- **UI Style**: Modern glassmorphism with `backdrop-blur-sm` effects
- **Trust & Security**: Design should inspire confidence and convey security
- **Typography**: Clean, professional fonts with proper hierarchy
- **Interactions**: Smooth transitions with hover effects and micro-animations

### Route Structure
- `src/app/(auth)/` - Authentication routes (login, register)
- `src/app/(main)/` - Private routes requiring sidebar layout (dashboard, raffles, profile, history)
- `src/app/(public)/` - Public-facing routes
- Admin routes need implementation for raffle management

### Key Directories
- `src/components/` - UI components (dual system: ui/ and shared/)
- `src/features/` - Feature-specific components (landing page sections)
- `src/services/` - Firebase configuration and CRUD operations via FirestoreService
- `src/types/` - TypeScript interfaces and mock data (extendable)
- `src/hooks/` - Custom React hooks including useAuth

### Raffle System Logic
- Raffle types: 2, 4, 5, 6 digit numbers
- Multiple prizes per raffle supported
- Draw date is tentative until 80% of numbers are sold
- Number collision prevention is critical for security
- Raffle status: 'active', 'completed', 'cancelled'

### Core Types
- `Raffle` - Supports multiple prizes, various digit types, status tracking
- `Prize` - Individual prize with position ranking
- `UserProfile` - User roles: 'user', 'agent', 'admin' with points/credits system
- `Winner` - Winner information with raffle details

### Firebase & Services
- Firebase configured with Firestore, Authentication, and Storage
- `FirestoreService<T>` - Generic CRUD operations with data sanitization
- `authService` - Authentication service with user profile management
- `useAuth` - Custom hook for authentication state management

### UI Components System
Current components include:
- **Button**: Multiple variants with loading states and icons
- **Input**: Error handling, variants (default, search, numeric), label support
- **Card**: Glassmorphism design with header, content, footer variants
- **Form Components**: FormFieldError, FormErrorSummary, various input types
- **Layout**: Table, Modal, Toast, Loader, EmptyState, etc.

### Path Aliases
- `@/*` maps to `./src/*` for clean imports

## Critical Security Considerations
- Prevent duplicate number sales through proper transaction handling
- Implement proper user authentication and authorization
- Validate raffle draw conditions (80% threshold) before setting draw dates
- Never expose sensitive Firebase configuration in client-side code

## UI/UX Requirements
- Modern, consistent styling across all components
- Private section requires attractive sidebar layout
- Responsive design with Tailwind CSS v4
- Glassmorphism effects with cyan/teal color scheme
- Smooth transitions and hover effects
- Professional appearance that conveys trust and security
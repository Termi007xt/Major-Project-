# BlockLance - Decentralized Freelancing Platform

## Overview

BlockLance is a decentralized freelancing platform that combines traditional project management with blockchain technology and smart contracts. The platform enables clients to post projects, freelancers to submit proposals, and facilitates secure payments through smart contract escrow systems. Built with a modern full-stack architecture, it features project module management, real-time messaging, and comprehensive user profiles for both clients and freelancers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and hot module replacement
- **UI Framework**: shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS custom properties for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management with optimistic updates and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
- **Runtime**: Node.js with Express.js for RESTful API endpoints
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **Development Server**: Custom Vite integration for seamless full-stack development experience
- **API Design**: RESTful endpoints with consistent error handling and request/response logging
- **Build System**: ESBuild for fast production builds with external package bundling

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Database**: PostgreSQL configured for production deployment
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation schemas
- **Connection**: Neon Database serverless PostgreSQL for scalable cloud deployment

### Data Models
- **Users**: Comprehensive profiles supporting both clients and freelancers with skills, ratings, and wallet integration
- **Projects**: Hierarchical structure with main projects containing multiple modules/milestones
- **Smart Contracts**: Blockchain integration for escrow payments and automated milestone releases
- **Messaging**: Real-time communication system between clients and freelancers
- **Proposals**: Bidding system allowing freelancers to submit detailed project proposals

### Authentication & Security
- **Session Management**: PostgreSQL-backed session storage with connect-pg-simple
- **Wallet Integration**: Blockchain wallet connection for payments and identity verification
- **Input Validation**: Comprehensive Zod schemas for runtime type checking and validation
- **Error Handling**: Centralized error handling with proper HTTP status codes and user-friendly messages

## External Dependencies

### Blockchain Integration
- **Neon Database**: Serverless PostgreSQL database for scalable cloud deployment
- **Wallet Connectivity**: Support for blockchain wallet integration (implementation details in smart contract modules)

### UI Component Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives for complex components
- **Lucide React**: Icon library providing consistent iconography throughout the application
- **Embla Carousel**: Touch-friendly carousel component for image galleries and content sliders

### Development Tools
- **Replit Integration**: Custom Vite plugins for development banner, error overlays, and code cartography
- **TypeScript**: Full type safety across frontend, backend, and shared code
- **Date-fns**: Date manipulation and formatting utilities for deadline management

### Styling and Theming
- **Class Variance Authority**: Type-safe variant API for component styling
- **clsx & Tailwind Merge**: Utility functions for conditional CSS class management
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins
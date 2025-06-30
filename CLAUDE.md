# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Domestiq is a React Native/Expo cycling recovery app using TypeScript, Tailwind CSS, and Expo Router. The app helps cyclists track their recovery status through .FIT file uploads, Apple Health integration, and data visualization.

## Development Commands

### Core Commands
- `bun install` - Install dependencies (uses Bun package manager)
- `bun start` - Start Expo development server
- `expo start --ios` - Run on iOS simulator
- `expo start --android` - Run on Android emulator
- `expo start --web` - Run in web browser
- `expo lint` - Run ESLint for code quality
- `jest --watchAll` - Run tests in watch mode

### Testing
- The project uses Jest with `jest-expo` preset
- No custom test files exist yet - all tests are in node_modules
- Test command: `npm test` or `jest --watchAll`

## Architecture

### File Structure
```
app/                    # Expo Router screens
├── _layout.tsx        # Root layout with navigation, font loading, theme
├── index.tsx          # Home screen with chart and "Add Ride" button
├── upload-file-info-modal.tsx  # Modal for .FIT file uploads
└── +not-found.tsx     # 404 page

components/            # Reusable UI components
├── ui/               # Base UI components following shadcn pattern
│   └── button.tsx    # Custom button with variants and haptics
├── home-header.tsx   # Header component for home screen
└── week-activity-chart.tsx  # Chart component for activity visualization

hooks/                # Custom React hooks
└── useColorScheme.ts # Theme detection hook

utils/                # Utility functions
└── cssinterop.ts     # Tailwind CSS integration for React Native
```

### Key Technologies
- **React Native 0.79.4** with **React 19.0.0**
- **Expo 53** for development and deployment
- **TypeScript** with strict mode enabled
- **Tailwind CSS** via NativeWind for styling
- **Expo Router** for file-based navigation
- **Barlow font family** (300, 400, 500, 700, 900 weights)

### Styling System
- Uses **NativeWind** for Tailwind CSS in React Native
- Custom color: `selected: '#F25606'` (orange brand color)
- Font classes: `font-barlow-300`, `font-barlow-400`, `font-barlow-500`, `font-barlow-700`, `font-barlow-900`
- Component variants using `class-variance-authority` (see Button component)

### Navigation
- **Expo Router** with Stack navigation
- Modal presentation for upload screen
- Theme provider wraps entire app with dark/light mode support

### State Management
- Currently using React state (no external state management yet)
- Planned: React Query for data fetching, LegendState for state management

## Code Conventions

### TypeScript
- Strict TypeScript enabled
- Path aliasing: `@/*` maps to root directory
- No `any` types - use proper typing

### Component Structure
- Functional components with TypeScript
- Props interfaces defined with proper typing
- Use `React.ComponentProps` for extending native components
- Export both component and types when needed

### Styling
- Tailwind classes preferred over StyleSheet
- Use `cn()` utility for conditional classes (from `@/utils/cssinterop`)
- Responsive design with `native:` prefix for React Native specific styles
- `web:` prefix for web-only styles

### File Naming
- kebab-case for component files
- PascalCase for component names
- Descriptive names that indicate purpose

### Import Organization
1. React/React Native imports
2. Third-party library imports  
3. Local component imports (using `@/` alias)
4. Utility imports

## Key Dependencies

### UI & Styling
- `nativewind` - Tailwind CSS for React Native
- `class-variance-authority` - Component variant management
- `clsx` & `tailwind-merge` - Conditional styling utilities
- `lucide-react-native` - Icon library

### Navigation & Expo
- `expo-router` - File-based routing
- `expo-font` - Custom font loading
- `expo-haptics` - Tactile feedback
- `expo-document-picker` - File selection

### Charts & Data Visualization
- `react-native-gifted-charts` - Chart components
- `react-native-svg` - SVG support for charts

### Development
- `@rocketseat/eslint-config` - ESLint configuration
- `jest-expo` - Testing framework

## Development Guidelines

### Component Development
- Follow existing button.tsx pattern for new UI components
- Use variant-based design with class-variance-authority
- Include haptic feedback for interactive elements
- Support both light and dark themes

### Modal Implementation
- Use Expo Router's modal presentation
- Configure in `_layout.tsx` Stack.Screen
- Set appropriate header options

### File Upload Flow
- Uses `expo-document-picker` for .FIT file selection
- Validate file types before processing
- Handle errors gracefully with user feedback

### Font Usage
- Load fonts in `_layout.tsx` using `useFonts`
- Hide splash screen only after fonts are loaded
- Use consistent weight classes throughout app

## Current Development Status

### Completed Features
- Basic app structure with navigation
- Custom UI components (Button)
- File upload modal with .FIT file validation
- Home screen with activity chart placeholder
- Theme support (light/dark mode)
- Custom font integration

### In Development
- .FIT file processing and TSS calculation
- Apple HealthKit integration
- Recovery scoring algorithm
- Data visualization components

## Testing Strategy

- Jest with jest-expo preset configured
- No custom tests written yet
- Plan to test utility functions, components, and file processing logic
- Use React Native Testing Library for component tests
# Domestiq 🚴‍♂️
*Your Cycling Recovery Companion - Helper of the Yellow Jersey*

## Overview

Domestiq is a cycling-focused recovery and training load management app designed to help cyclists optimize their performance through intelligent recovery tracking. Like a domestique supports the team leader, Domestiq supports your cycling journey by monitoring your recovery status and providing actionable insights for better training decisions.

## The Problem We Solve

Modern cyclists generate tons of data (power, heart rate, sleep, HRV) but struggle to:
- **Understand their daily readiness** to train hard vs recover
- **Interpret complex metrics** like TSS, CTL, ATL in practical terms
- **Connect sleep and recovery data** with their cycling performance
- **Make informed training decisions** based on their current state
- **Avoid overtraining** and optimize adaptation

## Core Philosophy

**Simple. Actionable. Cycling-Specific.**

- **Minimal UI** - Critical info at a glance, no overwhelming dashboards
- **Power-Based Recovery** - Uses cycling-specific metrics (TSS, power curve analysis)
- **Apple Health Integration** - Seamless sleep and HRV data from Apple Watch
- **Practical Recommendations** - "Should I go hard today?" gets a clear answer

## Tech Stack

### Frontend
- **React Native** with Expo 53
- **TypeScript** for type safety
- **Tailwind CSS** with NativeWind for styling
- **Expo Router** for navigation
- **Custom Barlow font family** (300, 400, 500, 700, 900)

### Key Dependencies
- **Lucide React Native** for icons
- **React Native Gifted Charts** for data visualization
- **Expo Document Picker** for .FIT file uploads
- **React Native SVG** for custom graphics

### Architecture
- **Component-based design** with reusable UI components
- **Clean separation** between data processing and UI
- **Modular structure** for easy feature additions

## Current Status: MVP Development

### ✅ Completed
- Project setup with Expo + TypeScript + Tailwind
- Custom UI components (Button, Text) with theme support
- Basic navigation structure
- Upload modal for .FIT files with file validation
- Home screen with "Add Ride" functionality

### 🚧 In Progress
- .FIT file processing and TSS calculation
- Basic recovery scoring algorithm
- Apple HealthKit integration for sleep data

## 🚀 Feature Roadmap

### MVP Core Features (Launch Essential)

#### Recovery Scoring
- **Daily Recovery Score** (0-100%) with traffic light colors (red/yellow/green)
- **Recovery factors displayed**: Sleep quality, HRV trend, resting heart rate
- **Simple morning check-in**: How do you feel? (1-10 scale)
- **Recovery history graph** (7-day and 30-day views)

#### .FIT File Processing
- **Drag & drop .FIT file upload** from any cycling computer
- **Automatic TSS calculation** from power data
- **Training load tracking** (ATL, CTL, TSB)
- **Basic ride summary**: Duration, distance, average power, normalized power

#### Sleep Integration
- **Apple Watch sleep tracking** via HealthKit
- **Sleep quality score** based on duration and efficiency
- **Sleep debt tracking** (recommended vs actual)
- **Sleep stage visualization** (if available from Apple Watch)

#### Simple Recommendations
- **Today's training recommendation** based on recovery score
- **Suggested TSS range** for the day
- **Recovery activity suggestions** (easy spin, rest day, yoga)
- **Hydration and nutrition reminders**

### 📊 Phase 2 Features (Post-Launch)

#### Enhanced Analytics
- **Power curve analysis** showing fatigue patterns
- **HRV baseline establishment** (14-day rolling average)
- **Weekly/monthly recovery trends**
- **Training zone distribution analysis**

#### Apple Watch Deep Integration
- **Automatic workout import** from Apple Fitness
- **Real-time HRV monitoring** during rides
- **Environmental factors**: Temperature, humidity impact
- **Stress level tracking** throughout the day

#### Smart Notifications
- **Low recovery warnings** before planned hard rides
- **Optimal training window alerts**
- **Sleep reminder** based on tomorrow's training
- **Weekly summary push notification**

#### Basic Social Features
- **Share recovery score** to Strava/social media
- **Compare with training partners** (opt-in)
- **Recovery challenges** with friends
- **Anonymous benchmark comparisons**

### 🎯 Phase 3 Features (Growth)

#### AI-Powered Insights
- **Personalized recovery patterns** detection
- **Performance prediction** based on recovery trends
- **Optimal race taper recommendations**
- **Injury risk alerts** from training load patterns

#### Advanced Metrics
- **Readiness score** combining all factors
- **Adaptation tracking** (are you getting fitter?)
- **Form analysis** (CTL vs performance)
- **Weather impact correlation**

#### Premium Features
- **Unlimited history** (free: 90 days)
- **Custom recovery protocols**
- **Coach dashboard** for athletes
- **Advanced exports** (CSV, JSON, API)

#### Integrations
- **Strava automatic sync**
- **TrainingPeaks connectivity**
- **Whoop data import** (if they allow)
- **Garmin Connect sync**
- **Zwift workout import**

## 🎨 UI/UX Features

### Home Dashboard
- **Single glance recovery status** (large circular gauge)
- **3-metric summary**: Recovery, Sleep, Training Load
- **Swipe between daily/weekly views**
- **Customizable widget order**

### Data Visualization
- **Color-coded calendar** showing recovery history
- **Training load chart** with optimal range bands
- **Sleep consistency graph**
- **HRV trend** with personal baseline

### Onboarding
- **FTP input** or estimation
- **Training goal selection**
- **Typical weekly hours setting**
- **Apple Health permissions flow**

## 💡 Unique Differentiators

### Cycling-Specific Features
- **Power-based recovery** (not just heart rate)
- **Position fatigue tracking** (time in drops vs hoods)
- **Terrain impact** on recovery needs
- **Multi-bike tracking** with different FTPs

### Behavioral Insights
- **Recovery journal** with 20+ cycling factors
- **Nutrition timing impact**
- **Equipment change tracking**
- **Travel/altitude adjustments**

### Quick Actions
- **"How do I feel?" morning widget**
- **Quick ride rating** (RPE 1-10)
- **One-tap "rest day" logging**
- **Voice notes** for training observations

## Getting Started

### Prerequisites
- Node.js 18+
- Bun (package manager)
- Expo CLI
- iOS Simulator or Android Emulator

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd domestiq

# Install dependencies
bun install

# Start the development server
bun start
```

### Testing the Upload Feature
1. Run the app on your device/simulator
2. Tap the "Add Ride" button on the home screen
3. Select a .FIT file from your cycling computer
4. The app will validate the file and simulate processing

## Development Notes

### File Structure
```
app/                    # Expo Router screens
├── _layout.tsx        # Root layout with navigation
├── index.tsx          # Home screen
└── upload-file-info-modal.tsx  # File upload modal

components/            # Reusable UI components
├── ui/               # Base UI components
│   ├── button.tsx   # Custom button with variants
│   └── text.tsx     # Themed text component
├── home-header.tsx  # Home screen header
└── week-activity-chart.tsx  # Activity visualization

hooks/                # Custom React hooks
└── useColorScheme.ts # Theme detection

utils/                # Utility functions
└── cssinterop.ts    # Tailwind CSS integration
```

### Key Design Decisions
- **Tailwind CSS** for consistent, utility-first styling
- **Custom font system** using Barlow family
- **Modular components** for easy maintenance and testing
- **TypeScript everywhere** for better development experience
- **Expo ecosystem** for faster development and deployment

## Potential App Names Under Consideration

### 🎯 Top Candidates
- **CycleReady** - Clear purpose, easy to remember
- **Regen/RegenCycle** - Modern, implies regeneration
- **Tailwind Recovery** - Cycling metaphor for support

### Recovery-Focused
- RevUp, Restore, Recharge Cycling, Recovery Compass, RestoreCycle

### Data/Metrics-Inspired
- PowerRest, Cadence Recovery, TSS Tracker, Baseline, Tempo

### Cycling-Specific
- Chainlink, Freewheel, Neutral Support, Domestique

## Contributing

This is currently a solo project in MVP development phase. Future contributions welcome once core features are established.

## License

[License TBD]

---

*Built with ❤️ for the cycling community*
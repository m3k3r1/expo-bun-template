// Reexport the native module. On web, it will be resolved to ExpoHealthSleepModule.web.ts
// and on native platforms to ExpoHealthSleepModule.ts
export { default } from './src/ExpoHealthSleepModule'
export * from './src/ExpoHealthSleep.types'

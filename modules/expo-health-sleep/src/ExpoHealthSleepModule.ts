import { requireNativeModule } from 'expo'
import { ExpoHealthSleepModule } from './ExpoHealthSleep.types'

// This call loads the native module object from the JSI.
const ExpoHealthSleepModuleImpl =
  requireNativeModule<ExpoHealthSleepModule>('ExpoHealthSleep')

export default ExpoHealthSleepModuleImpl

// Also export for named imports
export { ExpoHealthSleepModuleImpl as ExpoHealthSleep }

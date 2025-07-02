import { registerWebModule, NativeModule } from 'expo'

import { ChangeEventPayload } from './ExpoHealthSleep.types'

type ExpoHealthSleepModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

class ExpoHealthSleepModule extends NativeModule<ExpoHealthSleepModuleEvents> {
  PI = Math.PI
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value })
  }

  hello() {
    return 'Hello world! 👋'
  }
}

export default registerWebModule(ExpoHealthSleepModule, 'ExpoHealthSleepModule')

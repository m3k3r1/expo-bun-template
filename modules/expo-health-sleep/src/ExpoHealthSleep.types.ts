export type OnLoadEventPayload = {
  url: string
}

export type ChangeEventPayload = {
  value: string
}

export type ExpoHealthSleepModuleEvents = {
  onChange: (params: ChangeEventPayload) => void
}

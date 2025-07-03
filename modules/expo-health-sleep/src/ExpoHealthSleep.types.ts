export type OnLoadEventPayload = {
  url: string
}

export type ChangeEventPayload = {
  value: string
}

export interface SleepSample {
  startDate: string
  endDate: string
  value: number
  sleepStage: 'inBed' | 'asleep' | 'rem' | 'deep' | 'core' | 'awake' | 'unknown'
  duration: number
  source?: string
}

export interface SleepSummary {
  totalSleepTime: number
  inBedTime: number
  asleepTime: number
  remSleepTime: number
  deepSleepTime: number
  coreSleepTime: number
  sleepEfficiency: number
  sleepSamples: SleepSample[]
}

export interface EnhancedSleepSummary extends SleepSummary {
  sleepQualityMetrics: {
    remPercentage: number
    deepPercentage: number
    corePercentage: number
  }
  vitals: {
    averageHeartRate: number
    heartRateVariability: number
    averageRespiratoryRate: number
    respiratoryVariability: number
  }
  sleepHealthScore: number
}

export interface BreathingDisturbances {
  period: {
    start: number
    end: number
  }
  respiratoryData: {
    average: number
    min: number
    max: number
    variability: number
  }
  note: string
}

export interface VitalsData {
  averageHeartRate: number
  heartRateVariability: number
  averageRespiratoryRate: number
  respiratoryVariability: number
  sleepHealthScore: number
}

export interface SleepQualityMetrics {
  remPercentage: number
  deepPercentage: number
  corePercentage: number
  sleepEfficiency: number
  totalSleepTime: number
}

export interface ExpoHealthSleepModule {
  hello(): string
  isHealthKitAvailable(): boolean
  setValueAsync(value: string): Promise<void>
  requestAuthorization(): Promise<boolean>
  getSleepData(startDate: string, endDate: string): Promise<SleepSample[]>
  getSleepSummary(date: string): Promise<SleepSummary>
  getSleepDataModern(startDate: string, endDate: string): Promise<SleepSample[]>
  getEnhancedSleepSummary(date: string): Promise<EnhancedSleepSummary>
  getBreathingDisturbances(
    startDate: string,
    endDate: string,
  ): Promise<BreathingDisturbances>
}

export default ExpoHealthSleepModule

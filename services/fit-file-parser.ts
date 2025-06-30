const FitParser = require('fit-file-parser').default

// Type definitions for fit-file-parser (no official types available)
interface FitParserOptions {
  force?: boolean
  speedUnit?: string
  lengthUnit?: string
  temperatureUnit?: string
  elapsedRecordField?: boolean
  pressureUnit?: string
  mode?: 'list' | 'cascade' | 'both'
}

interface DeviceInfo {
  manufacturer?: string
  product?: string
  serial_number?: number
  time_created?: string | Date
  software_version?: number
  cum_operating_time?: number
}

interface Record {
  heart_rate?: number
  power?: number
  cadence?: number
  speed?: number
  distance?: number
  altitude?: number
  temperature?: number
  timestamp?: string | Date
  position_lat?: number
  position_long?: number
  enhanced_speed?: number
  enhanced_altitude?: number
}

interface Lap {
  start_time?: string | Date
  total_elapsed_time?: number
  total_timer_time?: number
  total_distance?: number
  avg_speed?: number
  max_speed?: number
  avg_heart_rate?: number
  max_heart_rate?: number
  avg_power?: number
  max_power?: number
  normalized_power?: number
  total_ascent?: number
  total_descent?: number
  avg_cadence?: number
  max_cadence?: number
  records?: Record[]
}

interface Session {
  start_time?: string | Date
  total_elapsed_time?: number
  total_timer_time?: number
  total_distance?: number
  avg_speed?: number
  max_speed?: number
  avg_heart_rate?: number
  max_heart_rate?: number
  avg_power?: number
  max_power?: number
  normalized_power?: number
  training_stress_score?: number
  intensity_factor?: number
  total_ascent?: number
  total_descent?: number
  avg_cadence?: number
  max_cadence?: number
  laps?: Lap[]
}

interface Activity {
  device_infos?: DeviceInfo[]
  sessions?: Session[]
}

interface FitData {
  activity?: Activity
}

interface FileInfo {
  manufacturer: string
  product: string
  serialNumber: string
  timeCreated: string
}

interface HeartRateZones {
  zone1: number
  zone2: number
  zone3: number
  zone4: number
  zone5: number
}

interface HeartRateAnalysis {
  avg: number
  max: number
  min: number
  zones: HeartRateZones
  drift: string
  dataPoints: number
}

interface ComprehensiveAnalysis {
  fileInfo: FileInfo | unknown
  session: Session | unknown
  laps: Lap[]
  heartRate: HeartRateAnalysis | null
}

type AnalysisResult = ComprehensiveAnalysis | undefined
type AnalysisCallback = (analysis: AnalysisResult) => void

const CONFIG = {
  speedUnit: 'km/h' as const,
  lengthUnit: 'km' as const,
  temperatureUnit: 'celsius' as const,
  showDetailedDi2: true,
  estimateFTP: true,
  calculateTSS: true,
} as const

// Main function to analyze FIT file (Expo/React Native compatible)
export function analyzeFitFile(
  fileContent: Buffer | Uint8Array,
  callback?: AnalysisCallback,
): Promise<AnalysisResult> {
  return analyzeFitFileAsync(fileContent, callback)
}

// Async version for React Native/Expo usage
export async function analyzeFitFileAsync(
  fileContent: Buffer | Uint8Array,
  callback?: AnalysisCallback,
): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const fitParser = new FitParser({
      force: true,
      speedUnit: CONFIG.speedUnit,
      lengthUnit: CONFIG.lengthUnit,
      temperatureUnit: CONFIG.temperatureUnit,
      elapsedRecordField: true,
      mode: 'cascade',
    } satisfies FitParserOptions)

    fitParser.parse(fileContent, (error: string | null, data: FitData) => {
      if (error) {
        console.error('Error parsing FIT file:', error)
        reject(new Error(error))
        return
      }

      const analysis = performComprehensiveAnalysis(data)

      if (callback) {
        callback(analysis)
      }
      resolve(analysis)
    })
  })
}

// Extract file information
function extractFileInfo(
  deviceInfos: DeviceInfo[],
): FileInfo | Record<string, unknown> {
  if (deviceInfos.length === 0) return {}

  const device = deviceInfos[0]
  return {
    manufacturer: device.manufacturer || 'Unknown',
    product: device.product || 'Unknown',
    serialNumber: device.serial_number?.toString() || 'N/A',
    timeCreated: device.time_created
      ? new Date(device.time_created).toLocaleString()
      : 'N/A',
  }
}

// Comprehensive analysis function
function performComprehensiveAnalysis(data: FitData): ComprehensiveAnalysis {
  const activity = data.activity || {}
  const sessions = activity.sessions || []
  const laps = sessions.reduce<Lap[]>(
    (allLaps, session) => allLaps.concat(session.laps || []),
    [],
  )
  const records = laps.reduce<Record[]>(
    (allRecords, lap) => allRecords.concat(lap.records || []),
    [],
  )

  return {
    fileInfo: extractFileInfo(activity.device_infos || []),
    session: sessions[0] || {},
    laps,
    heartRate: analyzeHeartRate(records),
  }
}

// Enhanced heart rate analysis
function analyzeHeartRate(records: Record[]): HeartRateAnalysis | null {
  const heartRates = records
    .filter(
      (r): r is Record & { heart_rate: number } =>
        r.heart_rate !== undefined && r.heart_rate > 50,
    )
    .map((r) => r.heart_rate)

  if (heartRates.length === 0) return null

  const avg = heartRates.reduce((a, b) => a + b, 0) / heartRates.length
  const max = Math.max(...heartRates)
  const min = Math.min(...heartRates)

  // Calculate HR zones based on max HR
  const zones: HeartRateZones = {
    zone1: heartRates.filter((hr) => hr >= max * 0.5 && hr < max * 0.6).length,
    zone2: heartRates.filter((hr) => hr >= max * 0.6 && hr < max * 0.7).length,
    zone3: heartRates.filter((hr) => hr >= max * 0.7 && hr < max * 0.8).length,
    zone4: heartRates.filter((hr) => hr >= max * 0.8 && hr < max * 0.9).length,
    zone5: heartRates.filter((hr) => hr >= max * 0.9).length,
  }

  // Calculate HR drift (sign of fatigue)
  const firstHalf = heartRates.slice(0, Math.floor(heartRates.length / 2))
  const secondHalf = heartRates.slice(Math.floor(heartRates.length / 2))
  const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
  const secondHalfAvg =
    secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
  const drift = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

  return {
    avg: Math.round(avg),
    max,
    min,
    zones,
    drift: drift.toFixed(1),
    dataPoints: heartRates.length,
  }
}

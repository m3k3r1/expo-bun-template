import ExpoModulesCore
import HealthKit

public class ExpoHealthSleepModule: Module {
  private let healthStore = HKHealthStore()
  
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoHealthSleep')` in JavaScript.
    Name("ExpoHealthSleep")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    // Check if HealthKit is available on this device
    Function("isHealthKitAvailable") {
      return HKHealthStore.isHealthDataAvailable()
    }

    // Request authorization for sleep data (modernized for iOS 18)
    AsyncFunction("requestAuthorization") { (promise: Promise) in
      guard HKHealthStore.isHealthDataAvailable() else {
        promise.reject("HEALTHKIT_UNAVAILABLE", "HealthKit is not available on this device")
        return
      }
      
      // Include new iOS 18+ sleep and health types
      let sleepTypes: Set<HKObjectType> = [
        HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!,
        // Add breathing disturbances for sleep apnea detection (iOS 18+)
        HKObjectType.quantityType(forIdentifier: .heartRate)!,
        HKObjectType.quantityType(forIdentifier: .respiratoryRate)!,
        HKObjectType.quantityType(forIdentifier: .bodyTemperature)!
      ]
      
      self.healthStore.requestAuthorization(toShare: nil, read: sleepTypes) { success, error in
        if let error = error {
          promise.reject("AUTHORIZATION_ERROR", error.localizedDescription)
        } else {
          promise.resolve(success)
        }
      }
    }

    // Modern iOS 18+ sleep data query using new descriptors
    AsyncFunction("getSleepDataModern") { (startDate: String, endDate: String, promise: Promise) in
      let dateFormatter = ISO8601DateFormatter()
      
      guard let start = dateFormatter.date(from: startDate),
            let end = dateFormatter.date(from: endDate) else {
        promise.reject("INVALID_DATE", "Invalid date format. Use ISO8601 format.")
        return
      }
      
      guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
        promise.reject("INVALID_TYPE", "Unable to create sleep analysis type")
        return
      }
      
      Task {
        do {
          // Modern iOS 18+ query pattern
          let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)
          let samplePredicate = HKSamplePredicate.categorySample(type: sleepType, predicate: predicate)
          
          let descriptor = HKSampleQueryDescriptor(
            predicates: [samplePredicate],
            sortDescriptors: [SortDescriptor(\.startDate, order: .reverse)],
            limit: HKObjectQueryNoLimit
          )
          
          let samples = try await descriptor.result(for: self.healthStore)
          
          let sleepData = samples.map { sample in
            guard let categorySample = sample as? HKCategorySample else { return [:] }
            return [
              "startDate": dateFormatter.string(from: categorySample.startDate),
              "endDate": dateFormatter.string(from: categorySample.endDate),
              "value": categorySample.value,
              "sleepStage": self.sleepStageString(from: categorySample.value),
              "duration": categorySample.endDate.timeIntervalSince(categorySample.startDate),
              "source": categorySample.sourceRevision.source.name
            ]
          }
          
          promise.resolve(sleepData)
        } catch {
          promise.reject("QUERY_ERROR", error.localizedDescription)
        }
      }
    }

    // Enhanced sleep summary with vitals integration (iOS 18+)
    AsyncFunction("getEnhancedSleepSummary") { (date: String, promise: Promise) in
      let dateFormatter = ISO8601DateFormatter()
      
      guard let targetDate = dateFormatter.date(from: date) else {
        promise.reject("INVALID_DATE", "Invalid date format. Use ISO8601 format.")
        return
      }
      
      let calendar = Calendar.current
      let startOfDay = calendar.startOfDay(for: targetDate)
      let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
      
      Task {
        do {
          // Get sleep data
          let sleepSummary = try await self.getModernSleepSummary(from: startOfDay, to: endOfDay)
          
          // Get vitals data (heart rate, respiratory rate during sleep)
          let vitalsData = try await self.getVitalsData(from: startOfDay, to: endOfDay)
          
          // Combine sleep and vitals data
          let enhancedSummary = sleepSummary.merging(vitalsData) { (current, _) in current }
          
          promise.resolve(enhancedSummary)
        } catch {
          promise.reject("QUERY_ERROR", error.localizedDescription)
        }
      }
    }

    // Get breathing disturbances data (iOS 18+ feature for sleep apnea)
    AsyncFunction("getBreathingDisturbances") { (startDate: String, endDate: String, promise: Promise) in
      let dateFormatter = ISO8601DateFormatter()
      
      guard let start = dateFormatter.date(from: startDate),
            let end = dateFormatter.date(from: endDate) else {
        promise.reject("INVALID_DATE", "Invalid date format. Use ISO8601 format.")
        return
      }
      
      // Note: Breathing disturbances are automatically tracked by watchOS 11+
      // This would access the data if available through future HealthKit APIs
      // For now, we'll return sleep analysis with respiratory indicators
      
      Task {
        do {
          let respiratoryData = try await self.getRespiratoryData(from: start, to: end)
          promise.resolve([
            "period": ["start": start.timeIntervalSince1970, "end": end.timeIntervalSince1970],
            "respiratoryData": respiratoryData,
            "note": "Breathing disturbances are automatically monitored by Apple Watch Ultra 2 with watchOS 11+"
          ])
        } catch {
          promise.reject("QUERY_ERROR", error.localizedDescription)
        }
      }
    }

    // Legacy methods for backward compatibility
    AsyncFunction("getSleepData") { (startDate: String, endDate: String, promise: Promise) in
      // ... existing legacy implementation for compatibility
      let dateFormatter = ISO8601DateFormatter()
      
      guard let start = dateFormatter.date(from: startDate),
            let end = dateFormatter.date(from: endDate) else {
        promise.reject("INVALID_DATE", "Invalid date format. Use ISO8601 format.")
        return
      }
      
      guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
        promise.reject("INVALID_TYPE", "Unable to create sleep analysis type")
        return
      }
      
      let predicate = HKQuery.predicateForSamples(withStart: start, end: end, options: .strictStartDate)
      
      let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
        if let error = error {
          promise.reject("QUERY_ERROR", error.localizedDescription)
          return
        }
        
        guard let sleepSamples = samples as? [HKCategorySample] else {
          promise.resolve([])
          return
        }
        
        let sleepData = sleepSamples.map { sample in
          return [
            "startDate": dateFormatter.string(from: sample.startDate),
            "endDate": dateFormatter.string(from: sample.endDate),
            "value": sample.value,
            "sleepStage": self.sleepStageString(from: sample.value),
            "duration": sample.endDate.timeIntervalSince(sample.startDate)
          ]
        }
        
        promise.resolve(sleepData)
      }
      
      self.healthStore.execute(query)
    }

    AsyncFunction("getSleepSummary") { (date: String, promise: Promise) in
      // ... existing legacy implementation
      let dateFormatter = ISO8601DateFormatter()
      
      guard let targetDate = dateFormatter.date(from: date) else {
        promise.reject("INVALID_DATE", "Invalid date format. Use ISO8601 format.")
        return
      }
      
      let calendar = Calendar.current
      let startOfDay = calendar.startOfDay(for: targetDate)
      let endOfDay = calendar.date(byAdding: .day, value: 1, to: startOfDay)!
      
      guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
        promise.reject("INVALID_TYPE", "Unable to create sleep analysis type")
        return
      }
      
      let predicate = HKQuery.predicateForSamples(withStart: startOfDay, end: endOfDay, options: .strictStartDate)
      
      let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { query, samples, error in
        if let error = error {
          promise.reject("QUERY_ERROR", error.localizedDescription)
          return
        }
        
        guard let sleepSamples = samples as? [HKCategorySample] else {
          promise.resolve([
            "totalSleepTime": 0,
            "inBedTime": 0,
            "asleepTime": 0,
            "remSleepTime": 0,
            "deepSleepTime": 0,
            "coreSleepTime": 0,
            "sleepEfficiency": 0,
            "sleepSamples": []
          ])
          return
        }
        
        var totalSleepTime: TimeInterval = 0
        var inBedTime: TimeInterval = 0
        var asleepTime: TimeInterval = 0
        var remSleepTime: TimeInterval = 0
        var deepSleepTime: TimeInterval = 0
        var coreSleepTime: TimeInterval = 0
        
        for sample in sleepSamples {
          let duration = sample.endDate.timeIntervalSince(sample.startDate)
          
          switch sample.value {
          case HKCategoryValueSleepAnalysis.inBed.rawValue:
            inBedTime += duration
          case HKCategoryValueSleepAnalysis.asleep.rawValue:
            asleepTime += duration
            totalSleepTime += duration
          case HKCategoryValueSleepAnalysis.asleepREM.rawValue:
            remSleepTime += duration
            totalSleepTime += duration
          case HKCategoryValueSleepAnalysis.asleepDeep.rawValue:
            deepSleepTime += duration
            totalSleepTime += duration
          case HKCategoryValueSleepAnalysis.asleepCore.rawValue:
            coreSleepTime += duration
            totalSleepTime += duration
          default:
            break
          }
        }
        
        let sleepEfficiency = inBedTime > 0 ? (totalSleepTime / inBedTime) * 100 : 0
        
        let sleepSummary = [
          "totalSleepTime": totalSleepTime,
          "inBedTime": inBedTime,
          "asleepTime": asleepTime,
          "remSleepTime": remSleepTime,
          "deepSleepTime": deepSleepTime,
          "coreSleepTime": coreSleepTime,
          "sleepEfficiency": sleepEfficiency,
          "sleepSamples": sleepSamples.map { sample in
            return [
              "startDate": dateFormatter.string(from: sample.startDate),
              "endDate": dateFormatter.string(from: sample.endDate),
              "value": sample.value,
              "sleepStage": self.sleepStageString(from: sample.value),
              "duration": sample.endDate.timeIntervalSince(sample.startDate)
            ]
          }
        ]
        
        promise.resolve(sleepSummary)
      }
      
      self.healthStore.execute(query)
    }

    Events("onLoad")
  }
  
  // MARK: - Modern iOS 18+ Helper Methods
  
  @available(iOS 16.0, *)
  private func getModernSleepSummary(from startDate: Date, to endDate: Date) async throws -> [String: Any] {
    guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
      throw NSError(domain: "HealthKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unable to create sleep analysis type"])
    }
    
    let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
    let samplePredicate = HKSamplePredicate.categorySample(type: sleepType, predicate: predicate)
    
    let descriptor = HKSampleQueryDescriptor(
      predicates: [samplePredicate],
      sortDescriptors: [SortDescriptor(\.startDate, order: .forward)],
      limit: HKObjectQueryNoLimit
    )
    
    let samples = try await descriptor.result(for: healthStore)
    let sleepSamples = samples.compactMap { $0 as? HKCategorySample }
    
    var totalSleepTime: TimeInterval = 0
    var inBedTime: TimeInterval = 0
    var asleepTime: TimeInterval = 0
    var remSleepTime: TimeInterval = 0
    var deepSleepTime: TimeInterval = 0
    var coreSleepTime: TimeInterval = 0
    
    for sample in sleepSamples {
      let duration = sample.endDate.timeIntervalSince(sample.startDate)
      
      switch sample.value {
      case HKCategoryValueSleepAnalysis.inBed.rawValue:
        inBedTime += duration
      case HKCategoryValueSleepAnalysis.asleep.rawValue:
        asleepTime += duration
        totalSleepTime += duration
      case HKCategoryValueSleepAnalysis.asleepREM.rawValue:
        remSleepTime += duration
        totalSleepTime += duration
      case HKCategoryValueSleepAnalysis.asleepDeep.rawValue:
        deepSleepTime += duration
        totalSleepTime += duration
      case HKCategoryValueSleepAnalysis.asleepCore.rawValue:
        coreSleepTime += duration
        totalSleepTime += duration
      default:
        break
      }
    }
    
    let sleepEfficiency = inBedTime > 0 ? (totalSleepTime / inBedTime) * 100 : 0
    
    return [
      "totalSleepTime": totalSleepTime,
      "inBedTime": inBedTime,
      "asleepTime": asleepTime,
      "remSleepTime": remSleepTime,
      "deepSleepTime": deepSleepTime,
      "coreSleepTime": coreSleepTime,
      "sleepEfficiency": sleepEfficiency,
      "sleepQualityMetrics": [
        "remPercentage": totalSleepTime > 0 ? (remSleepTime / totalSleepTime) * 100 : 0,
        "deepPercentage": totalSleepTime > 0 ? (deepSleepTime / totalSleepTime) * 100 : 0,
        "corePercentage": totalSleepTime > 0 ? (coreSleepTime / totalSleepTime) * 100 : 0
      ]
    ]
  }
  
  @available(iOS 16.0, *)
  private func getVitalsData(from startDate: Date, to endDate: Date) async throws -> [String: Any] {
    // Get heart rate during sleep
    let heartRateData = try await getHeartRateData(from: startDate, to: endDate)
    
    // Get respiratory rate during sleep
    let respiratoryData = try await getRespiratoryData(from: startDate, to: endDate)
    
    return [
      "vitals": [
        "averageHeartRate": heartRateData["average"] ?? 0,
        "heartRateVariability": heartRateData["variability"] ?? 0,
        "averageRespiratoryRate": respiratoryData["average"] ?? 0,
        "respiratoryVariability": respiratoryData["variability"] ?? 0
      ],
      "sleepHealthScore": calculateSleepHealthScore(heartRate: heartRateData, respiratory: respiratoryData)
    ]
  }
  
  @available(iOS 16.0, *)
  private func getHeartRateData(from startDate: Date, to endDate: Date) async throws -> [String: Double] {
    guard let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate) else {
      throw NSError(domain: "HealthKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unable to create heart rate type"])
    }
    
    let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
    let samplePredicate = HKSamplePredicate.quantitySample(type: heartRateType, predicate: predicate)
    
    let descriptor = HKStatisticsQueryDescriptor(
      predicate: samplePredicate,
      options: [.discreteAverage, .discreteMin, .discreteMax]
    )
    
    let result = try await descriptor.result(for: healthStore)
    
    let average = result?.averageQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    let min = result?.minimumQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    let max = result?.maximumQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    
    return [
      "average": average,
      "min": min,
      "max": max,
      "variability": max - min
    ]
  }
  
  @available(iOS 16.0, *)
  private func getRespiratoryData(from startDate: Date, to endDate: Date) async throws -> [String: Double] {
    guard let respiratoryType = HKObjectType.quantityType(forIdentifier: .respiratoryRate) else {
      throw NSError(domain: "HealthKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "Unable to create respiratory rate type"])
    }
    
    let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
    let samplePredicate = HKSamplePredicate.quantitySample(type: respiratoryType, predicate: predicate)
    
    let descriptor = HKStatisticsQueryDescriptor(
      predicate: samplePredicate,
      options: [.discreteAverage, .discreteMin, .discreteMax]
    )
    
    let result = try await descriptor.result(for: healthStore)
    
    let average = result?.averageQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    let min = result?.minimumQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    let max = result?.maximumQuantity()?.doubleValue(for: HKUnit.count().unitDivided(by: .minute())) ?? 0
    
    return [
      "average": average,
      "min": min,
      "max": max,
      "variability": max - min
    ]
  }
  
  private func calculateSleepHealthScore(heartRate: [String: Double], respiratory: [String: Double]) -> Double {
    // Simple sleep health score calculation
    // In a real implementation, this would use more sophisticated algorithms
    let hrScore = heartRate["average"] ?? 0 > 0 ? min(100, max(0, 100 - abs(60 - (heartRate["average"] ?? 60)))) : 0
    let respScore = respiratory["average"] ?? 0 > 0 ? min(100, max(0, 100 - abs(16 - (respiratory["average"] ?? 16)) * 5)) : 0
    
    return (hrScore + respScore) / 2.0
  }
  
  private func sleepStageString(from value: Int) -> String {
    switch value {
    case HKCategoryValueSleepAnalysis.inBed.rawValue:
      return "inBed"
    case HKCategoryValueSleepAnalysis.asleep.rawValue:
      return "asleep"
    case HKCategoryValueSleepAnalysis.asleepREM.rawValue:
      return "rem"
    case HKCategoryValueSleepAnalysis.asleepDeep.rawValue:
      return "deep"
    case HKCategoryValueSleepAnalysis.asleepCore.rawValue:
      return "core"
    case HKCategoryValueSleepAnalysis.awake.rawValue:
      return "awake"
    default:
      return "unknown"
    }
  }
}

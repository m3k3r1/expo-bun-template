import { Button } from '@/components/ui/button'
import { View, ScrollView, Alert, Text } from 'react-native'
import { Upload, FileText, AlertTriangle, Bike } from 'lucide-react-native'
import { router } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import { useState } from 'react'
import { analyzeFitFileAsync } from '@/services/fit-file-parser'

export default function UploadFileInfoModal() {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Handle file selection - specifically for .fit files
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // We'll validate .fit files manually
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0]

        // Check if it's a .fit file
        if (!file.name.toLowerCase().endsWith('.fit')) {
          Alert.alert(
            'Invalid File Type',
            'Please select a .fit file from your Wahoo device or cycling computer.',
          )
          return
        }

        // Read file content for analysis
        const response = await fetch(file.uri)
        const arrayBuffer = await response.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        const analysis = await analyzeFitFileAsync(uint8Array)
        console.log(analysis)
        setSelectedFile(result)
      }
    } catch (error) {
      console.error('Error selecting file:', error)
      Alert.alert('Error', 'Failed to select file. Please try again.')
    }
  }

  // Handle the actual upload process
  const handleUpload = async () => {
    if (!selectedFile || selectedFile.canceled) return

    setIsUploading(true)

    try {
      // TODO: Implement actual upload logic here
      // This would connect to your backend service
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate upload

      Alert.alert(
        'Upload Successful! 🚴‍♂️',
        'Your ride data has been processed and added to your cycling log.',
        [
          {
            text: 'View My Rides',
            onPress: () => {
              router.back()
              // TODO: Navigate to rides list or dashboard
            },
          },
        ],
      )
    } catch (error) {
      console.error('Upload error:', error)
      Alert.alert(
        'Upload Failed',
        'There was an error processing your ride data. Please try again.',
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="bg-selected/10 p-4 rounded-full mb-4">
            <Bike className="text-selected" size={32} />
          </View>
          <Text className="text-2xl font-barlow-700 text-center mb-2">
            Upload Your Ride
          </Text>
          <Text className="text-center text-foreground/70 font-barlow-400 px-4">
            Import your cycling data from Wahoo devices to track your
            performance and progress
          </Text>
        </View>

        {/* File Upload Section */}
        <View className="mb-8">
          <Text className="text-lg font-barlow-500 mb-4 text-center">
            Select Your .fit File
          </Text>

          <View className="bg-card border border-border rounded-xl p-6 mb-4">
            {selectedFile && !selectedFile.canceled ? (
              <View className="items-center">
                <FileText className="text-selected mb-2" size={24} />
                <Text className="font-barlow-500 text-center mb-1">
                  {selectedFile.assets[0].name}
                </Text>
                <Text className="text-sm text-foreground/60 font-barlow-400">
                  {(selectedFile.assets[0].size! / 1024).toFixed(1)} KB
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Upload className="text-foreground/40 mb-3" size={32} />
                <Text className="text-foreground/60 font-barlow-400 text-center">
                  No file selected
                </Text>
              </View>
            )}
          </View>

          <Button
            variant="outline"
            className="w-full border-selected"
            onPress={handleSelectFile}
            disabled={isUploading}
          >
            <Text className="text-selected font-barlow-500">
              Choose .fit File
            </Text>
          </Button>
        </View>

        {/* Upload Button */}
        <Button
          className="w-full bg-selected mb-6"
          onPress={handleUpload}
          disabled={!selectedFile || selectedFile.canceled || isUploading}
        >
          <Text className="text-white font-barlow-500">
            {isUploading ? 'Processing Ride...' : 'Process'}
          </Text>
        </Button>

        {/* Disclaimer Section */}
        <View className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <View className="flex-row items-start gap-3">
            <AlertTriangle
              className="text-orange-600 dark:text-orange-400 mt-0.5"
              size={20}
            />
            <View className="flex-1">
              <Text className="font-barlow-500 text-orange-800 dark:text-orange-200 mb-2">
                Important Information
              </Text>
              <Text className="text-sm text-orange-700 dark:text-orange-300 font-barlow-400 leading-5">
                • Only upload .fit files from trusted sources{'\n'}• Supported
                devices: Wahoo ELEMNT, BOLT, ROAM{'\n'}• Your ride data will be
                processed securely{'\n'}• Large files may take a few moments to
                process
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing for gesture indicator */}
        <View className="h-6" />
      </View>
    </ScrollView>
  )
}

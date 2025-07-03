import dayjs from 'dayjs'
import { View, Dimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'

export function WeekActivityChart() {
  const startOfWeek = dayjs().startOf('week')
  const weekDays = [...Array(7)].map((_, i) => startOfWeek.add(i, 'day'))
  const today = dayjs()

  return (
    <View>
      <View className="flex items-center justify-center pt-4">
        <BarChart
          data={weekDays.map((day) => ({
            value: Math.floor(Math.random() * 50),
            label: `${day.format('ddd')}`,
            frontColor: day.isSame(today, 'day')
              ? '#F25606'
              : 'rgb(181, 177, 177)',
          }))}
          height={150}
          spacing={25}
          minHeight={3}
          width={Dimensions.get('window').width - 120}
          barWidth={20}
          barBorderRadius={3}
          noOfSections={5}
          yAxisThickness={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{
            fontSize: 14,
            fontFamily: 'Barlow_400Regular',
            color: '#64748B',
          }}
          yAxisTextStyle={{
            fontSize: 14,
            fontFamily: 'Barlow_400Regular',
            color: '#64748B',
          }}
          isAnimated={true}
          animationDuration={300}
        />
      </View>
    </View>
  )
}

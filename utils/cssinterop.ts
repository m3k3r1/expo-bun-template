import { cssInterop } from 'nativewind'
import { LinearGradient } from 'expo-linear-gradient'
// import { Stagger } from '@animatereactnative/stagger'
import { icons } from 'lucide-react-native'

cssInterop(LinearGradient, {
  className: 'style',
})

Object.keys(icons).forEach((key) => {
  const IconComponent = icons[key]
  cssInterop(IconComponent, {
    className: 'style',
  })
})

// cssInterop(Stagger, {
//   className: 'style',
// })

import { cssInterop } from 'nativewind'
import { LinearGradient } from 'expo-linear-gradient'
// import { Stagger } from '@animatereactnative/stagger'
import { icons } from 'lucide-react-native'

// cssInterop(Stagger, {
//   className: 'style',
// })

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

cssInterop(LinearGradient, {
  className: 'style',
})

Object.keys(icons).forEach((key) => {
  const IconComponent = icons[key]
  cssInterop(IconComponent, {
    className: 'style',
  })
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

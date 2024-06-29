import { useEffect } from 'react'
import { StyleSheet, Text, useWindowDimensions } from 'react-native'
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  useDerivedValue
} from 'react-native-reanimated'
import { useAtom } from 'jotai'
// type
import { snackBarAtom } from '../state/snackBarAtom'

export function SnackBar() {
  const { width } = useWindowDimensions()
  const [open, setOpen] = useAtom(snackBarAtom)
  const progress = useDerivedValue(() => withTiming(open ? 0 : -200, { duration: 300 }))

  const containerStyle = useAnimatedStyle(() => {
    return {
      top: progress.value
    }
  })

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
  }, [open, setOpen])

  return (
    <Animated.View style={[styles.container, containerStyle, { borderRadius: width * 0.03 }]}>
      <Text>コピーしました</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderColor: '#202020',
    borderWidth: 1
  }
})

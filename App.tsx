import { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { useSetAtom } from 'jotai'
// state
import { snackBarAtom } from './src/state/snackBarAtom'
// constants
import { MORSE_JA } from './morse'
// components
import { SnackBar } from './src/snackBar'

const useMorseConverter = () => {
  const [convertedText, setConverted] = useState<string>('')

  const converter = (text: string) => {
    let converted = ''
    const texts = text.split('')

    for (let i = 0; i < texts.length; i += 1) {
      const value = texts[i]
      const morse = MORSE_JA[value]

      if (!morse) {
        converted = converted.concat(value, '　')
      } else {
        converted = converted.concat(morse, '　')
      }
    }

    setConverted(converted)
  }

  return { convertedText, converter }
}

export default function App() {
  const [text, setText] = useState<string>('')
  const { convertedText, converter } = useMorseConverter()
  // local state
  const [isDoneButton, setIsDoneButton] = useState<boolean>(false)
  // jotai
  const setSnackBar = useSetAtom(snackBarAtom)

  const changeText = (value: string) => {
    setText(value)
    converter(value)
  }

  const resetText = () => {
    setText('')
  }

  const dismissKeybord = () => {
    Keyboard.dismiss()
  }

  const copy = async () => {
    try {
      await Clipboard.setStringAsync(convertedText)
      setSnackBar(true)
    } catch {
      Alert.alert('エラー', 'コピーに失敗しました')
    }
  }

  useEffect(() => {
    const showKeyboardSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setIsDoneButton(true)
    })

    const hideKeyboardSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setIsDoneButton(false)
    })

    return () => {
      showKeyboardSubscription.remove()
      hideKeyboardSubscription.remove()
    }
  }, [])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SnackBar />
        <Text>{convertedText}</Text>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="padding" keyboardVerticalOffset={60}>
          {convertedText.length ? (
            <TouchableOpacity style={styles.copyButton} onPress={copy}>
              <Text>コピー</Text>
            </TouchableOpacity>
          ) : null}
          {text.length ? (
            <TouchableOpacity style={styles.clearButton} onPress={resetText}>
              <Text>クリア</Text>
            </TouchableOpacity>
          ) : null}
          <TextInput
            style={styles.input}
            value={text}
            editable
            multiline
            autoCorrect={false}
            placeholder="入力"
            autoCapitalize="none"
            autoComplete="off"
            inputMode="text"
            keyboardType="phone-pad"
            keyboardAppearance="default"
            onChangeText={changeText}
          />
          {isDoneButton ? (
            <TouchableOpacity style={styles.doneButton} onPress={dismissKeybord}>
              <Text>完了</Text>
            </TouchableOpacity>
          ) : null}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  input: {
    height: 80,
    width: '100%',
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderColor: '#202020'
  },
  inputTitle: {
    alignSelf: 'flex-start'
  },
  doneButton: {
    alignSelf: 'flex-end',
    padding: 10
  },
  clearButton: {
    alignSelf: 'flex-end',
    padding: 10
  },
  copyButton: {
    alignSelf: 'flex-start',
    padding: 10
  }
})

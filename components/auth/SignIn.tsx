import React, { useState } from 'react'
import { Alert, View, AppState, Text } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'expo-router'
import i18n from '@/utils/translations'


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    console.log(data)
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
<View className='justify-center px-4 '>
      <View className='mb-4'>
        <TextInput
          outlineColor='#c42b4c'
          selectionColor='#c42b4c'
          onChangeText={(text) => setEmail(text)}
          value={email}
          textContentType='emailAddress'
          maxLength={320}
          placeholder={i18n.t('auth.exampleemail')}
          autoCapitalize="none"
          className='bg-red-50'
        />
      </View>
      <View className='mb-4'>
        <TextInput
          outlineColor='#c42b4c'
          selectionColor='#c42b4c'
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          maxLength={64}
          textContentType='password'
          placeholder={i18n.t('auth.password')}
          autoCapitalize="none"
          className='bg-red-50'
        />
      </View>
      <View className='mb-4'>
        <Button buttonColor='#c42b4c' textColor='#ffdee5' disabled={isLoading} onPress={() => signInWithEmail()}>{i18n.t('auth.Sign_in')}</Button>
      </View>
      <View className='flex-row justify-center'>
        <Text>{i18n.t('auth.Dont_have_an_account')}
          <Text className='underline text-blue-600 hover:text-blue-800 visited:text-purple-600'
            disabled={isLoading}
            onPress={() => router.push('/auth/sign-up')}>
              {i18n.t('auth.Sign_up')}
            </Text>
        </Text>
      </View>
    </View>
  )
}
import React, { useState } from 'react'
import { Alert, View, AppState, Button, TextInput, Text } from 'react-native'
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
<View className='justify-center px-4'>
      <View className='mb-4'>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          textContentType='emailAddress'
          maxLength={320}
          placeholder={i18n.t('auth.exampleemail')}
          autoCapitalize="none"
          className='border rounded p-3'
        />
      </View>
      <View className='mb-4'>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          maxLength={64}
          textContentType='password'
          placeholder={i18n.t('auth.password')}
          autoCapitalize="none"
          className='border rounded p-3'
        />
      </View>
      <View className='mb-4'>
        <Button title={i18n.t('auth.Sign_in')} disabled={isLoading} onPress={() => signInWithEmail()} />
      </View>
      <View className='flex-row justify-center'>
        <Text>{i18n.t('auth.Dont_have_an_account')}
          <Text className=' text-indigo-600 btn'
            disabled={isLoading}
            onPress={() => router.push('/auth/sign-up')}>
              {i18n.t('auth.Sign_up')}
            </Text>
        </Text>
      </View>
    </View>
  )
}
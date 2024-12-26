import React from 'react'
import {
    GoogleSignin,
    GoogleSigninButton,
    SignInResponse,
    statusCodes,
  } from '@react-native-google-signin/google-signin'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import env from '@/utils/env'
  
export default function GoogleAuth() {
    const router = useRouter()

    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        webClientId: env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
    })

    return (
        <GoogleSigninButton
        size={GoogleSigninButton.Size.Standard}
        color={GoogleSigninButton.Color.Dark}
        onPress={async () => {
            try {
                await GoogleSignin.signOut();
                await GoogleSignin.hasPlayServices()
                const userInfo: SignInResponse = await GoogleSignin.signIn()
                //@ts-ignore
                if (userInfo.data.idToken) {
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        //@ts-ignore
                        token: userInfo.data.idToken,
                    })
                    console.log(error, data)
                    if (error) {
                        throw new Error('supabase error')
                    } else {
                        router.replace("/home")
                    }
                } else {
                    throw new Error('no ID token present!')
                }
            } catch (error: any) {
                if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                  console.log(error);
                  Alert.alert('SIGN_IN_CANCELLED', error.message);
                } else if (error.code === statusCodes.IN_PROGRESS) {
                  console.log(error);
                  Alert.alert('IN_PROGRESS', error.message);
                } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                  console.log(error);
                  Alert.alert('PLAY_SERVICES_NOT_AVAILABLE', error.message);
                } else {
                  console.log(error);
                  Alert.alert('UNEXPECTED_ERROR', error.message);
                }
            }
        }}
        />
    )
}

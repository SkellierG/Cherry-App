import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import env from '@/utils/env';
import { View } from 'react-native';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';

export default function GoogleAuth() {
    return <View>
    <GoogleOAuthProvider clientId={env.EXPO_PUBLIC_GOOGLE_CLIENT_ID}>
        <GoogleLogin
            theme='outline'
            onSuccess={async credentialResponse => {
                if (credentialResponse.credential) {
                    const { data, error } = await supabase.auth.signInWithIdToken({
                        provider: 'google',
                        //@ts-ignore
                        token: credentialResponse.credential,
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
            }}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    </GoogleOAuthProvider>
    </View>;
}

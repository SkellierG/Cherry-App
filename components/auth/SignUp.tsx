import React, { useState } from 'react'
import { Alert, View, Text } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { supabase } from '../../utils/supabase'
import { useRouter } from 'expo-router'
import i18n from '@/utils/translations'

export default function SignIn() {
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setLoading] = useState(false)
    const [formError, setFormError] = useState<string | null>(null) 
    const router = useRouter()

    function validateFields() {
        if (!name || !lastname || !email || !password || !confirmPassword) {
            setFormError(i18n.t('errors.auth.Fields_required')) 
            return false
        }
        if (password !== confirmPassword) {
            setFormError(i18n.t('errors.auth.Password_mismatch')) 
            return false
        }
        setFormError(null)
        return true
    }

    async function signUpWithEmail() {
        if (!validateFields()) return

        setLoading(true)
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        console.log(data)
        if (error) Alert.alert(error.message)
        if (!data.session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    return (
        <View className="justify-center px-4 ">
            {formError && (
                <Text className="text-red-500 text-center mb-4">{formError}</Text>
            )}

            <View className="mb-4">
                <TextInput
                    outlineColor="#c42b4c"
                    selectionColor="#c42b4c"
                    onChangeText={(text) => setName(text)}
                    value={name}
                    textContentType="name"
                    maxLength={40}
                    placeholder={i18n.t('users.First_name')}
                    autoCapitalize="words"
                    className="bg-red-50"
                />
            </View>
            <View className="mb-4">
                <TextInput
                    outlineColor="#c42b4c"
                    selectionColor="#c42b4c"
                    onChangeText={(text) => setLastname(text)}
                    value={lastname}
                    textContentType="name"
                    maxLength={40}
                    placeholder={i18n.t('users.Last_name')}
                    autoCapitalize="words"
                    className="bg-red-50"
                />
            </View>
            <View className="mb-4">
                <TextInput
                    outlineColor="#c42b4c"
                    selectionColor="#c42b4c"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    textContentType="emailAddress"
                    maxLength={320}
                    placeholder={i18n.t('auth.exampleemail')}
                    autoCapitalize="none"
                    className="bg-red-50"
                />
            </View>
            <View className="mb-4">
                <TextInput
                    outlineColor="#c42b4c"
                    selectionColor="#c42b4c"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    maxLength={64}
                    textContentType="password"
                    placeholder={i18n.t('auth.password')}
                    autoCapitalize="none"
                    className="bg-red-50"
                />
            </View>
            <View className="mb-4">
                <TextInput
                    outlineColor="#c42b4c"
                    selectionColor="#c42b4c"
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    secureTextEntry={true}
                    maxLength={64}
                    textContentType="password"
                    placeholder={i18n.t('auth.confirm_password')}
                    autoCapitalize="none"
                    className="bg-red-50"
                />
            </View>
            <View className="mb-4">
                <Button buttonColor="#c42b4c" textColor="#ffdee5" disabled={isLoading} onPress={() => signUpWithEmail()}>
                    {i18n.t('auth.Sign_in')}
                </Button>
            </View>
            <View className="flex-row justify-center">
                <Text>{i18n.t('auth.Already_have_an_account')}
                    <Text className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                        disabled={isLoading}
                        onPress={() => router.push('/auth/sign-in')}>
                        {i18n.t('auth.Sign_in')}
                    </Text>
                </Text>
            </View>
        </View>
    )
}

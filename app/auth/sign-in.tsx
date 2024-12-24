//@ts-ignore
import GoogleAuth from "@/components/auth/Google"
import React from "react"
import { View } from "react-native"
import SignIn from "@/components/auth/SignIn"

export default function SignInScreen() {
    return <View className="">
        <SignIn></SignIn>
        <GoogleAuth></GoogleAuth>
    </View>
}
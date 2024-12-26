//@ts-ignore
import GoogleAuth from "@/components/auth/Google"
import React from "react"
import { View } from "react-native"
import SignIn from "@/components/auth/SignIn"

export default function SignInScreen() {
    return <View className=" h-screen bg-red-100">
        <View className="mt-20">
            <SignIn/>
        </View>
        <View className="flex-1 justify-top items-center mt-5">
            <GoogleAuth />
        </View>
    </View>
}
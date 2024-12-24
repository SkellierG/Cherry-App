import SignUp from "@/components/auth/SignUp"
import React from "react"
import { View } from "react-native"

export default function SignUpScreen() {
    return <View className=" h-screen bg-red-100">
        <View className="mt-20">
            <SignUp />
        </View>
    </View>

}
import { supabase } from "@utils/supabase"
import React from "react"
import { View, Text, Button } from "react-native"

export default function HomeScreen() {
    return <View>
        <Text>Home Screen</Text>
        <Button title="Borrar sesion" onPress={() => supabase.auth.signOut()}></Button>
    </View>
}
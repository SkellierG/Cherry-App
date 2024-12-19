import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import suprabase from '../../utils/supabase.js';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function login() {
    return(<>
    <View>
        <Text>Esta es la pagina de Login</Text>
        <TextInput></TextInput>
        <Button title="Iniciar sesion nseah"></Button>
    </View>
    </>);
}
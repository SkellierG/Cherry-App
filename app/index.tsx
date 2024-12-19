import { useRouter } from "expo-router";
import React from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function Index() {
  const router = useRouter();
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello papi</Text>
      <Text>Edit app/index.tsx aaa to edit this screen.</Text>
      <TextInput></TextInput>
      <Button title="login screen" onPress={() => router.replace('/auth/login')}></Button>
    </View>
  );
}

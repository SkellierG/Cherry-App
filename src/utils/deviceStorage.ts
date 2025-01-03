import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getDeviceStorage = () => {
	if (Platform.OS === "web") {
		try {
			if (typeof localStorage !== "undefined") {
				localStorage.setItem("__test__", "test");
				localStorage.removeItem("__test__");

				return {
					async getItem(key: string) {
						return localStorage.getItem(key);
					},
					async setItem(key: string, value: string) {
						localStorage.setItem(key, value);
					},
					async removeItem(key: string) {
						localStorage.removeItem(key);
					},
				};
			}
		} catch (error) {
			console.warn(
				"localStorage no está disponible. Usando almacenamiento en memoria.",
				error,
			);
		}

		const memoryStorage: Record<string, string> = {};

		return {
			async getItem(key: string) {
				return memoryStorage[key] || null;
			},
			async setItem(key: string, value: string) {
				memoryStorage[key] = value;
			},
			async removeItem(key: string) {
				delete memoryStorage[key];
			},
		};
	}

	return {
		async getItem(key: string) {
			return AsyncStorage.getItem(key);
		},
		async setItem(key: string, value: string) {
			return AsyncStorage.setItem(key, value);
		},
		async removeItem(key: string) {
			return AsyncStorage.removeItem(key);
		},
	};
};

const DeviceStorage = getDeviceStorage();

export default DeviceStorage;

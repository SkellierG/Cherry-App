import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//@ts-ignore
import { StorageInterface } from "@types/Components";

const createMemoryStorage = (): StorageInterface => {
	let memoryStorage: Record<string, string> = {};

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
};

const getDeviceStorage = (): StorageInterface => {
	if (Platform.OS === "web") {
		try {
			if (typeof localStorage !== "undefined") {
				localStorage.setItem("__test__", "test");
				localStorage.removeItem("__test__");

				return {
					async getItem(key: string) {
						return Promise.resolve(localStorage.getItem(key));
					},
					async setItem(key: string, value: string) {
						localStorage.setItem(key, value);
						return Promise.resolve();
					},
					async removeItem(key: string) {
						localStorage.removeItem(key);
						return Promise.resolve();
					},
				};
			}
		} catch (error) {
			console.warn(
				"localStorage no está disponible. Usando almacenamiento en memoria.",
				error,
			);
		}

		return createMemoryStorage();
	}

	console.info("Para Android/iOS usa AsyncStorage");
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

const DeviceStorage: StorageInterface = getDeviceStorage();

export default DeviceStorage;

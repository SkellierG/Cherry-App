import { Platform } from "react-native";
//@ts-ignore
import { StorageInterface, StorageKey } from "@types/Components";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

let getItemAsync = async (key: string): Promise<string | null> => null;

const parseStoredValue = (
	value: string | null,
	type: "string" | "number" | "boolean",
):
	| (string | undefined)
	| (number | undefined)
	| (boolean | undefined)
	| undefined => {
	if (value === null) return undefined;
	const parsed = JSON.parse(value);
	switch (type) {
		case "string":
			return typeof parsed === "string" ? (parsed as string) : undefined;
		case "number":
			return typeof parsed === "number" ? (parsed as number) : undefined;
		case "boolean":
			return typeof parsed === "boolean" ? (parsed as boolean) : undefined;
		default:
			return undefined;
	}
};

const createMemoryStorage = (): StorageInterface => {
	const memoryStorage: Record<string, string> = {};

	getItemAsync = async (key: string): Promise<string | null> => {
		return JSON.stringify(memoryStorage[key]) || null;
	};

	return {
		getItem(key: StorageKey, type: "string" | "number" | "boolean") {
			return parseStoredValue(memoryStorage[key] || null, type);
		},
		setItem(key: StorageKey, value: any) {
			memoryStorage[key] = JSON.stringify(value);
			return;
		},
		removeItem(key: StorageKey) {
			delete memoryStorage[key];
			return;
		},
		clear() {
			Object.keys(memoryStorage).forEach((key) => {
				delete memoryStorage[key];
			});
			return;
		},
	};
};

const getDeviceStorage = (): StorageInterface => {
	if (Platform.OS === "web") {
		if (typeof localStorage !== "undefined") {
			localStorage.setItem("__test__", "test");
			localStorage.removeItem("__test__");

			getItemAsync = async (key: string): Promise<string | null> => {
				return localStorage.getItem(key);
			};

			return {
				getItem(key: StorageKey, type: "string" | "number" | "boolean") {
					return parseStoredValue(localStorage.getItem(key) || null, type);
				},
				setItem(key: StorageKey, value: any) {
					return localStorage.setItem(key, JSON.stringify(value));
				},
				removeItem(key: StorageKey) {
					return localStorage.removeItem(key);
				},
				clear() {
					return localStorage.clear();
				},
			};
		} else {
			console.warn("LocalStorage not found, usign memorystorage");
			return createMemoryStorage();
		}
	}

	console.info("Para Android/iOS usa MMKV");
	getItemAsync = async (key: string): Promise<string | null> => {
		return (
			mmkv.getString(key) ||
			JSON.stringify(mmkv.getNumber(key) || mmkv.getBoolean(key)) ||
			null
		);
	};

	return {
		getItem(key: StorageKey, type: "string" | "number" | "boolean") {
			switch (type) {
				case "string":
					return mmkv.getString(key);
				case "number":
					return mmkv.getNumber(key);
				case "boolean":
					return mmkv.getBoolean(key);
				default:
					throw undefined;
			}
		},
		setItem(key: StorageKey, value: any) {
			if (
				typeof value !== "string" &&
				typeof value !== "number" &&
				typeof value !== "boolean"
			) {
				return mmkv.set(key, JSON.stringify(value));
			} else {
				return mmkv.set(key, value);
			}
		},
		removeItem(key: StorageKey) {
			return mmkv.delete(key);
		},
		clear() {
			return mmkv.clearAll();
		},
	};
};

type TPromisify<T> = {
	[K in keyof T]: T[K] extends (...args: infer A) => infer R
		? (...args: A) => Promise<R>
		: T[K];
};

function Promisify<T extends object>(obj: T): TPromisify<T> {
	const result = {} as TPromisify<T>;

	for (const key of Object.keys(obj) as (keyof T)[]) {
		const value = obj[key];
		if (typeof value === "function") {
			result[key] = ((...args: any[]) =>
				new Promise((resolve) =>
					resolve((value as any)(...args)),
				)) as TPromisify<T>[typeof key];
		} else {
			result[key] = value as any;
		}
	}

	return result;
}

const DeviceStorage: StorageInterface = getDeviceStorage();

const AsyncDeviceStorage = Promisify(DeviceStorage as Storage);

export const supabaseDeviceStorage = {
	getItem: getItemAsync,
	setItem: AsyncDeviceStorage.setItem,
	removeItem: AsyncDeviceStorage.removeItem,
	clear: AsyncDeviceStorage.clear,
};

export default DeviceStorage;

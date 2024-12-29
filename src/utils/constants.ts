import { Platform } from "react-native";
import { Linking } from "react-native";

const getBaseAddress = async () => {
	if (Platform.OS === "web") {
		const { protocol, hostname, port } = window.location;
		return `${protocol}//${hostname}${port ? `:${port}` : ""}`;
	} else {
		const initialUrl = await Linking.getInitialURL();
		return initialUrl || "myapp://"; // Deep link base por defecto
	}
};

const constants = {
	baseAdress: getBaseAddress().then((adress) => adress),
};

console.info(JSON.stringify(constants, null, 2));

export default constants;

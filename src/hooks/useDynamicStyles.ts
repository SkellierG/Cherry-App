import { useColorScheme, StyleSheet } from "react-native";

/**
 * Hook to generate dynamic styles based on the current color scheme.
 *
 * @template T - The type of the generated styles (must extend `StyleSheet.NamedStyles<T>`).
 * @param {DynamicStyles<T>} generateStyles - A function that takes the color scheme
 * (`"light"` or `"dark"`) and returns a style object.
 * @returns {T} - The dynamically generated styles object.
 *
 * @example
 * const styles = useDynamicStyles((theme) => ({
 *   container: {
 *     backgroundColor: theme === "dark" ? "#000" : "#fff",
 *   },
 *   text: {
 *     color: theme === "dark" ? "#fff" : "#000",
 *   },
 * }));
 *
 * return <View style={styles.container}><Text style={styles.text}>Hello</Text></View>;
 */
export const useDynamicStyles = <T extends StyleSheet.NamedStyles<T>>(
	generateStyles: (theme: "light" | "dark") => T,
): T => {
	const theme = useColorScheme() || "light";
	return generateStyles(theme);
};

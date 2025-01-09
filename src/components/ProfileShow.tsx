import { Text, View, Image } from "react-native";
import React, { ReactNode } from "react";
import { useDynamicStyles } from "last-old-src/hooks/useDynamicStyles";

type ProfileComponentProps = {
	children?: ReactNode;
	name?: string;
	email?: string;
	imageSource?: any;
};

export default function ProfileShow({
	children,
	name = "Lorem Ipsum",
	email = "name@domain.com",
	imageSource = require("../../assets/images/favicon.png"),
}: ProfileComponentProps) {
	const styles = useDynamicStyles((theme) => ({
		main: {
			marginTop: 10,
		},
		imageContainer: {
			justifyContent: "center",
			alignItems: "center",
		},
		image: {
			width: 150,
			height: 150,
			borderRadius: 50,
			marginBottom: 5,
		},
		name: {
			fontSize: 16,
			fontWeight: "bold",
			color: theme === "dark" ? "white" : "black",
		},
		email: {
			fontSize: 16,
			fontWeight: "500",
			color: theme === "dark" ? "white" : "black",
		},
		middleSectionTextContainer: {
			flexDirection: "row",
			justifyContent: "space-evenly",
			marginTop: 20,
		},
		middleSectionText: {
			justifyContent: "center",
			alignItems: "center",
		},
		toptext: {
			fontSize: 16,
			color: "white",
			fontWeight: "bold",
		},
		bottomtext: {
			fontSize: 16,
			color: "darkgrey",
			fontWeight: "700",
		},
	}));

	return (
		<View style={styles.main}>
			<View style={styles.imageContainer}>
				<Image style={styles.image} source={imageSource} />
				<Text style={styles.name}>{name}</Text>
				<Text style={styles.email}>{email}</Text>
			</View>
			<View style={styles.middleSectionTextContainer}>
				{/* {<View style={styles.middleSectionText}>
                    <Text style={styles.toptext}>Applied</Text>
                    <Text style={styles.bottomtext}>{applied}</Text>
                </View>
                <View style={styles.middleSectionText}>
                    <Text style={styles.toptext}>Reviewed</Text>
                    <Text style={styles.bottomtext}>{reviewed}</Text>
                </View>
                <View style={styles.middleSectionText}>
                    <Text style={styles.toptext}>Contacted</Text>
                    <Text style={styles.bottomtext}>{contacted}</Text>
                </View>} */}
			</View>
			{children}
		</View>
	);
}

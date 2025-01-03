import React, { ReactNode } from "react";
import { Button, View, H1, Paragraph, Text } from "tamagui";
import { Dimensions, GestureResponderEvent } from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";

interface DummyScreenProps {
	children?: ReactNode;
	screenName?: string;
	buttonTitle?: string;
	buttonFunction?: ((event: GestureResponderEvent) => void) | undefined;
}

const DummyScreen: React.FC<DummyScreenProps> = ({
	children,
	screenName = "dummy",
	buttonTitle = "nothing",
	buttonFunction = undefined,
}) => {
	const styles = useDynamicStyles((theme) => ({
		view: {
			height: Dimensions.get("window").height,
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
		},
	}));

	return (
		<View style={styles.view}>
			<H1>This is a dummy screen</H1>
			<Text>
				of the <Paragraph fontSize={20}>{screenName}</Paragraph> screen
			</Text>
			<Button theme={"red_active"} onPress={buttonFunction}>
				{buttonTitle}
			</Button>
			{children}
		</View>
	);
};

export default DummyScreen;

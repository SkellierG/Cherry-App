import React, { ReactNode } from "react";
import { Button, View, H1, Paragraph } from "tamagui";
import { GestureResponderEvent } from "react-native";

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
	return (
		<View>
			<H1>This is a dummy screen</H1>
			<Paragraph>
				of the <Paragraph fontSize={20}>{screenName}</Paragraph> screen
			</Paragraph>
			<Button onPress={buttonFunction}>{buttonTitle}</Button>
			{children}
		</View>
	);
};

export default DummyScreen;

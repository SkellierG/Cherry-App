import { config, tokens } from "@tamagui/config/v3";
import * as themes from "@assets/themes/theme-output";
import { createTamagui } from "tamagui";

const customConfig = config;

//@ts-ignore
//customConfig.themes = themes;
//customConfig.tokens = tokens;

export const tamaguiConfig = createTamagui(customConfig);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface TamaguiCustomConfig extends Conf {}
}

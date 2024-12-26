import { config, tokens } from "@tamagui/config/v3";
import * as themes from "@/theme-output";
import { createTamagui } from "tamagui";

const customConfig = config;

//@ts-ignore
customConfig.themes = themes;
customConfig.tokens = tokens;

export const tamaguiConfig = createTamagui(customConfig);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
	interface TamaguiCustomConfig extends Conf {}
}

import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	ScrollView,
	Text,
	View,
	Dimensions,
	Image,
	Alert,
	TouchableOpacity,
} from "react-native";
import { useDynamicStyles } from "@hooks/useDynamicStyles";
import {
	dark_default_theme,
	light_default_theme,
} from "@assets/themes/tamagui-rnp-adapter";
import { useLocalSearchParams } from "expo-router";
//@ts-ignore
import { MembersService } from "@api/members";
//@ts-ignore
import { Member, Role } from "@types/Auth";
import PullToRefresh from "@components/PullToRefresh";
import LoadingScreen from "@screens/LoadingScreen";
import * as Clipboard from "expo-clipboard";

const membersService = new MembersService();

const CompanyMembersScreen = () => {
	const params = useLocalSearchParams();
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);

	const styles = useDynamicStyles((theme) => ({
		container: {
			backgroundColor:
				theme === "dark"
					? dark_default_theme.colors.background
					: light_default_theme.colors.background,
			minHeight: Dimensions.get("window").height,
			padding: 16,
		},
		memberItem: {
			flexDirection: "row",
			alignItems: "center",
			paddingVertical: 12,
			borderBottomWidth: 1,
			borderBottomColor: theme === "dark" ? "#aaa" : "#888",
		},
		avatar: {
			width: 50,
			height: 50,
			borderRadius: 25,
			marginRight: 12,
		},
		memberInfo: {
			flex: 1,
		},
		memberText: {
			fontSize: 18,
			color: theme === "dark" ? "#fff" : "#000",
		},
		memberTextId: {
			fontSize: 10,
			color: theme === "dark" ? "#ddd" : "#555",
			fontFamily: "monospace",
			paddingVertical: 4,
			paddingHorizontal: 8,
			borderWidth: 1,
			borderColor: theme === "dark" ? "#555" : "#ccc",
			borderRadius: 4,
			backgroundColor: theme === "dark" ? "#333" : "#f0f0f0",
			alignSelf: "flex-start",
			marginTop: 4,
		},
		roleText: {
			fontSize: 16,
			color: theme === "dark" ? "#fff" : "#000",
			marginLeft: 16,
		},
	}));

	const fetchMembers = async () => {
		console.log("fetchMembersByCompanyId");
		try {
			if (!params) throw new Error("invalid params");
			if (!params.company_id) throw new Error("invalid company_id");
			console.log(params.company_id);
			setLoading(true);
			const data = await membersService.fetchMembersWithRolesByCompanyId(
				params.company_id,
			);
			setMembers(data);
		} catch (error) {
			console.error("Error fetching members:", error);
		} finally {
			setLoading(false);
		}
	};

	const copyClipboard = async (text: string) => {
		try {
			await Clipboard.setStringAsync(text);
			Alert.alert("Copied", "Public ID copied to clipboard");
		} catch (error) {
			console.error("Error copying to clipboard:", error);
			Alert.alert("Error", "Unable to copy Public ID");
		}
	};

	useEffect(() => {
		fetchMembers();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<SafeAreaView style={styles.container}>
			<PullToRefresh onRefreshCallback={fetchMembers}>
				<ScrollView>
					{members.map((member: Member) => (
						<View key={member.profile.id} style={styles.memberItem}>
							<Image
								source={{ uri: member.profile.avatar_url as string }}
								style={styles.avatar}
							/>
							<View style={styles.memberInfo}>
								<Text style={styles.memberText}>
									{member.profile.name} {member.profile.lastname}
								</Text>
								<TouchableOpacity
									activeOpacity={0.7}
									onPress={() =>
										copyClipboard(member.profile.public_id as string)
									}
								>
									<Text style={styles.memberTextId}>
										{member.profile.public_id}
									</Text>
								</TouchableOpacity>
								<Text style={styles.memberText}>Role(s):</Text>
								{member.roles.map((role: Role) => (
									<Text key={role.id.toString()} style={styles.roleText}>
										{role.name}
									</Text>
								))}
							</View>
						</View>
					))}
				</ScrollView>
			</PullToRefresh>
		</SafeAreaView>
	);
};

export default CompanyMembersScreen;

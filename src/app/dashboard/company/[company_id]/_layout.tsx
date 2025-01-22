import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Drawer } from "expo-router/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
//@ts-ignore
import { BaseCompany, Company, Role } from "@types/Auth";
import DeviceStorage from "@utils/deviceStorage";
import WelcomeDrawer from "@components/WelcomeDrawer";
import CustomDrawerHeader from "@components/CustomDrawerHeader";
import LoadingScreen from "last-old-src/screens/Loading";
import CustomDrawerBody from "@components/CustomDrawerBody";

export default function TabsLayout() {
	const [companies, setCompanies] = useState<(Company | null)[]>([]);
	const [notNullCompanies, setNotNullCompanies] = useState<BaseCompany[]>([]);
	const [selectedCompany, setSelectedCompany] = useState<BaseCompany | null>(
		null,
	);
	const [companiesChats, setCompaniesChats] = useState<
		Record<string, { name: string; title: string; icon: string }[]>
	>({});

	useEffect(() => {
		const loadCompanies = () => {
			const companiesData: { companies: Company[]; roles: Role[] } = JSON.parse(
				DeviceStorage.getItem("companies", "string") as string | "null",
			);

			// const companiesData = {
			// 	companies: [
			// 		null,
			// 		{
			// 			id: "abc123",
			// 			name: "AgroHarvest Co.",
			// 			slogan: "Cosechando calidad para el futuro.",
			// 			avatar_url: "https://placehold.co/100x100/png",
			// 		},
			// 		{
			// 			id: "xyz123",
			// 			name: "FruitCollect Ltd.",
			// 			slogan: "Frutas frescas directo del campo.",
			// 			avatar_url: "https://placehold.co/100x100/png",
			// 		},
			// 		{
			// 			id: "abc321",
			// 			name: "GreenFields Agri.",
			// 			slogan: "Cultivando soluciones sostenibles.",
			// 			avatar_url: "https://placehold.co/100x100/png",
			// 		},
			// 		{
			// 			id: "xyz321",
			// 			name: "HarvestPro Inc.",
			// 			slogan: "Innovación en cada cosecha.",
			// 			avatar_url: "https://placehold.co/100x100/png",
			// 		},
			// 	],
			// };

			const loadedCompanies: Company[] = companiesData?.companies || [null];
			setCompanies(loadedCompanies);

			const filteredNotNullCompanies = loadedCompanies.filter(
				(company): company is BaseCompany => company !== null,
			);
			setNotNullCompanies(filteredNotNullCompanies);

			if (filteredNotNullCompanies.length > 0) {
				setSelectedCompany(filteredNotNullCompanies[0]);
			}

			const chats: Record<
				string,
				{ name: string; title: string; icon: string }[]
			> = {
				abc123: [
					{ name: "previos/aaaa", title: "aaaa", icon: "chat" },
					{ name: "previos/zzzz", title: "zzzz", icon: "chat" },
				],
				xyz123: [{ name: "previos/bbbb", title: "bbbb", icon: "chat" }],
				abc321: [{ name: "previos/cccc", title: "cccc", icon: "chat" }],
				xyz321: [{ name: "previos/dddd", title: "dddd", icon: "chat" }],
			};

			filteredNotNullCompanies.forEach((company) => {
				chats[company.id as string] = [];
			});

			filteredNotNullCompanies.forEach((company) => {
				chats[company.id as string].push({
					name: "settings",
					title: "Settings",
					icon: "settings",
				});
				chats[company.id as string].unshift({
					name: "members",
					title: "Members",
					icon: "person",
				});
				chats[company.id as string].unshift({
					name: "index",
					title: "Home",
					icon: "home",
				});
			});

			setCompaniesChats(chats);
		};

		loadCompanies();
	}, []);

	const onRefresh = async (
		setRefreshing: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		try {
			// Placeholder for refresh logic
			setRefreshing(true);
			// Simulate API call or data fetching
			setTimeout(() => {
				setRefreshing(false);
			}, 1500);
		} catch (error: any) {
			Alert.alert("Error fetching companies", error.message);
			console.error(error);
		}
	};

	const companyIsJustNull =
		companies.length === 0 || (companies.length === 1 && !companies[0]);

	if (companyIsJustNull) {
		return <WelcomeDrawer onRefreshCallback={onRefresh} />;
	}

	if (!selectedCompany) {
		return <LoadingScreen />;
	}

	return (
		<Drawer
			drawerContent={(props: DrawerContentComponentProps) => (
				<View style={{ flexDirection: "column" }}>
					<CustomDrawerHeader
						{...props}
						onRefreshCallback={onRefresh}
						companies={notNullCompanies}
						selectedCompany={selectedCompany}
						onCompanyChange={setSelectedCompany}
					/>
					<CustomDrawerBody
						{...props}
						companiesChats={companiesChats}
						selectedCompany={selectedCompany}
					/>
				</View>
			)}
		></Drawer>
	);
}

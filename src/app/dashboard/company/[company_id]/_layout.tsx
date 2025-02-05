import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
//@ts-ignore
import { BaseCompany, Company, Role } from "@types/Auth";
import DeviceStorage from "@utils/deviceStorage";
import WelcomeDrawer from "@components/WelcomeDrawer";
import CustomDrawerHeader from "@components/CustomDrawerHeader";
import LoadingScreen from "@screens/LoadingScreen";
import CustomDrawerBody from "@components/CustomDrawerBody";
import { PreviosControllerSupabase } from "@modules/previos/previosController";

export default function TabsLayout() {
	const previoController = PreviosControllerSupabase;

	const [companies, setCompanies] = useState<(Company | null)[]>([]);
	const [notNullCompanies, setNotNullCompanies] = useState<BaseCompany[]>([]);
	const [selectedCompany, setSelectedCompany] = useState<BaseCompany | null>(
		null,
	);
	const [companiesChats, setCompaniesChats] = useState<
		Record<string, { name: string; title: string; icon: string }[]>
	>({});

	useEffect(() => {
		const loadCompanies = async () => {
			try {
				const companiesString = DeviceStorage.getItem(
					"companies",
					"string",
				) as string;
				if (!companiesString || companiesString === "null") {
					setCompanies([]);
					return;
				}
				const companiesData = JSON.parse(companiesString) as {
					companies: Company[];
					roles: Role[];
				};

				const loadedCompanies: (Company | null)[] =
					companiesData?.companies || [null];
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
				> = {};

				for (const company of filteredNotNullCompanies) {
					let fetchedChats: { name: string; title: string; icon: string }[] =
						[];
					try {
						fetchedChats =
							await previoController.getCompletePreviosByCompanyIdAllWithCache(
								company.id as string,
							);
					} catch (error) {
						console.error(
							`Error fetching chats for company ${company.id}:`,
							error,
						);
					}
					fetchedChats.unshift({
						name: "members",
						title: "Members",
						icon: "person",
					});
					fetchedChats.push({
						name: "stats",
						title: "Stats",
						icon: "bar-chart",
					});
					fetchedChats.unshift({
						name: "index",
						title: "Home",
						icon: "home",
					});
					fetchedChats.push({
						name: "settings",
						title: "Settings",
						icon: "settings",
					});

					chats[company.id as string] = fetchedChats;
				}
				setCompaniesChats(chats);
			} catch (error: any) {
				Alert.alert("Error", "No se pudieron cargar las compañías.");
				console.error("Error in loadCompanies:", error);
			}
		};

		loadCompanies();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onRefresh = async (
		setRefreshing: React.Dispatch<React.SetStateAction<boolean>>,
	) => {
		try {
			setRefreshing(true);
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

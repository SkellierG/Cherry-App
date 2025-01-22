import { useState } from "react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useAuth } from "@contexts/auth";
import DeviceStorage from "@utils/deviceStorage";
//@ts-ignore
import { Company, Role } from "@types/Auth";
import { routes } from "@utils/constants";
import { CompanySupabase } from "@modules/companies/companyController";
import { User } from "@supabase/supabase-js";

export function useCreateCompany() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const { authDispatch } = useAuth();

	const handleCreateCompany = async (
		name: string,
		slogan: string,
		description: string,
		email: string,
		phone: string,
		avatar_url: string | null = "https://placehold.co/200x200/png",
	) => {
		setIsLoading(true);
		try {
			const userData: User | null = JSON.parse(
				(DeviceStorage.getItem("user", "string") as string) || "null",
			);
			const companiesData: { companies: Company[]; roles: Role[] } | null =
				JSON.parse(
					(DeviceStorage.getItem("companies", "string") as string) || "null",
				);

			console.info(
				companiesData,
				companiesData?.roles,
				JSON.stringify(userData, null, 2),
				userData?.id,
			);

			if (!(companiesData && companiesData.roles && userData && userData?.id))
				throw new Error("comapanies or roles or user not exists in cache");

			const newCompany: Company = {
				name,
				slogan,
				description,
				email,
				phone,
				avatar_url,
			};

			const { company, roles, joined_company } =
				await CompanySupabase.createCompanyForUserWithCache(
					userData?.id,
					newCompany,
				);

			if (!(company && roles && joined_company))
				throw new Error("recently created company not founded");

			authDispatch({
				type: "ADD_JOINED_COMPANY",
				payload: joined_company,
			});

			roles.forEach((role) =>
				authDispatch({
					type: "UPDATE_ROLE",
					payload: role,
				}),
			);

			router.dismiss();
			router.replace(routes.dashboard.index);
		} catch (error: any) {
			Alert.alert("Company Error", error.message);
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, handleCreateCompany };
}

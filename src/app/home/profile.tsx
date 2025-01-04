import React, { useState } from "react";
import ProfileScreen from "@screens/dashboardProfile";
import PullToRefresh from "@components/PullToRefresh";
import { supabase } from "@utils/supabase";
import { useUser } from "@contexts/user";
import DeviceStorage from "@utils/deviceStorage";

export default function Profile() {
	const { userState, userDispatch } = useUser();
	const [name, setName] = useState("");
	const [lastname, setLastname] = useState("");
	const [email, setEmail] = useState("");
	const [imageSource, setImageSource] = useState<{ uri: string } | undefined>(
		undefined,
	);

	const fetchProfileData = async () => {
		try {
			const user = userState.user;
			if (!user) {
				console.warn("User not found in context.");
				return;
			}

			const { data: profile, error } = await supabase
				.from("profiles")
				.select("name, lastname, avatar_url")
				.eq("id", user.id)
				.single();

			if (error) {
				console.error("Error fetching profile:", error);
				return;
			}

			setName(profile?.name || "");
			setLastname(profile?.lastname || "");
			setEmail(user.email || "");
			setImageSource(
				profile?.avatar_url ? { uri: profile.avatar_url } : undefined,
			);

			const finalProfile = {
				name: profile?.name,
				lastname: profile?.lastname,
				avatar_url: profile?.avatar_url || userState.profile?.avatar_url,
				is_profiled: userState.profile?.is_profiled ?? true,
				is_oauth: userState.profile?.is_oauth,
				id: userState.user?.id ?? null,
			};

			userDispatch({
				type: "PROFILE",
				payload: finalProfile,
			});

			await DeviceStorage.setItem("profileData", JSON.stringify(finalProfile));
		} catch (err) {
			console.error("Unexpected error fetching profile:", err);
		}
	};

	return (
		<PullToRefresh
			onRefreshCallback={async () => {
				await fetchProfileData();
			}}
		>
			<ProfileScreen
				name={name}
				lastname={lastname}
				email={email}
				imageSource={imageSource}
			/>
		</PullToRefresh>
	);
}

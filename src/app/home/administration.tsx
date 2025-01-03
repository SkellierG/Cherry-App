import PullToRefresh from "@components/PullToRefresh";
import DummyScreen from "@screens/dummy";
import React from "react";

export default function Administration() {
	return (
		<PullToRefresh>
			<DummyScreen screenName="Administration" />
		</PullToRefresh>
	);
}

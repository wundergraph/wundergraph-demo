import { Client, User } from "./client";
import React, { createContext, FunctionComponent, useMemo, useEffect, useState } from "react";

export interface Config {
	client: Client;
	user: User;
	initialized: boolean;
	onWindowFocus: Date;
	onWindowBlur: Date;
}

export const WunderGraphContext = createContext<Config | undefined>(undefined);

export interface Props {
	endpoint?: string;
}

export const WunderGraphProvider: FunctionComponent<Props> = ({ endpoint, children }) => {
	const [user, setUser] = useState<User | undefined>();
	const [onWindowBlur, setOnWindowBlur] = useState(new Date());
	const [onWindowFocus, setOnWindowFocus] = useState(new Date());
	const [initialized, setInitialized] = useState(false);
	const client = useMemo<Client>(() => {
		return new Client(endpoint);
	}, [endpoint]);
	useEffect(() => {
		client.setUserListener(setUser);
		(async () => {
			await client.fetchUser();
			setInitialized(true);
		})();
		const onFocus = async () => {
			await client.fetchUser();
			setOnWindowFocus(new Date());
			setInitialized(true);
		};
		const onBlur = () => {
			setInitialized(false);
			setOnWindowBlur(new Date());
		};
		window.addEventListener("focus", onFocus);
		window.addEventListener("blur", onBlur);
		return () => {
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
		};
	}, [client]);
	return (
		<WunderGraphContext.Provider
			value={{
				user,
				client,
				initialized,
				onWindowBlur,
				onWindowFocus,
			}}
		>
			{children}
		</WunderGraphContext.Provider>
	);
};

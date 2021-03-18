import { Client, User } from "./client";
import React, { createContext, FunctionComponent, useMemo, useEffect, useState } from "react";

export interface Config {
	client: Client;
	user: User;
	initialized: boolean;
}

export const WunderGraphContext = createContext<Config | undefined>(undefined);

export interface Props {
	endpoint?: string;
}

export const WunderGraphProvider: FunctionComponent<Props> = ({ endpoint, children }) => {
	const [user, setUser] = useState<User | undefined>();
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
			setInitialized(true);
		};
		const onBlur = () => {
			setInitialized(false);
		};
		window.addEventListener("focus", onFocus);
		window.addEventListener("blur", onBlur());
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
			}}
		>
			{children}
		</WunderGraphContext.Provider>
	);
};

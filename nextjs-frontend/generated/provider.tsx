import { Client, User, UserListener } from "./client";
import React, { createContext, FunctionComponent, useMemo, useEffect, useState, Dispatch, SetStateAction } from "react";

export interface Config {
	client: Client;
	user?: User;
	initialized: boolean;
	initializing: boolean;
	onWindowFocus: Date;
	onWindowBlur: Date;
	refetchMountedQueries: Date;
	setRefetchMountedQueries: Dispatch<SetStateAction<Date>>;
	queryCache: {
		[key: string]: Object;
	};
}

export const WunderGraphContext = createContext<Config | undefined>(undefined);

export interface Props {
	endpoint?: string;
}

export const WunderGraphProvider: FunctionComponent<Props> = ({ endpoint, children }) => {
	const [user, setUser] = useState<User | undefined>();
	const [onWindowBlur, setOnWindowBlur] = useState(new Date());
	const [onWindowFocus, setOnWindowFocus] = useState(new Date());
	const [refetchMountedQueries, setRefetchMountedQueries] = useState(new Date());
	const [initialized, setInitialized] = useState(false);
	const [initializing, setInitializing] = useState(false);
	const queryCache: { [key: string]: Object } = {};
	const client = useMemo<Client>(() => {
		const client = new Client({ baseURL: endpoint });
		client.setLogoutCallback(() => {
			Object.keys(queryCache).forEach((key) => {
				delete queryCache[key];
			});
		});
		return client;
	}, [endpoint]);
	const userListener = useMemo<UserListener>(() => {
		return (userOrNull) => {
			if (userOrNull === null) {
				setUser(undefined);
			} else {
				setUser(userOrNull);
			}
		};
	}, []);
	useEffect(() => {
		client.setUserListener(userListener);
		(async () => {
			await client.fetchUser();
			setInitialized(true);
		})();
		const onFocus = async () => {
			setInitializing(true);
			await client.fetchUser();
			setOnWindowFocus(new Date());
			setInitialized(true);
			setInitializing(false);
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
				initializing,
				onWindowBlur,
				onWindowFocus,
				refetchMountedQueries,
				setRefetchMountedQueries,
				queryCache,
			}}
		>
			{children}
		</WunderGraphContext.Provider>
	);
};

import { Client } from "./client";
import React, { createContext, FunctionComponent, useMemo } from "react";

export interface Config {
	client: Client;
}

export const WunderGraphContext = createContext<Config | undefined>(undefined);

export interface Props {
	endpoint?: string;
}

export const WunderGraphProvider: FunctionComponent<Props> = ({ endpoint, children }) => {
	const client = useMemo<Client>(() => new Client(endpoint), [endpoint]);
	const config: Config = useMemo((): Config => {
		return {
			client: client,
		};
	}, [client]);
	return <WunderGraphContext.Provider value={config}>{children}</WunderGraphContext.Provider>;
};

export interface EnvironmentConfig {
	id: string;
	name: string;
}

export class Environment {
	private readonly id: string;
	private readonly name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}

	environmentConfig(): EnvironmentConfig {
		return {
			id: this.id,
			name: this.name,
		};
	}
}

export class Api {
	private readonly id: string;
	private readonly name: string;

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
	}

	apiConfig(): { id: string; name: string } {
		return { id: this.id, name: this.name };
	}
}

const namespaces = {
	jens: {
		environments: {
			"jens.wundergraph.dev": new Environment("3abb347a-44db-4ac3-897a-781a53cea634", "jens.wundergraph.dev"),
		},
		apis: {
			countries: new Api("18d15a90-c8ab-428f-9c8a-000c402620e5", "countries"),
		},
	},
};

export default namespaces;

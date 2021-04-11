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
	wundergraph: {
		environments: {
			"wundergraph.wundergraph.dev": new Environment(
				"8b288c17-3887-40f9-82bc-a33b2dfe3d6f",
				"wundergraph.wundergraph.dev"
			),
			"staging-wundergraph.wundergraph.dev": new Environment(
				"d1993dc6-71ef-4036-bc0f-690990bf69ab",
				"staging-wundergraph.wundergraph.dev"
			),
		},
		apis: {
			api: new Api("b85f183c-b36d-4ff6-b3ac-645b36cba043", "api"),
			starter: new Api("b56476c6-3d42-42b8-9578-408d7517cb5c", "starter"),
		},
	},
};

export default namespaces;

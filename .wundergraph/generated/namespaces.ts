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

const namespaces = {};

export default namespaces;

// Code generated by wunderctl. DO NOT EDIT.

export interface LinkDefinition {
	targetType: string;
	targetFieldName: string;
	sourceField: string;
	argumentSources: LinkFieldArgumentSourceDefinition[];
}

export interface LinkFieldArgumentSourceDefinition {
	name: string;
	type: "objectField" | "fieldArgument";
	path: string[];
}

class LinkBuilder<T, R extends {} = {}, TT = {}> {
	// @ts-ignore
	constructor(current: R = {}, sourceField: string, targetType: string, targetField: string) {
		this.current = current;
		this.sourceField = sourceField;
		this.targetType = targetType;
		this.targetField = targetField;
	}

	private readonly sourceField: string;
	private readonly targetType: string;
	private readonly targetField: string;

	// @ts-ignore
	private current: R = {};

	argument<P extends Exclude<keyof T, keyof R>, V extends T[P], S extends "fieldArgument" | "objectField">(
		key: P,
		source: S,
		value: S extends "fieldArgument" ? string : TT,
		...extraPath: string[]
	) {
		const extra: {} = { [key]: { source, path: [value, ...extraPath] } };

		const instance = {
			...(this.current as object),
			...extra,
		} as R & Pick<T, P>;

		return new LinkBuilder<T, R & Pick<T, P>, TT>(instance, this.sourceField, this.targetType, this.targetField);
	}

	build = (): LinkDefinition => {
		const args = this.current as { [key: string]: { path: string[]; source: "fieldArgument" | "objectField" } };
		return {
			argumentSources: Object.keys(args).map((key) => ({
				name: key,
				type: args[key].source,
				path: args[key].path,
			})),
			targetType: this.targetType,
			sourceField: this.sourceField,
			targetFieldName: this.targetField,
		};
	};
}

export const sourceStep = <T extends {}, R extends {}>() => ({
	source: <F extends keyof T>(field: F) => {
		return targetStep<T, F, R>(field);
	},
});

const targetStep = <T, F extends keyof T, R>(field: F) => ({
	target: <r extends keyof R>(targetType: r, targetField: string) => {
		return new LinkBuilder<T[F], {}, R[r]>({}, field as string, targetType as string, targetField);
	},
});

interface TargetTypes {
	federated_User: "id" | "name" | "username" | "reviews" | "_join";
	federated_Review: "id" | "body" | "author" | "product" | "_join";
	federated_Product: "upc" | "reviews" | "name" | "price" | "weight" | "inStock" | "shippingEstimate" | "_join";
	countries_Country:
		| "code"
		| "name"
		| "native"
		| "phone"
		| "continent"
		| "capital"
		| "currency"
		| "languages"
		| "emoji"
		| "emojiU"
		| "states"
		| "_join";
	countries_Continent: "code" | "name" | "countries" | "_join";
	countries_Language: "code" | "name" | "native" | "rtl" | "_join";
	countries_State: "code" | "name" | "country" | "_join";
	jsp_Post: "id" | "userId" | "title" | "body" | "_join";
	jsp_Comment: "id" | "name" | "email" | "body" | "postId" | "_join";
	jsp_User: "id" | "name" | "username" | "email" | "address" | "phone" | "website" | "company" | "_join";
	jsp_Address: "street" | "suite" | "city" | "zipcode" | "geo" | "_join";
	jsp_Geo: "lat" | "lng" | "_join";
	jsp_Company: "name" | "catchPhrase" | "bs" | "_join";
	weather_City: "id" | "name" | "country" | "coord" | "weather" | "_join";
	weather_Coordinates: "lon" | "lat" | "_join";
	weather_Summary: "title" | "description" | "icon" | "_join";
	weather_Temperature: "actual" | "feelsLike" | "min" | "max" | "_join";
	weather_Wind: "speed" | "deg" | "_join";
	weather_Clouds: "all" | "visibility" | "humidity" | "_join";
	weather_Weather: "summary" | "temperature" | "wind" | "clouds" | "timestamp" | "_join";
}

interface SourceFields {
	federated_me: {};
	federated_topProducts: {
		first: null;
	};
	countries_countries: {
		filter: null;
	};
	countries_country: {
		code: null;
	};
	countries_continents: {
		filter: null;
	};
	countries_continent: {
		code: null;
	};
	countries_languages: {
		filter: null;
	};
	countries_language: {
		code: null;
	};
	jsp_posts: {};
	jsp_postComments: {
		postID: null;
	};
	jsp_users: {};
	jsp_userPosts: {
		userID: null;
	};
	weather_getCityByName: {
		name: null;
		country: null;
		config: null;
	};
	weather_getCityById: {
		id: null;
		config: null;
	};
}

const linkBuilder = sourceStep<SourceFields, TargetTypes>();
export default linkBuilder;

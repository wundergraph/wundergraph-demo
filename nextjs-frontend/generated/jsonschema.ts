import { JSONSchema7 } from "json-schema";

interface Schema {
	Countries: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	FakeProducts: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	OasUsers: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	PriceUpdates: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	SetPrice: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	TopProducts: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
	Users: {
		input: JSONSchema7;
		response: JSONSchema7;
	};
}

const jsonSchema: Schema = {
	Countries: {
		input: { type: "object", properties: {}, additionalProperties: false },
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						countries: {
							type: "array",
							items: {
								type: "object",
								properties: { code: { type: "string" }, name: { type: "string" } },
								additionalProperties: false,
								required: ["code", "name"],
							},
						},
					},
					additionalProperties: false,
					required: ["countries"],
				},
			},
			additionalProperties: false,
		},
	},
	FakeProducts: {
		input: {
			type: "object",
			properties: { first: { type: "integer" } },
			additionalProperties: false,
			required: ["first"],
		},
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						topProducts: {
							type: "array",
							items: {
								type: "object",
								properties: { upc: { type: "string" }, name: { type: "string" }, price: { type: "integer" } },
								additionalProperties: false,
								required: ["upc"],
							},
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
	},
	OasUsers: {
		input: { type: "object", properties: {}, additionalProperties: false },
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						getUsers: {
							type: "array",
							items: {
								type: "object",
								properties: { country_code: { type: "string" }, id: { type: "integer" }, name: { type: "string" } },
								additionalProperties: false,
							},
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
	},
	PriceUpdates: {
		input: { type: "object", properties: {}, additionalProperties: false },
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						updatedPrice: {
							type: "object",
							properties: {
								upc: { type: "string" },
								name: { type: "string" },
								price: { type: "integer" },
								reviews: {
									type: "array",
									items: {
										type: "object",
										properties: { id: { type: "string" }, body: { type: "string" } },
										additionalProperties: false,
										required: ["id"],
									},
								},
							},
							additionalProperties: false,
							required: ["upc"],
						},
					},
					additionalProperties: false,
					required: ["updatedPrice"],
				},
			},
			additionalProperties: false,
		},
	},
	SetPrice: {
		input: {
			type: "object",
			properties: { upc: { type: "string" }, price: { type: "integer" } },
			additionalProperties: false,
			required: ["upc", "price"],
		},
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						setPrice: {
							type: "object",
							properties: {
								upc: { type: "string" },
								name: { type: "string" },
								price: { type: "integer" },
								weight: { type: "integer" },
							},
							additionalProperties: false,
							required: ["upc"],
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
	},
	TopProducts: {
		input: { type: "object", properties: {}, additionalProperties: false },
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						topProducts: {
							type: "array",
							items: {
								type: "object",
								properties: { upc: { type: "string" }, name: { type: "string" }, price: { type: "integer" } },
								additionalProperties: false,
								required: ["upc"],
							},
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
	},
	Users: {
		input: { type: "object", properties: {}, additionalProperties: false },
		response: {
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {
						users: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: { type: "integer" },
									name: { type: "string" },
									website: { type: "string" },
									posts: {
										type: "array",
										items: {
											type: "object",
											properties: {
												id: { type: "integer" },
												title: { type: "string" },
												comments: {
													type: "array",
													items: {
														type: "object",
														properties: { id: { type: "integer" }, name: { type: "string" }, body: { type: "string" } },
														additionalProperties: false,
													},
												},
											},
											additionalProperties: false,
										},
									},
								},
								additionalProperties: false,
							},
						},
					},
					additionalProperties: false,
				},
			},
			additionalProperties: false,
		},
	},
};
export default jsonSchema;

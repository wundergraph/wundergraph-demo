import React, { useEffect, useState } from "react";
import { Response } from "./client";
import { FakeProductsInput, FakeProductsResponse, SetPriceInput, SetPriceResponse } from "./models";
import { useQuery, useLiveQuery, useMutation } from "./hooks";
import jsonSchema from "./jsonschema";
import Form from "@rjsf/core";

export interface FormProps<T> {
	onResult?: (result: T) => void;
	liveValidate?: boolean;
}

export interface MutationFormProps<T> extends FormProps<T> {
	refetchMountedQueriesOnSuccess?: boolean;
}

export const SetPriceForm: React.FC<MutationFormProps<Response<SetPriceResponse>>> = ({
	onResult,
	refetchMountedQueriesOnSuccess,
	liveValidate,
}) => {
	const [formData, setFormData] = useState<SetPriceInput>();
	const { mutate, response } = useMutation.SetPrice({ refetchMountedQueriesOnSuccess });
	useEffect(() => {
		if (onResult) {
			onResult(response);
		}
	}, [response]);
	return (
		<div>
			<Form
				schema={jsonSchema.SetPrice.input}
				formData={formData}
				liveValidate={liveValidate}
				onChange={(e) => {
					setFormData(e.formData);
				}}
				onSubmit={async (e) => {
					await mutate({ input: e.formData, refetchMountedQueriesOnSuccess });
					setFormData(undefined);
				}}
			/>
		</div>
	);
};

export const FakeProductsForm: React.FC<FormProps<Response<FakeProductsResponse>>> = ({ onResult, liveValidate }) => {
	const [formData, setFormData] = useState<FakeProductsInput>();
	const { response, refetch } = useQuery.FakeProducts({ input: formData });
	useEffect(() => {
		if (onResult) {
			onResult(response);
		}
	}, [response]);
	return (
		<div>
			<Form
				schema={jsonSchema.FakeProducts.input}
				formData={formData}
				liveValidate={liveValidate}
				onChange={(e) => {
					setFormData(e.formData);
				}}
				onSubmit={async (e) => {
					await refetch({ input: formData });
				}}
			/>
		</div>
	);
};

export const FakeProductsLiveForm: React.FC<FormProps<Response<FakeProductsResponse>>> = ({
	onResult,
	liveValidate,
}) => {
	const [formData, setFormData] = useState<FakeProductsInput>();
	const { response } = useLiveQuery.FakeProducts({ input: formData });
	useEffect(() => {
		if (onResult) {
			onResult(response);
		}
	}, [response]);
	return (
		<div>
			<Form
				schema={jsonSchema.FakeProducts.input}
				formData={formData}
				liveValidate={liveValidate}
				onChange={(e) => {
					setFormData(e.formData);
				}}
				children={<></>}
			/>
		</div>
	);
};

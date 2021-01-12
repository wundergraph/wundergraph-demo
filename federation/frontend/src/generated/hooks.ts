import { useContext, useEffect, useMemo, useState } from "react";
import { WunderGraphContext } from "./provider";
import { RequestOptions, Response } from "./client";
import { SetPriceInput } from "./models";

export const useWunderGraph = () => {
	const ctx = useContext(WunderGraphContext);
	if (ctx === undefined) {
		throw new Error("WunderGraphContext missing, make sure to put WunderGraphProvider at the root of your app");
	}
	return {
		client: ctx.client,
	};
};

const Query = <R extends {}, I extends {}>(
	promiseFactory: (options: RequestOptions<I>) => Promise<Response<R>>,
	options?: RequestOptions<I>
) => {
	const reset = useMemo(() => JSON.stringify(options), [options]);
	const [response, setResponse] = useState<Response<R>>({ status: "loading" });
	const abortController = useMemo(() => new AbortController(), [reset]);
	useEffect(() => {
		(async () => {
			const result = await promiseFactory({
				...options,
				abortSignal: abortController.signal,
			});
			if (abortController.signal.aborted) {
				setResponse({ status: "aborted" });
				return;
			}
			setResponse(result);
		})();
		return () => {
			abortController.abort();
		};
	}, [reset, promiseFactory, abortController]);
	return {
		response,
	};
};

const Subscription = <R, I>(
	subscriptionFactory: (options: RequestOptions<I>, cb: (response: Response<R>) => void) => void,
	options?: RequestOptions<I>
) => {
	const reset = useMemo(() => JSON.stringify(options), [options]);
	const [response, setResponse] = useState<Response<R>>({ status: "loading" });
	useEffect(() => {
		const controller = new AbortController();
		subscriptionFactory(
			{
				...options,
				abortSignal: controller.signal,
			},
			(res) => {
				if (!controller.signal.aborted) setResponse(res);
			}
		);
		return () => {
			controller.abort();
		};
	}, [reset]);
	return {
		response,
	};
};

export const useQuery = {
	Me: () => {
		const { client } = useWunderGraph();
		return Query(client.query.Me);
	},
};

export const useMutation = {
	SetPrice: (input: SetPriceInput) => {
		const { client } = useWunderGraph();
		return Query(client.mutation.SetPrice, { input });
	},
};

export const useSubscription = {
	UpdatedPrices: () => {
		const { client } = useWunderGraph();
		return Subscription(client.subscription.UpdatedPrices);
	},
};

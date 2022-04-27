import {
    AuthProviders,
    useMutation,
    useQuery,
    useWunderGraph,
    withWunderGraph
} from "../../generated/wundergraph.nextjs.integration";
import {useState} from "react";
import {MutationArgsWithInput} from "@wundergraph/sdk/dist/integrations/nextjs";
import {SetPriceInput} from "../../generated/models";

const RefetchMountedOperationsOnMutationSuccess = () => {
    const {user, login, logout} = useWunderGraph();
    const [args, setArgs] = useState<MutationArgsWithInput<SetPriceInput>>({
        input: {
            upc: "1",
            price: 10,
        },
        refetchMountedOperationsOnSuccess: true,
    });
    const {mutate: setPrice, result} = useMutation.SetPrice();
    const prices = useQuery.AllPrices();
    return (
        <div>
            <h1>Refetch Mounted Operations On Mutation Success</h1>
            <p>
                This page contains a query as well as a mutation.
                If the mutation is successful, the query will be automatically refetched to keep the UI up to date (refetchMountedOperationsOnSuccess).
                This effect is achieved by invalidating all Operations that are currently "mounted".
                It also works for Subscriptions.
            </p>
            <p>{JSON.stringify(user)}</p>
            <p>{JSON.stringify(result)}</p>
            <p>{JSON.stringify(prices)}</p>
            <input placeholder="upc" value={args.input.upc} type="text"
                   onChange={e => setArgs(prev => ({...prev, input: {...prev.input, upc: e.target.value}}))}
            />
            <input placeholder="price" value={args.input.price} type="number"
                   onChange={e => setArgs(prev => ({
                       ...prev,
                       input: {...prev.input, price: parseInt(e.target.value, 10)}
                   }))}
            />
            <button onClick={() => setPrice(args)}>SetPrice</button>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(RefetchMountedOperationsOnMutationSuccess);
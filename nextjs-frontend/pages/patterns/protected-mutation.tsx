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

const ProtectedMutation = () => {
    const {user, login, logout} = useWunderGraph();
    const [args, setArgs] = useState<MutationArgsWithInput<SetPriceInput>>({
        input: {
            upc: "1",
            price: 10,
        }
    });
    const {mutate: setPrice, result} = useMutation.ProtectedSetPrice();
    return (
        <div>
            <h1>Protected Mutation</h1>
            <p>
                This mutation requires authentication.
                If the user is not logged in, the mutation will be in the state "requires_authentication".
                Clicking "SetPrice" in this state will have no effect.
                If the user is logged in, the mutation will be in the state "none" and is ready to be triggered.
            </p>
            <p>{JSON.stringify(user)}</p>
            <p>{JSON.stringify(result)}</p>
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

export default withWunderGraph(ProtectedMutation);
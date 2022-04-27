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

const UnprotectedMutation = () => {
    const {user, login, logout} = useWunderGraph();
    const [args, setArgs] = useState<MutationArgsWithInput<SetPriceInput>>({
        input: {
            upc: "1",
            price: 10,
        }
    });
    const {mutate: setPrice, result} = useMutation.SetPrice();
    return (
        <div>
            <h1>Unprotected Mutation</h1>
            <p>
                This mutation is not protected by any authentication.
                Independent of login state, any user can execute it.
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

export default withWunderGraph(UnprotectedMutation);
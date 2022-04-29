import {
    AuthProviders,
    useSubscription,
    useWunderGraph,
    withWunderGraph
} from "../../generated/wundergraph.nextjs.integration";

const ProtectedSubscription = () => {
    const {login,logout,user} = useWunderGraph();
    const data = useSubscription.ProtectedPriceUpdates();
    return (
        <div>
            <h1>Protected Subscription</h1>
            <p>
                This subscription is similar to the universal subscription,
                except that it requires the user to be authenticated.
            </p>
            <p>{JSON.stringify(user)}</p>
            <p style={{height: "8vh"}}>{JSON.stringify(data)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(ProtectedSubscription);
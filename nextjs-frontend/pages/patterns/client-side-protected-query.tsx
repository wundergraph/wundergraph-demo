import {AuthProviders, useQuery, useWunderGraph, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const ClientSideProtectedQuery = () => {
    const {user,login,logout} = useWunderGraph();
    const data = useQuery.ProtectedWeather({
        input: {
            city: "Berlin",
        },
        disableSSR: true,
    });
    return (
        <div>
            <h1>Client-Side Protected Query</h1>
            <p>
                This page contains a query that requires authentication.
                The query is only executed on the client side.
                If rendered on the server, the query returns the state "none".
                On the client, this state will change to "loading" and then "ok", if the user is logged in.
                If the user is not logged in, the state will change from "none" to "requires_authentication".
                You'll also notice that this page will always have some flickering once data is loaded.
            </p>
            <p>{JSON.stringify(user)}</p>
            <p>{JSON.stringify(data)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(ClientSideProtectedQuery,{
    disableFetchUserOnWindowFocus: true,
});
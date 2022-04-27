import {AuthProviders, useQuery, useWunderGraph, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const ServerSideProtectedQuery = () => {
    const {user,login,logout} = useWunderGraph();
    const data = useQuery.ProtectedWeather({
        input: {
            city: "Berlin",
        }
    });
    return (
        <div>
            <h1>Server Side Protected Query</h1>
            <p>
                This page contains a query that requires authentication.
                If it's rendered on the server (refresh page), and the user is logged in,
                you'll see the weather data.
                If the user is not logged in, you'll get the state "requires_authentication".
                If you use client-side navigation, you'll also get the state "requires_authentication".
            </p>
            <p>{JSON.stringify(user)}</p>
            <p>{JSON.stringify(data)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(ServerSideProtectedQuery,{
    disableFetchUserClientSide: true,
    disableFetchUserOnWindowFocus: true,
});
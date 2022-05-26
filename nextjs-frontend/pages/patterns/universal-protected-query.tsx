import {AuthProviders, useQuery, useWunderGraph, withWunderGraph} from "../../generated/nextjs";

const UniversalProtectedQuery = () => {
    const {user,login,logout} = useWunderGraph();
    const data = useQuery.ProtectedWeather({
        input: {
            city: "Berlin",
        },
    });
    return (
        <div>
            <h1>Universal Protected Query</h1>
            <p>
                This page contains a query that requires authentication.
                It's rendered both on the server and on the client.
                If the user is logged in, the page will return immediately containing data.
                If the user is not logged in, the query will be in the state "requires_authentication".
                If you navigate to this page using client-side navigation,
                the client will change state from "none" to "loading" and then "ok".
            </p>
            <p>{JSON.stringify(user)}</p>
            <p>{JSON.stringify(data)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(UniversalProtectedQuery,{
    disableFetchUserOnWindowFocus: true,
});
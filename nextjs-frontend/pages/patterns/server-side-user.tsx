import {AuthProviders, useWunderGraph, withWunderGraph} from "../../generated/nextjs";

const ServerSideUser = () => {
    const {user,login,logout} = useWunderGraph();
    return (
        <div>
            <h1>Server Side User</h1>
            <p>
                This page fetches the user only on the server-side.
                There's no flicker when re-hydrating the page as the user is already fetched on the server-side.
                When you use client-side navigation, the user will be 'null'.
            </p>
            <p>{JSON.stringify(user)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(ServerSideUser,{
    disableFetchUserClientSide: true,
    disableFetchUserOnWindowFocus: true,
});
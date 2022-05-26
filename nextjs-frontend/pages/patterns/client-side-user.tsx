import {AuthProviders, useWunderGraph, withWunderGraph} from "../../generated/nextjs";

const ClientSideUser = () => {
    const {user,login,logout} = useWunderGraph();
    return (
        <div>
            <h1>Client Side User</h1>
            <p>
                This page fetches the user only on the client-side.
                This means, there's a short "flicker" once the user is loaded.
            </p>
            <p>{JSON.stringify(user)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(ClientSideUser,{
    disableFetchUserServerSide: true,
    disableFetchUserOnWindowFocus: true,
});
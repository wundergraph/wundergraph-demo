import {AuthProviders, useWunderGraph, withWunderGraph} from "../../generated/nextjs";

const UniversalUser = () => {
    const {user,login,logout} = useWunderGraph();
    return (
        <div>
            <h1>Universal User</h1>
            <p>
                This page fetches the user both from the server and from the client.
                This way, there's no flickering and the user is always up to date,
                even if you navigate to this page from another page.
            </p>
            <p>{JSON.stringify(user)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(UniversalUser,{
    disableFetchUserOnWindowFocus: true,
});
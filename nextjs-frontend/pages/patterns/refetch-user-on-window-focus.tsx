import {AuthProviders, useWunderGraph, withWunderGraph} from "../../generated/wundergraph.nextjs.integration";

const RefetchUserOnWindowFocus = () => {
    const {user,login,logout} = useWunderGraph();
    return (
        <div>
            <h1>Refetch User on Window Focus</h1>
            <p>
                This page demonstrates how WunderGraph, by default, refetches the user on window focus.
                To show this effect, open a second tab and click "logout", them come back to this tab.
                The other "user" pages have this effect disabled.
            </p>
            <p>{JSON.stringify(user)}</p>
            <button onClick={() => login(AuthProviders.github)}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    )
}

export default withWunderGraph(RefetchUserOnWindowFocus);
import '../styles/globals.css'
import Link from "next/link";

function MyApp({Component, pageProps}) {
    return (<div>
        <div>
            <Link href="/patterns">
                <a>Patterns</a>
            </Link>
        </div>
        <Component {...pageProps} />
    </div>)
}

export default MyApp

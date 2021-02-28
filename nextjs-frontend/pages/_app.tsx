import '../styles/globals.css'
import {WunderGraphProvider} from "../generated/provider";

function MyApp({ Component, pageProps }) {
  return(<div>
    <WunderGraphProvider>
      <Component {...pageProps} />
    </WunderGraphProvider>
  </div>)
}

export default MyApp

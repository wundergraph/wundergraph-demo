import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {WunderGraphProvider} from "./generated/provider";

ReactDOM.render(
  <React.StrictMode>
      <WunderGraphProvider>
        <App />
      </WunderGraphProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

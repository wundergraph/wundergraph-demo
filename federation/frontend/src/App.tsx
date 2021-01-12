import React, {useEffect, useState} from 'react'
import './App.css'
import {useMutation, useQuery, useSubscription} from "./generated/hooks";

function App() {
  const [stream,setStream] = useState<boolean>(false);
  return (
    <div className="App">
      <h1>
        Hello WunderGraph
      </h1>
      <button onClick={() => setStream((prev)=> !prev)}>{stream ? "disable" : "enable"}</button>
      <br/>
      <br/>
      {stream && <WunderGraphStream/>}
      <MutationComp/>
      <QueryComponent/>
    </div>
  )
}

const QueryComponent = () => {
  const me = useQuery.Me();
  return (
      <div>
        {me.response.status === "ok" && JSON.stringify(me.response.body,null,"  ")}
      </div>
  )
}

const MutationComp = () => {
    const updatedPrice = useMutation.SetPrice({
      upc: "1",
      price: 100,
    })
    return (
        <div>
          {updatedPrice.response.status === "ok" && JSON.stringify(updatedPrice.response.body.data,null,"  ")}
        </div>
    )
}

const WunderGraphStream = () => {
  const updates = useSubscription.UpdatedPrices();
  return (
      <div>
        {updates.response.status === "ok" && JSON.stringify(updates.response.body.data,null,"  ")}
      </div>
  )
}

const XMLHttpRequestStream = () => {
  const [state,setState] = useState<string>("");
  useEffect(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:9991/app/PriceUpdates');
    xhr.setRequestHeader("Content-Type","application/vnd.wundergraph.com")

    let seenBytes = 0;

    xhr.onreadystatechange = function() {

      if(xhr.readyState == 3) {
        const data = xhr.response.substr(seenBytes);
        seenBytes = xhr.responseText.length;
        setState(data);
      }
    };

    xhr.addEventListener("error", function(e) {
      console.log("error: " +e);
    });

    xhr.send();
    return () => {
      xhr.abort();
      console.log("cancelling");
    }
  },[]);
  return (
      <div>
        State: {state}
      </div>
  );
}

const FetchRequestStream = () => {
  const [state,setState] = useState<string>("");
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      try {
        const response = await fetch("http://localhost:9991/app/PriceUpdates",{
          headers: {
            "Content-Type": "application/vnd.wundergraph.com",
          },
          signal: abortController.signal,
        });

        if (response.status !== 200 || response.body == null){
          return
        }

        const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        let message: string = "";

        while (true) {
          const { value, done } = await reader.read()
          if (done) break;
          if (!value) continue;
          message += value;
          if (message.endsWith("\n\n")){
            setState(message.substring("data: ".length,message.length-2));
            message = "";
          }
        }
      } catch (e) {
        console.log(`error: ${e}`);
      }
    })();

    return () => {
      console.log("cancelling");
      abortController.abort();
    }
  },[]);
  return (
      <div>
        State: {state}
      </div>
  );
}

export default App

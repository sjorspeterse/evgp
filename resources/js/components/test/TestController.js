import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import TestView from './TestView'

const TestController = (props) => {
    const [count, setCount] = useState(0);
    const [running, setRunning] = useState(0);
    const [fetching, setFetching] = useState(false)

    const loop = async () => {
        let socket = connectSocket()
        while(true) {
            console.log("loop!")
            try {
                socket.send("Hoi!")
            } catch {
                console.log("Couldn't send")
            }
            await sleep(1000);
        }
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
     }

    const connectSocket = () => {
        let connectionType = window.APP_DEBUG ? "ws" : "wss"
        let host = "://" + window.location.hostname
        let port = window.APP_DEBUG ? ":6001" : ':6002'
        let path = "/update-server/"
        let key = window.PUSHER_APP_KEY
        let url = connectionType + host + port + path + key
        let socket = new WebSocket(url);

        socket.onopen = function(e) {
            console.log("[open] Connection established");
            console.log("Sending to server");
            socket.send("My name is John");
          };
          
          socket.onmessage = function(event) {
            console.log(`[message] Data received from server: ${event.data}`);
          };
          
          socket.onclose = function(event) {
            if (event.wasClean) {
              console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
              // e.g. server process killed or network down
              // event.code is usually 1006 in this case
              console.log('[close] Connection died');
            }
          };
          
          socket.onerror = function(error) {
            console.log(`[error] ${error.message}`);
          };
          
          return socket
    }

    const initialize = () => {
        update()
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                setCount(e.carPhysics.counter)
            });
        window.Echo.channel('appState')
            .listen('AppStateUpdated', (e) => {
                setRunning(e.appState.running)
            });
        // customSocket()
        loop()
    }

    useEffect(initialize, [])

    const update = () => {
        fetch('/api/state')
            .then(response => {
                return response.json();
            })
            .then(state => {
                setRunning(state.running)
                setCount(state.counter)
            })
    }

    const onToggleRunning = () => {
        let command = ''
        if(running) {
            command = 'stop-counter'
        } else {
            command = 'start-counter'
        }
        fetch('/api/' + command)
            .then(response => {
                setFetching(false)
            })
        setFetching(true)
    }

    return <TestView 
        team={props.team} 
        onToggleRunning={onToggleRunning} 
        count={count} 
        running={running} 
        fetching={fetching}
    />
}

export default TestController;

let view =  document.getElementById('test_container')

if (view) {
    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<TestController team={data}/>, view);
}



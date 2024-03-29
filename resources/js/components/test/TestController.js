import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import TestView from './TestView'

const TestController = (props) => {
    const [running, setRunning] = useState(0);
    const [fetching, setFetching] = useState(false)
    const [localCount, setLocalCount] = useState(0)
    const [users, setUsers] = useState([])

    const loop = async () => {
        let socket = connectSocket()
        let counter = 0
        while(true) {
            counter++
            setLocalCount(counter)
            let data = {"counter": counter}
            let message = JSON.stringify(data)
            try {
                socket.send(message)
            } catch {
                console.log("Couldn't send")
            }
            await sleep(50);
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
        let user = "/" + props.team
        let url = connectionType + host + port + path + key + user
        let socket = new WebSocket(url);

        socket.onopen = function(e) {
            console.log("[open] Connection established");
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
        getInitialState()
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                console.log("Got update from server about updated cars")
                setUsers(e.carPhysics)
            });
        window.Echo.channel('appState')
            .listen('AppStateUpdated', (e) => {
                setRunning(e.appState.running)
            });
        loop()
    }

    useEffect(initialize, [])

    const getInitialState = () => {
        fetch('/api/state')
            .then(response => {
                return response.json();
            })
            .then(state => {
                setRunning(state.running)
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
        onToggleRunning={onToggleRunning} 
        running={running} 
        fetching={fetching}
        count={localCount}
        users={users}
    />
}

export default TestController;

let view =  document.getElementById('test_container')

if (view) {

    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<TestController team={data}/>, view);
}



import Echo from 'laravel-echo';
import React, { useState, useEffect} from 'react';

import ReactDOM from 'react-dom';
import '../../../css/app.css';


const TestView = (props) => {
    const [count, setCount] = useState(0);
    const [running, setRunning] = useState(0);

    let handleClick = () => {
        let command = ''
        if(running) {
            command = 'stop-counter'
        } else {
            command = 'start-counter'
        }
        fetch('/api/' + command)
    }
    
    let update = () => {
        fetch('/api/state')
            .then(response => {
                return response.json();
            })
            .then(state => {
                setRunning(state.running)
                setCount(state.counter)
            })
    }

    let customSocket = () => {
        let socket = new WebSocket("ws://127.0.0.1:6001/update-server");
        socket.onopen = function(e) {
            alert("[open] Connection established");
            alert("Sending to server");
            socket.send("My name is John");
          };
          
          socket.onmessage = function(event) {
            alert(`[message] Data received from server: ${event.data}`);
          };
          
          socket.onclose = function(event) {
            if (event.wasClean) {
              alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
              // e.g. server process killed or network down
              // event.code is usually 1006 in this case
              alert('[close] Connection died');
            }
          };
          
          socket.onerror = function(error) {
            alert(`[error] ${error.message}`);
          };
    }

    useEffect(() => { 
        update()
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                setCount(e.carPhysics.counter)
            });
        window.Echo.channel('appState')
            .listen('AppStateUpdated', (e) => {
                setRunning(e.appState.running)
            });
        customSocket()
    }, [])

    return (
        <div className="container p-2 text-white">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-3 pt-3">
                    <h1>Counter</h1>
                    <h3>{count}</h3>
                    <button className="btn btn-dark" onClick={handleClick}>
                    {running ? 'STOP' : 'START'}
                </button>
                </div>
            </div>
        </div>
    );
}

export default TestView;

let view =  document.getElementById('test_container')

if (view) {
    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<TestView team={data}/>, view);
}

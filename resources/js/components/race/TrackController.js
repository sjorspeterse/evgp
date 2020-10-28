import React, {useEffect, useState} from "react"
import Track from "./Track";

const TrackController = (props) => {
    const [count, setCount] = useState(0)
    const [users, setUsers] = useState([])

    const sleep = (ms) => {
       return new Promise(resolve => setTimeout(resolve, ms));
    } 

    const loop = async () => {
        let c = 0
        let socket = connectSocket()
        while(true) {
            c++
            setCount(c)
            let data = {"counter": c}
            let message = JSON.stringify(data)
            try {
                socket.send(message)
            } catch {
                console.log("Couldn't send")
            }
            await sleep(50);
        }
    }

    const connectSocket = () => {
        let connectionType = window.APP_DEBUG ? "ws" : "wss"
        let host = "://" + window.location.hostname
        let port = window.APP_DEBUG ? ":6001" : ':6002'
        let path = "/update-server/"
        let key = window.PUSHER_APP_KEY
        console.log("User = ", props.user)
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
        window.Echo.channel('carPhysics')
            .listen('CarsUpdated', (e) => {
                setUsers(e.carPhysics)
            });
        loop()
    }


    useEffect(initialize, [])

    return (
        <div id="trackContainer"
            style={{
                "height": "100%",
                "margin": "auto",
            }}
        >
            <Track 
                count={count}
                users={users}
            /> 
        </div> 
    )
    
} 

export default TrackController
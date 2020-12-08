import React, {useState, useEffect} from "react"
import Flags from "./Flags"

const FlagController = (props) => {
    const flags = props.flags
    const green = flags.green; const yellow = flags.yellow; const red = flags.red
    const blue = flags.blue; const white = flags.white; const black = flags.black
    const setFlags = props.setFlags

    const topColor = green ? "green" : yellow ? "yellow" : "red"
    const centerColor = blue ? "blue" : white ? "white" : "gone"
    const bottomColor = black ? "black" : "gone"

    const clickedTopFlag = () => {
        if (green) setFlags(old => ({...old, green: false, yellow: true}))
        else setFlags(old => ({...old, yellow: false, green: true}))
        // else if (yellow) setFlags(old => ({...old, yellow: false, red: true}))
        // else setFlags(old => ({...old, red: false, green: true}))
    }

    const clickedCenterFlag = () => {
        if (blue) setFlags(old => ({...old, blue: false, white: true}))
        else if (white) setFlags(old => ({...old, white: false}))
        else setFlags(old => ({...old, blue: true}))
    }

    const clickedBottomFlag = () => {
        if (black) setFlags(old => ({...old, black: false}))
        else setFlags(old => ({...old, black: true}))
    }

    const handleAdmin = (admin) => {
        if(admin.topflag) {
            setFlags(old => ({...old, 
                green: admin.topflag === "Green", 
                yellow: admin.topflag === "Yellow",
                red: admin.topflag === "Red"
            }))
        }
        if(admin.centerflag) {
            setFlags(old => ({...old,
                blue: admin.centerflag === "Blue",
                white: admin.centerflag === "White"
            }))
        }
    }

    const initialize = () => {
        window.Echo.channel('adminState')
            .listen('AdminUpdated', (e) => {
                handleAdmin(e.adminState)
            })
    }
    useEffect(initialize, [])

    return <Flags 
        topFlag={topColor} centerFlag={centerColor} bottomFlag={bottomColor} 
        clickedTopFlag={clickedTopFlag} clickedCenterFlag={clickedCenterFlag} clickedBottomFlag={clickedBottomFlag}
    />
}

export default FlagController
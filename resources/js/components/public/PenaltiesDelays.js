import React, {useState, useEffect} from "react"

const listenForUpdates = (setLastPenalty) => {
    window.Echo.channel('penalty')
        .listen('PenaltyEvent', (e) => {
            let penalty = e.penalty
            penalty.car_nr = e.car_nr
            setLastPenalty(penalty)
        });
}

const newPenalty = (penalty, penaltyData, setPenaltyData) => {
    let carNr = penalty.car_nr;
    let penalty_string = penalty.penalty_value + ' ' + penalty.penalty_type ;
    let reason = penalty.reason
    let id = penaltyData.length

    let newList = [...penaltyData, {"Car": carNr, "Penalty": penalty_string, "Reason": reason, "id": id}] 
    setPenaltyData(newList)
}

const delaysData = [
    {"Car": "107", "Delay": "10 SEC", "Reason": "Loose connector", "id": 1},
    {"Car": "633", "Delay": "5 SEC/LP", "Reason": "Wheel spokes loose", "id": 2},
    {"Car": "107", "Delay": "20 SEC", "Reason": "Battery low/car stop", "id": 3},
]

let formattedDelays = [];
delaysData.forEach((delay) => {
    formattedDelays.push(
        <div key={delay.id} style={{"lineHeight": "1em"}}>
            <div className="mt-2">
                <span style={{"color":"gray", "fontSize": "0.8em", "marginRight": "0.5em"}}>
                    <strong>CAR {delay.Car}: </strong>
                </span>
                <span style={{"color":"white", "fontSize": "0.8em"}}>
                    <strong>{delay.Delay}</strong>
                </span>
            </div>
            <span style={{"color":"yellow", "fontSize": "0.7em"}}>
                <strong> {delay.Reason}</strong>
            </span>
        </div>
    )
})



const updatePenalties = (penaltyData, setFormattedPenalties) => {
    let shortPenaltyList = penaltyData.slice(-4).reverse();
    let list = [];
    shortPenaltyList.forEach((penalty) => {
        list.push(
            <div key={penalty.id} style={{"lineHeight": "1em"}}>
                <div className="mt-2">
                    <span style={{"color":"gray", "fontSize": "0.8em", "marginRight": "0.5em"}}>
                        <strong>{(penalty.Car) ? "CAR: " + penalty.Car : ""} </strong>
                    </span>
                    <span style={{"color":"white", "fontSize": "0.8em"}}>
                        <strong>{penalty.Penalty}</strong>
                    </span>
                </div>
                <span style={{"color":"yellow", "fontSize": "0.7em"}}>
                    <strong> {penalty.Reason}</strong>
                </span>
            </div>
        )
    })

    setFormattedPenalties(list)
}

const PenaltiesDelays = () => {
    let [penaltyData, setPenaltyData] = useState([{"id":-4}, {"id":-3}, {"id":-2}, {"id":-1}]);
    let [lastPenalty, setLastPenalty] = useState();
    let [formattedPenalties, setFormattedPenalties] = useState();

    useEffect(() => listenForUpdates(setLastPenalty), [])
    useEffect(() => updatePenalties(penaltyData, setFormattedPenalties), [penaltyData])
    useEffect(() => {if(lastPenalty) newPenalty(lastPenalty, penaltyData, setPenaltyData)} , [lastPenalty])

    return (
        <div className="border border-light mr-1 p-1">
            <h5 className="text-danger"><strong>PENALTIES</strong></h5> 
            {formattedPenalties}
            <h5 className="text-danger mt-2"><strong>DELAYS</strong></h5> 
            {formattedDelays}
        </div>
    )
}

export default PenaltiesDelays
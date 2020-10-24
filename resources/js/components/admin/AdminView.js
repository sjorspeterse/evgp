import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import '../../../css/app.css';

const AdminView = (props) => {
    let [car, setCar] = useState("1001")
    let [reason, setReason] = useState("")
    let [penaltyValue, setSetPenaltyValue] = useState(5)
    let [penaltyType, setPenaltyType] = useState("SEC")

    const handleSubmit = (event) => {
        let data =  {
            "car_nr": car, 
            "reason": reason, 
            "penalty_value": penaltyValue, 
            "penalty_type": penaltyType
       } 

        fetch('/api/penalty', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"} })
            // .then(response => response.json()) 
            // .then(json => console.log(json));

        event.preventDefault();
    }

    const carSelect = (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="inputGroupSelect01">Car</label>
            </div>
            <select className="custom-select" 
                    value={car} 
                    onChange={(event) => setCar(event.target.value)} 
                    id="inputGroupSelect01">
                <option value="1001">1001</option>
                <option value="1002">1002</option>
                <option value="1003">1003</option>
            </select>
        </div> 
    )

    const reasonForm = (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon3">Reason</span>
            </div>
            <input type="text" className="form-control" id="basic-url" value={reason} onChange={(event) => setReason(event.target.value)} aria-describedby="basic-addon3"/>
        </div>
    )

    const penaltyForm = (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text" id="">Penalty</span>
            </div>
            <input type="number" value={penaltyValue} onChange={(event) => setSetPenaltyValue(event.target.value)} className="form-control"/>

            <select className="custom-select" 
                    value={penaltyType} 
                    onChange={(event) => setPenaltyType(event.target.value)} 
                    id="inputGroupSelect01">
                <option value="SEC">Seconds</option>
                <option value="LAP">Lap(s)</option>
            </select>
        </div>
    )

    const form = (
      <form onSubmit={handleSubmit}>
        {carSelect}
        {reasonForm}
        {penaltyForm}
        <input className="btn btn-primary mb-2 mt-3"type="submit" value="Submit" />
      </form>
        )
  
    
    return (
        <div className="container p-2 text-light">
            <div className="row no-gutters justify-content-center mb-2">
                <div className="col-md-4">
                    <h1>Penalize</h1>
                    {form}
                </div>
            </div>
        </div>
    );
}

export default AdminView;

let view =  document.getElementById('admin_container')

if (view) {
    let json_data = view.getAttribute('data')
    let data = JSON.parse(json_data)
    ReactDOM.render(<AdminView/>, view);
}

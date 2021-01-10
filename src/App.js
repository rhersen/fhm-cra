import {useEffect, useState} from "react";
import './App.css';
import {Table} from "./Table.js";

const SevenDayPerMillion = ({json}) => {
  let dates = Object.keys(json.Totalt_antal_fall);
  let headers = Object.keys(json);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) => dates.map((date) => json[header][date]))}
      f={(a, pop) => (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6}
    />
  );
}

const FourteenDayPer1e5 = ({json}) => {
  let dates = Object.keys(json.Totalt_antal_fall);
  let headers = Object.keys(json);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) => dates.map((date) => json[header][date]))}
      f={(a, pop) => (a.reduce((a, b) => a + b, 0) / pop) * 1e5}
    />
  );
}

const WeeklyChange = ({json}) => {
  let dates = Object.keys(json.Totalt_antal_fall);
  let headers = Object.keys(json);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) => dates.map((date) => json[header][date]))}
      f={(a) => {
        let prev = a.slice(0, 7).reduce((a, b) => a + b, 0);
        let curr = a.slice(-7).reduce((a, b) => a + b, 0);
        return (100 * (curr - prev)) / prev;
      }}
    />
  );
}

function App() {
  const [json, setJson] = useState({Totalt_antal_fall: {}});
  const [calculation, setCalculation] = useState("7");

  useEffect(() => {
    fetch("/.netlify/functions/covid19-api").then(
      (faunaResp) => {
        if (!faunaResp.ok) {
          return faunaResp.text().then((error) => {
          });
        }

        return faunaResp.json().then(
          (json) => {
            setJson(json);
          },
          (error) => {
            console.log('error', error)
          }
        );
      }
    );
  }, []);

  return (
    <>
      <div onChange={event => {
        setCalculation(event.target.value)
      }}>
        <input type="radio" value="7" name="calculation"/> 7
        <input type="radio" value="14" name="calculation"/> 14
        <input type="radio" value="change" name="calculation"/> change
      </div>
      {calculation === "7" && <SevenDayPerMillion json={json}/>}
      {calculation === "14" && <FourteenDayPer1e5 json={json}/>}
      {calculation === "change" && <WeeklyChange json={json}/>}
    </>
  );
}

export default App;

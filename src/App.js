import {useEffect, useState} from "react";
import './App.css';
import {Table} from "./Table.js";
import population from "./population";

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

const Chart = ({json, region}) => {
  let dates = Object.keys(json.Totalt_antal_fall);
  let headers = Object.keys(json);
  let columns = headers.map((header) => dates.map((date) => json[header][date]))
  let yMax = 1000;
  let yScale = 600 / yMax;
  let yValues = Array.from({ length: yMax / 100 - 1 }).map(
    (value, i) => (i + 1) * 100
  );

  let sevenDayPerMillion = (a, pop) =>
    (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6;

  return (
    <>
      <div>{headers[region]}</div>
      <div className="chart">
        <div className="y-values">
          {yValues.map((y) => (
            <div className="y-value">{y}</div>
          ))}
        </div>
        <svg viewBox="0 0 800 600">
          {yValues.map((y) => (
            <line x1="0" y1={y * yScale} x2="800" y2={y * yScale} />
          ))}

          <polyline
            fill="none"
            stroke="#c3227d"
            points={columns[region]
              .map((cell, rowIndex) => {
                let a = columns[region].slice(rowIndex - 13, rowIndex + 1);

                let x = sevenDayPerMillion(a, population[region]) || 0;
                return (
                  (rowIndex * 800) / columns[region].length + "," + (600 - x * yScale)
                );
                }
              )
              .join(" ")}
          />
        </svg>
      </div>
    </>
  );
}

function App() {
  const [json, setJson] = useState({Totalt_antal_fall: {}});
  const [calculation, setCalculation] = useState("7");
  const [region, setRegion] = useState("0");

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
        <input type="radio" value="chart" name="calculation"/> chart
      </div>
      <input type="number" value={region} name="region" onChange={event=>{
        setRegion(event.target.value)}}/> region
      {calculation === "7" && <SevenDayPerMillion json={json}/>}
      {calculation === "14" && <FourteenDayPer1e5 json={json}/>}
      {calculation === "change" && <WeeklyChange json={json}/>}
      {calculation === "chart" && <Chart json={json} region={region}/>}
    </>
  );
}

export default App;

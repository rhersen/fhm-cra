import { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import { Table } from "./Table.js";
import population from "./population";

const SevenDayPerMillion = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a, pop) => (a.slice(-7).reduce((a, b) => a + b, 0) / 7 / pop) * 1e6}
    />
  );
};

const FourteenDayPer1e5 = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a, pop) => (a.reduce((a, b) => a + b, 0) / pop) * 1e5}
    />
  );
};

const WeeklyChange = ({ cases }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);

  return (
    <Table
      headers={headers}
      dates={dates}
      columns={headers.map((header) =>
        dates.map((date) => cases[header][date])
      )}
      f={(a) => {
        let prev = a.slice(0, 7).reduce((a, b) => a + b, 0);
        let curr = a.slice(-7).reduce((a, b) => a + b, 0);
        return (100 * (curr - prev)) / prev;
      }}
    />
  );
};

const Deaths = ({ deaths }) => {
  let filtered = Object.entries(deaths).filter(([, count]) => count > 88);
  filtered.sort(([, count1], [, count2]) => count2 - count1);
  return (
    <ol>
      {filtered.map(([day, count]) => (
        <li>
          {day}: {count}
        </li>
      ))}
    </ol>
  );
};

const Chart = ({ cases, region }) => {
  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);
  let columns = headers.map((header) =>
    dates.map((date) => cases[header][date])
  );
  let yMax = 1400;
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
            points={(columns[region] || [])
              .map((cell, rowIndex) => {
                let a = columns[region].slice(rowIndex - 13, rowIndex + 1);

                let x = sevenDayPerMillion(a, population[region]) || 0;
                return (
                  (rowIndex * 800) / columns[region].length +
                  "," +
                  (600 - x * yScale)
                );
              })
              .join(" ")}
          />
        </svg>
      </div>
    </>
  );
};

function App() {
  const [cases, setCases] = useState({ Totalt_antal_fall: {} });
  const [deaths, setDeaths] = useState({});
  const [region, setRegion] = useState("0");

  useEffect(() => {
    fetch("/.netlify/functions/covid19-api?endpoint=cases").then(
      (faunaResp) => {
        if (!faunaResp.ok) {
          return faunaResp.text().then((error) => {});
        }

        return faunaResp.json().then(
          (json) => {
            setCases(json);
          },
          (error) => {
            console.log("error", error);
          }
        );
      }
    );

    fetch("/.netlify/functions/covid19-api?endpoint=deaths").then(
      (faunaResp) => {
        if (!faunaResp.ok) {
          return faunaResp.text().then((error) => {});
        }

        return faunaResp.json().then(
          (json) => {
            setDeaths(json);
          },
          (error) => {
            console.log("error", error);
          }
        );
      }
    );
  }, []);

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/7">7-day rolling average per million people</Link>
          </li>
          <li>
            <Link to="/14">14-day case notification rate per 100000</Link>
          </li>
          <li>
            <Link to="/change">
              7-day average change compared to previous 7-day period
            </Link>
          </li>
          <li>
            <Link to="/deaths">deaths</Link>
          </li>
          <li>
            <Link to="/chart">chart of 7-day average</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route path="/7">
          <SevenDayPerMillion cases={cases} />
        </Route>
        <Route path="/14">
          <FourteenDayPer1e5 cases={cases} />
        </Route>
        <Route path="/change">
          <WeeklyChange cases={cases} />
        </Route>
        <Route path="/deaths">
          <Deaths deaths={deaths} />
        </Route>
        <Route path="/chart">
          <input
            type="number"
            value={region}
            name="region"
            onChange={(event) => {
              setRegion(event.target.value);
            }}
          />
          <Chart cases={cases} region={region} />
        </Route>
        <Route path="/">home</Route>
      </Switch>
    </Router>
  );
}

export default App;

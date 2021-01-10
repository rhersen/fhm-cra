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

function App() {
  const [json, setJson] = useState({Totalt_antal_fall: {}});

  useEffect(() => {
    fetch("/.netlify/functions/fauna").then(
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
    <div className="App">
      <header className="App-header">
        <SevenDayPerMillion json={json}/>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
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
      <li>total: {Object.values(deaths).reduce((a, b) => a + b, 0)}</li>
      {filtered.map(([day, count]) => (
        <li>
          {day}: {count}
        </li>
      ))}
    </ol>
  );
};

let sandhammaren = { y: 55.387522, x: 14.185065 };
let fosby = { y: 59.2257424, x: 11.6937195 };
let treriksröset = { y: 69.0507753, x: 20.5171448 };
let haparanda = { y: 65.840444, x: 24.076838 };
let furuvik = { y: 60.6499265, x: 17.3371703 };
let grøvelsjøen = { y: 62.2634423, x: 12.3006323 };
let brömsebro = { y: 56.2992432, x: 15.9891883 };
let båstad = { y: 56.4278324, x: 12.8248392 };
let oxelösund = { y: 58.6734704, x: 17.0545007 };
let billdal = { y: 57.5735092, x: 11.9138001 };
let rörbäcksnäs = { y: 61.12886, x: 12.8050636 };
let stekenjokk = { y: 65.0698147, x: 14.2659379 };
let vindelkroken = { y: 66.2666664, x: 15.5412453 };
let jävre = { y: 65.1528011, x: 21.4794835 };
let salusand = { y: 63.4700831, x: 19.2520158 };
let njurundabommen = { y: 62.2680333, x: 17.3652393 };
let järsjö = { y: 60.1427778, x: 18.5163299 };
let nynäshamn = { y: 58.9123653, x: 17.9108162 };
let flatvarp = { y: 57.985413, x: 16.7949144 };
let hoburg = { y: 56.9289992, x: 18.1299352 };
let visby = { y: 57.6271917, x: 18.2735696 };
let sudersand = { y: 57.9493628, x: 19.1184951 };
let hoting = { y: 64.1137273, x: 16.1950004 };
let ytterhogdal = { y: 62.1748893, x: 14.9323852 };
let sölvesborg = { y: 56.0497402, x: 14.5768039 };
let rumpeboda = { y: 56.4516997, x: 14.4223001 };
let markaryd = { y: 56.4589499, x: 13.5825608 };
let eringsboda = { y: 56.4385185, x: 15.3574556 };
let arnö = { y: 59.4988811, x: 17.1783612 };
let avesta = { y: 60.1405361, x: 16.1639807 };
let noppikoski = { y: 61.4932749, x: 14.8351696 };
let vingåker = { y: 59.0503859, x: 15.8397022 };
let skinnskatteberg = { y: 59.825645, x: 15.6763624 };
let fredriksberg = { y: 60.1409872, x: 14.3645216 };
let finnerödja = { y: 58.924554, x: 14.4314438 };
let visingsö = { y: 58.0457454, x: 14.329842 };
let katthult = { y: 57.6888032, x: 15.5562243 };
let åseda = { y: 57.167505, x: 15.3351557 };
let skeppshult = { y: 57.1274509, x: 13.3616952 };
let falsterbo = { y: 55.3960591, x: 12.8232552 };
let torhamn = { y: 56.0946438, x: 15.8236561 };
let sandhamn = { y: 59.2878805, x: 18.9020756 };

const Uppsala = [furuvik, avesta, arnö, järsjö];
const Skåne = [
  sandhammaren,
  falsterbo,
  båstad,
  markaryd,
  rumpeboda,
  sölvesborg,
];
const Blekinge = [rumpeboda, eringsboda, brömsebro, torhamn, sölvesborg];
const Norrbotten = [vindelkroken, treriksröset, haparanda, jävre];
const Västerbotten = [stekenjokk, vindelkroken, jävre, salusand, hoting];
const Västernorrland = [hoting, salusand, njurundabommen, ytterhogdal];
const Gotland = [hoburg, visby, sudersand];
const Stockholm = [järsjö, sandhamn, nynäshamn, arnö];
const Jämtland_Härjedalen = [
  grøvelsjøen,
  stekenjokk,
  hoting,
  ytterhogdal,
  noppikoski,
];
const Gävleborg = [noppikoski, ytterhogdal, njurundabommen, furuvik, avesta];
const Sörmland = [arnö, nynäshamn, oxelösund, vingåker];
const Västmanland = [avesta, arnö, vingåker, skinnskatteberg];
const Dalarna = [
  rörbäcksnäs,
  grøvelsjøen,
  noppikoski,
  avesta,
  skinnskatteberg,
  fredriksberg,
];
const Värmland = [fosby, rörbäcksnäs, fredriksberg, finnerödja];
const Örebro = [finnerödja, fredriksberg, skinnskatteberg, vingåker];
const Västra_Götaland = [billdal, fosby, finnerödja, visingsö, skeppshult];
const Östergötland = [
  visingsö,
  finnerödja,
  vingåker,
  oxelösund,
  flatvarp,
  katthult,
];
const Kalmar = [katthult, flatvarp, brömsebro, eringsboda, åseda];
const Kronoberg = [åseda, eringsboda, rumpeboda, markaryd, skeppshult];
const Halland = [båstad, billdal, skeppshult, markaryd];
const Jönköping = [skeppshult, visingsö, katthult, åseda];

const Map = ({ cases }) => {
  let f = (a, pop) => (a.reduce((a, b) => a + b, 0) / pop) * 1e5;

  let dates = Object.keys(cases.Totalt_antal_fall);
  let headers = Object.keys(cases);
  let columns = headers.map((header) =>
    dates.map((date) => cases[header][date])
  );
  let value = {};

  function color(x) {
    if (x > 960) return "#870202";
    if (x > 480) return "#b61c00";
    if (x > 240) return "#d23f00";
    if (x > 120) return "#da6500";
    if (x > 60) return "#e79402";
    if (x > 20) return "#f1b73c";
    else return "#f5d664";
  }

  columns.forEach((column, colIndex) => {
    let a = column.slice(column.length - 14, column.length);
    let x = f(a, population[colIndex]);
    value[headers[colIndex]] = x;
    return <span className={color(x)}>{Math.round(x)}</span>;
  });

  return (
    <>
      <svg viewBox="10 0 15 15" height="640" width="640">
        <polygon points={Skåne.map(xy)} fill={color(value.Skåne)} />
        <polygon points={Blekinge.map(xy)} fill={color(value.Blekinge)} />
        <polygon points={Uppsala.map(xy)} fill={color(value.Uppsala)} />
        <polygon points={Norrbotten.map(xy)} fill={color(value.Norrbotten)} />
        <polygon
          points={Västerbotten.map(xy)}
          fill={color(value.Västerbotten)}
        />
        <polygon
          points={Västernorrland.map(xy)}
          fill={color(value.Västernorrland)}
        />
        <polygon points={Gotland.map(xy)} fill={color(value.Gotland)} />
        <polygon points={Stockholm.map(xy)} fill={color(value.Stockholm)} />
        <polygon
          points={Jämtland_Härjedalen.map(xy)}
          fill={color(value.Jämtland_Härjedalen)}
        />
        <polygon points={Gävleborg.map(xy)} fill={color(value.Gävleborg)} />
        <polygon points={Sörmland.map(xy)} fill={color(value.Sörmland)} />
        <polygon points={Västmanland.map(xy)} fill={color(value.Västmanland)} />
        <polygon points={Dalarna.map(xy)} fill={color(value.Dalarna)} />
        <polygon points={Värmland.map(xy)} fill={color(value.Värmland)} />
        <polygon points={Örebro.map(xy)} fill={color(value.Örebro)} />
        <polygon
          points={Västra_Götaland.map(xy)}
          fill={color(value.Västra_Götaland)}
        />
        <polygon
          points={Östergötland.map(xy)}
          fill={color(value.Östergötland)}
        />
        <polygon points={Kalmar.map(xy)} fill={color(value.Kalmar)} />
        <polygon points={Kronoberg.map(xy)} fill={color(value.Kronoberg)} />
        <polygon points={Halland.map(xy)} fill={color(value.Halland)} />
        <polygon points={Jönköping.map(xy)} fill={color(value.Jönköping)} />
      </svg>
    </>
  );
};

function xy(coord) {
  return [coord.x, 70 - coord.y];
}

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
            <Link to="/map">map</Link>
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
        <Route path="/map">
          <Map cases={cases} />
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

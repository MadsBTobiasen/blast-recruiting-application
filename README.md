## BLAST Recruiting Application
This repository is to present solutions to the coding challenge as provided during the hiring process of Blast.
The repository solves the challenges outlined in the [Chewedup Challenge](https://chewedup.blast.tv/).

## Applications Overview
As the challenge has mulitple steps to complete, the repository contains 2 projects with 3 applications, as seen in the below overview

| Application | Path | Type | Framework / Library | Notes |
|--|--|--|--|--|
| `paperbits-assignment` | `blast-recruiting-application/paperbits-assignment` | Script | N/A | TypeScript source file, executed with `ts-node` to decipher the Caeser Cipher. Theoretically should be suitable for any decrypting. |
| `server-log-parser` | `blast-recruiting-applicationblast-server-log-visualizer/src/server` | Backend Server | ExpressJs | A small express server, where a database can be provisioned using the provided server log files. The server will group, sort and store the events accordingly, and make them available through endpoints to a frontend. |
| `server-log-visualizer` | `blast-recruiting-applicationblast-server-log-visualizer` | SPA | Vuejs | A Vuejs application to consume the endpoints exposed by the parser server, capable of rendering the collected events, and displaying appropriate data. |

---

## Getting started
As with any Node based project, for each of the projects the appropriate npm-scripts must be executed.

### Paperbits:
```sh
# Navigate to the directory.
> cd .\paperbits-assignment\
# Install required dependencies.
> npm i
# Run application.
> npm run dev
```

### Parser & Visualizer
```sh
# Navigate to the directory.
> cd .\blast-server-log-visualizer\
# Install required dependencies.
> npm i
# Run the server.
> npm run express
# Start the Vue-application using Vite.
> npm run dev
```

---

## Parser & Visualizer Features
### Parser Features
The parser is built to be able to parse server logs, and perform analysis on each line to determine what kind of event occured. These can then be grouped into server -or player-related events. Once grouped, additional analysis can be performed, to investigate what kind of server -or player-event occured, such as a kill, death or similar.

The parser currently only investigates which players are active, and whenever a player gets a kill or is killed. Theoretically, through extensions to the `handlers/player-event-handler` & `handlers/server-event-handler`, the parser should be able to manage any of the server lines. Although additional event-types will probably be required to provide them with a group.

The parser exposes a few endpoints as found below:
| Name | Method | Uri | Description | RequestBody | ResponseBody |
|--|--|--|--|--|--|
| `ProvisionDatabase` | `POST` | `http://localhost:3000/api/provision` | Provision the database, by fetching the server logs provided in the request body. The provided uri in the request body, is the server log uri provided by the assignment. | `{ "url": "https://blast-recruiting.s3.eu-central-1.amazonaws.com/NAVIvsVitaGF-Nuke.txt" }` | `{ "message": string }` |
| `GetAllPlayers` | `GET` | `http://localhost:3000/api/players` | Fetches all the players identified in the server logs. | N/A | `{ "s1mple", "b1t", ... }` |
| `GetAllRounds` | `GET` | `http://localhost:3000/api/rounds` | Fetches all the played rounds identified in the server logs. | N/A | `[    { "roundNumber": 1, "startTime": "2021-11-28T19:41:11.000Z", "roundScore": { "ct": 1, "t": 0 }, "endTime": "2021-11-28T19:43:11.000Z" }, ...]` |
| `GetScoreboard` | `GET` | `http://localhost:3000/api/round/{round-num}/scoreboard` | Fetches the scoreboard for the specified round, also returns the complete scoreboard up to and including the request round. | N/A | `{ "round": [{ "name": "s1mple", "kills": 0, "deaths": 1 }, ...], "match": [{ "name": "s1mple", "kills": 8, "deaths": 9 }, ...] }` |

Although database is mentioned, the express server simply uses locally stored json-files for it's data store.

Besides this overview, the repository also includes a Postman collection found here: [blast-server-log-visualizer/parser.postman_collection](https://github.com/MadsBTobiasen/blast-recruiting-application/blob/main/blast-server-log-visualizer/parser.postman_collection).

*NOTE: Prior to consuming any of the endpoints, please ensure to use the `ProvisionDatabase`-first, as this'll fetch the server log and parse it.*

### Visualizer Features
The visualizer is built to consume the endpoints described in the above section. When the application is opened a table of players will be presented, to scroll through the history of the match, the navigation section to the top left of the table, can be used to go to any desired round.

Below is a complete list of statistics considered, as well as their point of implementation.

| Stat | Status | Notes |
|--|--|--|
| Round Average Length | Backend Prepared | Although not fully implemented, the backend was prepared for this, by providing the round start and round end timestamps. |
| Kills per player | Fully implemented | Total kills can be seen at each round step, including the last. |
| Scoreboard over time | Fully implemented | The history of the scoreboard can be browsed by using the navigation section top left of the table. |  
| Team Scores | Fully Implemented | Per round, the Team score can also be seen |
| Heatmap of Player kills / deaths | Backend Prepared | Although initially a feature I wanted to implement, I ran out of time. In the database, I ensured to also save the location of the player events, such that I create a primitive heatmap using these coordinates, overlayed on the ingame map. |
| K/D Ratio | Fully Implemented | Although a very minor feature, I decided to include a K/D ratio into the table as well |

---

## Important Considerations
Although the position is for a role which includes active development with React and **NOT** Vuejs, I decided to proceed with a tool I know, so I could create a full-stack solution within a reasonable timeframe. 
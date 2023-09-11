import Heatmap from "../DataVisualization/Heatmap";
import TrackrTeamBoardCard from "./TrackrTeamBoardCard";
// import { useWebSocketData } from "../WebSocketDataDiv/websockethook.js"; // Import the custom hook
import { useEffect, useState } from "react";

const actionList = new Set(["destroyed", "killed", "multikilled","selfrevived", "captured", "player-killed-player", "player-multikilled-player", "player-teamkilled-player", "player-selfkilled-player", "player-selfrevived-player", "player-killed-roshan", "player-captured-outpost", "player-destroyed-tower", "player-destroyed-barracksMelee", "player-destroyed-barracksRange", "player-destroyed-ancient" ]);

export default function TrackrTeamBoard(props) {
  const [team1, team2] = props.teams;
  const [player1, player2, player3, player4, player5] = team1.players;
  const [player6, player7, player8, player9, player10] = team2.players;
  const [incomingEvent, setIncomingEvent] = useState(null);
  const eventTypes = ["death", "goal", "assist"];

  // const data = useWebSocketData(); // Use the custom hook to fetch WebSocket data

  // console.log("----------------------------------", data);
  //   useEffect(() => {
  //   const interval = setInterval(() => {
  //     // Simulate receiving a new event
  //     const newEvent = {
  //       x: Math.floor(Math.random() * 15801) - 7900, // Generates values between -7900 and 7900
  //       y: Math.floor(Math.random() * 15801) - 7900, // Generates values between -7900 and 7900
  //       eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)]
  //     };
  //     setIncomingEvent(newEvent);
  //     console.log(newEvent);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);
  const websocketData = props.websocketData; 

  useEffect(() => {
    // console.log(websocketData, "WEBSOCKET DATA");
    if (websocketData) {
      // console.log(websocketData.events, "WEBSOCKET DATA EVENTS");
      for(const event of websocketData.events) {
        if (actionList.has(event.type)) {
          console.log(event, "EVENT");
          // console.log(event.action, "EVENT ACTION");
          // console.log(event.target, "EVENT TARGET")
          // console.log(event.target.state, "EVENT TARGET STATE");
          // console.log(event.target.state.game, "EVENT TARGET STATE GAME");
          // console.log(event.target.state.game.position, "EVENT TARGET STATE GAME POSITION");
          // console.log(event.target.state.position, "EVENT TARGET");
          let pos; 
 
          if (event.type === "player-killed-player"){
            pos = event.target.state.game.position;
          }else
           if (event.type === "player-multikilled-player"){
            pos = event.target.state.game.position;
          }else if (event.type === "player-teamkilled-player"){
            pos = event.target.state.game.position;
          }else if (event.type === "player-selfkilled-player"){
            pos = event.target.state.game.position;
          }else if (event.type === "player-selfrevived-player"){
            pos = event.target.state.game.position;
          }else if (event.type === "player-killed-roshan"){
            pos = event.target.state.position;
          }else if (event.type === "player-captured-outpost"){
            pos = event.target.state.position;
          }else if (event.type === "player-destroyed-tower"){
            pos = event.target.state.position;
          }else if (event.type === "player-destroyed-barracksMelee"){
            pos = event.target.state.position;
          }else if (event.type === "player-destroyed-barracksRange"){
            pos = event.target.state.position;
          }else if (event.type === "player-destroyed-ancient"){
            pos = event.target.state.position;
          }
      
          // console.log(pos, "POS");
          const newEvent = {
            x: pos.x,
            y: pos.y,
            eventType: event.type
          };
          setIncomingEvent(newEvent);
          console.log(newEvent, "NEW EVENT NEW EVENT NEW EVENT");
        }
      }
    }
  }, [websocketData]);


  // console.log(websocketData, '---------------------------------------');

  return (
    <div className="h-full w-full flex flex-row border-red-700 justify-evenly xs:text-sm lg:text-lg xl:text-xl relative">
      <div className="flex flex-col xs:text-[.5rem] lg:text-[1rem] xl:text-[1rem] w-2/8 h-full justify-evenly">
        <div className="text-center font-bold text-[#37ff44]">Radiant</div>
        <TrackrTeamBoardCard player={player1} background={true} />
        <TrackrTeamBoardCard player={player2} background={false} />
        <TrackrTeamBoardCard player={player3} background={true} />
        <TrackrTeamBoardCard player={player4} background={false} />
        <TrackrTeamBoardCard player={player5} background={true} />
      </div>
      <div className="h-full border-yellow-200 w-[25%] flex justify-evenly items-center gap-1">
        <div className="flex flex-col gap-1 text-center h-full outline-red-900 w-full justify-between">
          <p className="teamname1 text-[#37ff44] py-2 text-[2rem] ">
            {" "}
            {team1.name}{" "}
          </p>
          <p className="text-[3rem] items-center h-full py-2 flex justify-center text-[#98ff88]">
            {team1.kills}
          </p>
          <p className="text-[1.5rem] mb-2 text-slate-400 py-2">{`${team1.kills}/${team1.deaths}/${team1.assists}`}</p>
        </div>
        <div className="w-[200] h-full">
          <Heatmap incomingEvent={incomingEvent} />
        </div>
        {/* <img
          className="h-full w-[h-full]"
          src="https://private-user-images.githubusercontent.com/91306408/266902749-81d2faa9-f0cb-4a5d-b095-fd3b6fda51ae.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTEiLCJleHAiOjE2OTQ0NTkxODQsIm5iZiI6MTY5NDQ1ODg4NCwicGF0aCI6Ii85MTMwNjQwOC8yNjY5MDI3NDktODFkMmZhYTktZjBjYi00YTVkLWIwOTUtZmQzYjZmZGE1MWFlLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFJV05KWUFYNENTVkVINTNBJTJGMjAyMzA5MTElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjMwOTExVDE5MDEyNFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTdiZWFhMzY3NWU2OWQ0ZjI5ZjZkNTkxZDQ2MmVkYTQzYTRlODdlNDAxY2VjNDQzNDhiZGNlNDAxYzNkMmNkNDkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.XksyyDYhCZZDSJGCTD0pf7XVpWDWUSg7kQjdDiJHRRE"
        ></img> */}
        <div className="flex flex-col gap-1 text-center h-full outline-red-900 w-full justify-between">
          <p className="teamname2 text-[#ff6666] py-2 text-[2rem]">
            {" "}
            {team2.name}{" "}
          </p>
          <p className="text-[3rem] items-center h-full py-2 flex justify-center text-[#ba3232]">
            {team2.kills}
          </p>
          <p className="text-[1.5rem] mb-2 text-slate-400 py-2">{`${team2.kills}/${team2.deaths}/${team2.assists}`}</p>
        </div>
      </div>
      <div className="flex flex-col  xs:text-[.5rem] lg:text-[1rem] xl:text-[1rem] w-2/8 h-full justify-evenly">
        <div className="text-center font-bold text-[#ff6666]  ">Dire</div>
        <TrackrTeamBoardCard player={player6} background={true} />
        <TrackrTeamBoardCard player={player7} background={false} />
        <TrackrTeamBoardCard player={player8} background={true} />
        <TrackrTeamBoardCard player={player9} background={false} />
        <TrackrTeamBoardCard player={player10} background={true} />
      </div>
      <button
        className="absolute top-1 right-2 border p-1 rounded-lg px-1.5 text-xs text-cyan-400 border-cyan-300 hover:text-red-300 hover:border-red-300"
        onClick={props.exit}
      >
        x
      </button>
    </div>
  );
}

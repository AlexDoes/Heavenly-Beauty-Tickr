import React, { useEffect, useState } from "react";
import WebSocketComponent from "../WebSocketDataDiv/websocketcomponent";
import WebSocketDataDiv from "../WebSocketDataDiv/websocketdatadiv";
import TrackrTeamBoard from "./TrackrTeamBoard";
import { messageHandlers, stateNormalizer } from "../Resources/normalization";

function parseWebSocketData(data) {
  try {
    // console.log("Received WebSocket data:", data);
    // console.log("Received WebSocket data:", data); // Debugging line

    if (
      !data ||
      !data.events ||
      !Array.isArray(data.events) ||
      data.events.length === 0 ||
      !data.occurredAt
    ) {
      return { message: "Default message for missing or invalid data" };
    }

    const formattedTimestamp = formatTimestamp(data.occurredAt);
    const firstEvent = data.events[0];

    // console.log("First event:", firstEvent);
    // console.log("First event:", firstEvent); // Debugging line

    if (!firstEvent || !firstEvent.type) {
      return null;
    }

    // if (firstEvent && !firstEvent.type) {
    //   console.log("first event", firstEvent);
    // }

    const eventType = firstEvent.type;

    // console.log("Event type:", eventType);
    // console.log("Event type:", eventType); // Debugging line

    if (messageHandlers[eventType] !== undefined) {
      const formattedData = messageHandlers[eventType].message(
        firstEvent,
        formattedTimestamp
      );
      // console.log(
      //   formattedData,
      //   "formattedData-----------------------------------------------------"
      // );

      // const formattedData = stateNormalizer(firstEvent);
      // console.log(formattedData);
      return formattedData;
    }

    return null;
  } catch (error) {
    console.error("An error occurred while parsing WebSocket data:", error);
    return null;
  }
}

function formatTimestamp(timestamp) {
  if (!timestamp) return ""; // Handle cases where timestamp is not available
  const date = new Date(timestamp);
  const hours = normalizeTime(date.getHours());
  const minutes = normalizeTime(date.getMinutes());
  const seconds = normalizeTime(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

function normalizeTime(number) {
  return number < 10 ? "0" + number : number;
}

export default function TrackrMain(props) {
  const [websocketData, setWebSocketData] = useState(null);
  const [showWebSocket, setShowWebSocket] = useState(true);
  const [matchId, setMatchId] = useState(null);
  const updateWebSocketData = (data) => {
    setWebSocketData(data);
  };

  const toggleWebSocketVisibility = () => {
    setShowWebSocket((prevState) => !prevState);
  };

  useEffect(() => {
    function handleHide() {
      setShowWebSocket(false);
    }

    window.addEventListener("hideWebSocketComponent", handleHide);
    return () =>
      window.removeEventListener("hideWebSocketComponent", handleHide);
  }, []);

  const teams = [
    {
      kills: 52,
      deaths: 12,
      assists: 43,
      name: "team1",
      players: [
        {
          name: "Player 1",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 2",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 3",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 4",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 5",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
      ],
    },
    {
      kills: 52,
      deaths: 12,
      assists: 43,
      name: "team2",
      players: [
        {
          name: "Player 6",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 7",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 8",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 9",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
        {
          name: "Player 10",
          money: "255",
          kills: "10",
          deaths: "5",
          assists: "2",
          items: [1, 2, 3, 4, 5],
        },
      ],
    },
  ];

  return (
    <div className="h-full w-full flex flex-col overflow-visible relative border-cyan-700 px-4">
      {showWebSocket && (
        <WebSocketComponent onDataReceived={updateWebSocketData} />
      )}
      <div className="w-full h-full border-red-900">
        <TrackrTeamBoard
          exit={props.handleExit}
          teams={teams}
          websocketData={websocketData}
        />
      </div>
      <div className="w-full border-b border-cyan-200 -bottom-[5vh] absolute h-[5vh] -mx-4 bg-gradient-to-l from-slate-800 via-slate-900 to-slate-800 text-[#e6dfdf]">
        <WebSocketDataDiv
          matchId={props.eventId}
          websocketData={parseWebSocketData(websocketData)}
        />
      </div>
      <button
        className="absolute top-1 right-2 border-2 p-1 rounded-lg px-2 text-xs text-cyan-400 border-cyan-300 hover:text-red-300 hover:border-red-300"
        onClick={() => props.closeFunction()}
      >
        x
      </button>
    </div>
  );
}

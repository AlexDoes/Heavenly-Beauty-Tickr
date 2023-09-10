import React, { useState, useEffect } from "react";

class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

const FILTEREDEVENTTYPES = [
  "grid-started-feed",
  "grid-sampled-feed",
  "grid-sampled-tournament",
  "grid-sampled-series",
  "grid-invalidated-series",
  "grid-validated-series",
  "grid-ended-feed",
  "player-acquired-item",
  "player-equipped-item",
  "player-unequipped-item",
  "player-stashed-item",
  "player-unstashed-item",
  "player-lost-item",
  "game-set-clock",
  "game-started-clock",
  "game-stopped-clock",
  "game-set-respawnClock",
  "game-started-respawnClock",
  "game-stopped-respawnClock",
  "series-paused-game",
  "series-resumed-game",
];

const SUPPORTEDEVENTTYPES = [
  "grid-started-feed",
  "grid-sampled-feed",
  "grid-sampled-tournament",
  "grid-sampled-series",
  "grid-invalidated-series",
  "grid-validated-series",
  "grid-ended-feed",
  "player-left-series",
  "player-rejoined-series",
  "tournament-started-series",
  "team-picked-character",
  "team-banned-character",
  "series-started-game",
  "player-acquired-item",
  "player-equipped-item",
  "player-unequipped-item",
  "player-stashed-item",
  "player-unstashed-item",
  "player-lost-item",
  "player-killed-player",
  "player-multikilled-player",
  "player-teamkilled-player",
  "player-selfkilled-player",
  "team-killed-player",
  "game-killed-player",
  "game-respawned-player",
  "game-respawned-roshan",
  "player-selfrevived-player",
  "player-killed-roshan",
  "team-killed-roshan",
  "player-completed-increaseLevel",
  "player-completed-slayRoshan",
  "team-completed-slayRoshan",
  "player-completed-destroyTower",
  "team-completed-destroyTower",
  "player-completed-destroyBarracksMelee",
  "team-completed-destroyBarracksMelee",
  "player-completed-destroyBarracksRange",
  "player-completed-destroyAncient",
  "team-completed-destroyBarracksRange",
  "team-completed-destroyAncient",
  "player-captured-outpost",
  "team-captured-outpost",
  "player-destroyed-tower",
  "player-destroyed-barracksMelee",
  "player-destroyed-barracksRange",
  "player-destroyed-ancient",
  "team-destroyed-tower",
  "team-destroyed-barracksMelee",
  "team-destroyed-barracksRange",
  "team-destroyed-ancient",
  "team-won-game",
  "series-ended-game",
  "team-won-series",
  "tournament-ended-series",
  "game-set-clock",
  "game-started-clock",
  "game-stopped-clock",
  "game-set-respawnClock",
  "game-started-respawnClock",
  "game-stopped-respawnClock",
  "series-paused-game",
  "series-resumed-game",
];

function WebSocketDataDiv() {
  const [data, setData] = useState(null);
  const messageQueue = new Queue();
  const [timestamp, setTimestamp] = useState([]);
  const [events, setEvents] = useState({});

  useEffect(() => {
    // Check if chrome and chrome.runtime are defined
    if (typeof chrome !== "undefined" && chrome.runtime) {
      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "updateWebSocketData") {
          const messageTimestamp = new Date(message.data.occurredAt);
          const hours = normalizeTime(messageTimestamp.getHours());
          const minutes = normalizeTime(messageTimestamp.getMinutes());
          const seconds = normalizeTime(messageTimestamp.getSeconds());
          const formattedTimestamp = `${hours}:${minutes}:${seconds}`;

          const eventHandlers = {
            "tournament-started-series": {
              message: (event, formattedTimestamp) => {
                const [team1, team2] = event.actor.state.teams;
                const format = event.actor.state.format;
                return {
                  [formattedTimestamp]: `${team1} and ${team2} started a ${format} series`,
                };
              },
            },
            "team-picked-character": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} picked ${target}` };
              },
            },
            "team-banned-character": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} banned ${target}` };
              },
            },
            "series-started-game": {
              message: (event, formattedTimestamp) => {
                const [team1, team2] = event.actor.state.teams;
                const format = event.actor.state.format;
                return {
                  [formattedTimestamp]: `${team1.name} and ${team2.name} started a game in thier ${format} series`,
                };
              },
            },
            "player-acquired-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} acquired ${target}` };
              },
            },
            "player-equipped-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} equipped ${target}` };
              },
            },
            "player-unequipped-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} unequipped ${target}`,
                };
              },
            },
            "player-stashed-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} stashed ${target}` };
              },
            },
            "player-unstashed-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} unstashed ${target}` };
              },
            },
            "player-lost-item": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return { [formattedTimestamp]: `${actor} lost ${target}` };
              },
            },
            "player-killed-player": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.state.game.name;
                return { [formattedTimestamp]: `${actor} killed ${target}` };
              },
            },
            "player-multikilled-player": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                return { [formattedTimestamp]: `${actor} got a multikill!` };
              },
            },
            "player-teamkilled-player": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                return { [formattedTimestamp]: `${actor} got a team kill!` };
              },
            },
            "player-selfkilled-player": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                return { [formattedTimestamp]: `${actor} killed themself` };
              },
            },
            "game-respawned-player": {
              message: (event, formattedTimestamp) => {
                const target = event.target.state.game.name;
                return { [formattedTimestamp]: `${target} respawned` };
              },
            },
            "game-respawned-roshan": {
              message: (event, formattedTimestamp) => {
                return { [formattedTimestamp]: `Roshan respawned` };
              },
            },
            "player-selfrevived-player": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                return { [formattedTimestamp]: `${actor} self-revived` };
              },
            },
            "player-killed-roshan": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                return { [formattedTimestamp]: `${actor} killed Roshan` };
              },
            },
            "player-captured-outpost": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                const side = event.target.state.side;
                return {
                  [formattedTimestamp]: `${actor} captured ${side} ${target}`,
                };
              },
            },
            "player-destroyed-tower": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "player-destroyed-barracksMelee": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "player-destroyed-barracksRange": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "player-destroyed-ancient": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "team-destroyed-tower": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "team-destroyed-barracksMelee": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "team-destroyed-barracksRange": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "team-destroyed-ancient": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const target = event.target.id;
                return {
                  [formattedTimestamp]: `${actor} destroyed ${target}`,
                };
              },
            },
            "player-completed-increaseLevel": {
              message: (event, formattedTimestamp) => {
                const actor = event.actor.state.game.name;
                const level =
                  event.actor.state.game.objectives[0].completionCount + 1;
                return {
                  [formattedTimestamp]: `${actor} leveled up to ${level}`,
                };
              },
            },
            "team-won-game": {
              message: (event, formattedTimestamp) => {
                const teams = event.target.state.teams;
                let winningTeam;
                let losingTeam;
                if (teams[0].won) {
                  winningTeam = teams[0];
                  losingTeam = teams[1];
                } else {
                  winningTeam = teams[1];
                  losingTeam = teams[0];
                }
                return {
                  [formattedTimestamp]: `${winningTeam.name} won in thier game against ${losingTeam.name}`,
                };
              },
            },
            // Add other event types and their handlers here...
            default: {
              message: (event, formattedTimestamp) => {
                console.log({ [formattedTimestamp]: event.type });
                return { [formattedTimestamp]: event.type };
              },
            },
          };

          const messageEvents = message.data.events.map((event) => {
            // if (event.type === "team-won-series") {
            //   console.log(event);
            // }

            const handler =
              eventHandlers[event.type] || eventHandlers["default"];

            // if (event.type === "player-destroyed-ancient") {
            //   console.log(handler.message(event, formattedTimestamp));
            // }
            // console.log(handler.message(event, formattedTimestamp));
            return handler.message(event, formattedTimestamp);
          });

          // messageEvents.forEach((singleEvent) => {
          if (!FILTEREDEVENTTYPES.includes(message.data.events[0].type)) {
            messageQueue.enqueue(messageEvents);
          }
          // });
        }
      });
    }

    const intervalId = setInterval(() => {
      if (!messageQueue.isEmpty()) {
        setData(messageQueue.dequeue());
      }
    }, getAverageTimeGap(timestamp) / 3);

    return () => clearInterval(intervalId);
  }, []);

  const normalizeTime = (number) => {
    return number < 10 ? "0" + number : number;
  };

  const getAverageTimeGap = (timestamps) => {
    if (timestamps.length <= 1) return 1000;

    let totalGap = 0;
    for (let i = 1; i < timestamps.length; i++) {
      totalGap +=
        new Date(timestamps[i]).getTime() -
        new Date(timestamps[i - 1]).getTime();
    }
    return totalGap / (timestamps.length - 1);
  };

  const divStyle = {
    overflowY: "auto",
    overflowX: "hidden", // Hide horizontal overflow
    maxHeight: "100%",
    maxWidth: "100%",
    padding: "10px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    wordBreak: "break-all",
    backgroundColor: "#388087",
    color: "#F6F6F2",
    transition: "transform .3s ease-in-out",
    transform: "translateX(0%)",
  };

  const secondDivStyle = {
    zIndex: "1000",
    position: "fixed",
    bottom: "0",
    left: "0",
    width: "50%",
    height: "50%",
    backgroundColor: "cyan",
    overflowY: "auto",
  };

  return (
    <>
      <div id="websocketDataDiv" style={divStyle}>
        {data
          ? data.map((event) => {
              return (
                <div>
                  {Object.entries(event).map(([timestamp, eventType]) => {
                    return (
                      <div>
                        {timestamp}: {eventType}
                      </div>
                    );
                  })}
                </div>
              );
            })
          : "WebSocket Data Will Appear Here"}
      </div>
    </>
  );
}

export default WebSocketDataDiv;

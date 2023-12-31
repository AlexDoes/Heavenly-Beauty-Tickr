import retrieveimage from "../Resources/imageMapObject";

export default function TrackrTeamBoardCard(props) {
  const { name, money, kills, deaths, assists, items, netWorth, character } =
    props?.player;
  console.log(props?.player, "props.player");
  const cardPosition = props.cardPosition;
  let imgUrl = "https://i.imgur.com/u6OIb8q.jpg";
  if (props.background) {
    return (
      //bg-[#665c5c]
      <div
        className={`flex h-1/6 items-center w-full ${
          props.radiant
            ? "justify-end bg-gradient-to-r from-[#f5f5f5] via-slate-600 to-[#068d45]"
            : "justify-start bg-gradient-to-r to-[#f5f5f5] via-slate-800 from-[#d12721]"
        } ${
          cardPosition === "bottom"
            ? `${props.radiant ? "rounded-bl-lg" : "rounded-br-lg"}`
            : `${
                props.radiant
                  ? `${cardPosition === "top" ? "rounded-tl-lg" : ""}`
                  : `${cardPosition === "top" ? "rounded-tr-lg" : ""}`
              }`
        } `}
      >
        <div className="grid grid-cols-7 grid-rows-1 gap-4 justify-items-center items-center h-full ">
          <img
            src={imgUrl}
            className={`w-[h] h-full ${props.radiant ? "order-last" : ""}`}
          />{" "}
          <div
            class={`text-black name col-span-2 ${
              !props.radiant ? "order-last" : ""
            }`}
          >
            {name}
          </div>
          <div class={`money ${!props.radiant ? "order-6" : ""}`}>
            {netWorth}g
          </div>
          <div class={`kills`}>{kills}(k)</div>
          <div class={`deaths`}>{deaths}(d)</div>
          <div class={`assists`}>{assists}(a)</div>
          {/* <div class={`items`}>{items}</div> */}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`flex h-1/6 gap-1 items-center w-full ${
          props.radiant
            ? "justify-end text-[#98ff88]"
            : "justify-start text-[#ff6666]"
        }`}
      >
        <div className="grid h-full grid-cols-7 grid-rows-1 gap-4 justify-items-center items-center">
          <img
            src={imgUrl}
            className={`w-[h] h-full ${props.radiant ? "order-last" : ""}`}
          />{" "}
          <div class={`name col-span-2 ${!props.radiant ? "order-last" : ""}`}>
            {name}
          </div>
          <div class={`money ${!props.radiant ? "order-6" : ""}`}>
            {netWorth}g
          </div>
          <div class={`kills`}>{kills}(k)</div>
          <div class={`deaths`}>{deaths}(d)</div>
          <div class={`assists`}>{assists}(a)</div>
          {/* <div class={`items`}>{items}</div> */}
        </div>
      </div>
    );
  }
}

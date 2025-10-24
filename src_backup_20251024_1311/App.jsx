import React from "react";
import BoardView from "./BoardView";
import ItemPage from "./ItemPage";
import "./ui.css";

function useRoute() {
  const read = () => window.location.hash.slice(1) || "/";
  const [route, setRoute] = React.useState(read);
  React.useEffect(() => {
    const onHash = () => setRoute(read());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();
  const isItem = route.startsWith("/item");

  return (
    <div className="wrap">
      <div className="hrow" style={{ justifyContent: "space-between" }}>
        <div className="hrow">
          <h1 className="h1">Post Preview</h1>
        </div>
      </div>
      {isItem ? <ItemPage /> : <BoardView />}
    </div>
  );
}


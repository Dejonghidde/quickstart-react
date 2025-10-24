import React from "react";
import monday from "./monday";

export default function BoardView() {
  const [ctx, setCtx] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);

  // context ophalen
  React.useEffect(() => {
    const off = monday.listen("context", ({ data }) => setCtx(data));
    monday.get("context").then(({ data }) => setCtx(data));
    return () => off && off();
  }, []);

  // items laden zodra boardId er is
  React.useEffect(() => {
    const boardId = ctx?.boardId || ctx?.boardIds?.[0];
    if (!boardId) return;

    setLoading(true);
    setErr(null);

    const Q = `
      query ($boardId: [ID!], $limit:Int!) {
        boards (ids: $boardId) {
          items_page (limit: $limit) {
            items { id name }
          }
        }
      }`;

    monday
      .api(Q, { variables: { boardId: String(boardId), limit: 200 } })
      .then(({ data, error }) => {
        if (error) throw error;
        const arr = data?.boards?.[0]?.items_page?.items || [];
        setItems(arr);
      })
      .catch(e => setErr(String(e)))
      .finally(() => setLoading(false));
  }, [ctx]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(it => (it.name || "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div>
      <div className="card">
        <div className="hrow" style={{ justifyContent: "space-between" }}>
          <div className="sectionTitle">Items</div>
          <input
            className="input"
            style={{ maxWidth: 320 }}
            placeholder="Zoeken…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {err && <div className="card" style={{ marginTop: 12, color: "#b00020" }}>Fout: {err}</div>}
      {loading && <div className="card" style={{ marginTop: 12 }}>Laden…</div>}

      {!loading && !err && (
        <ul className="list">
          {filtered.map(it => (
            <li
              key={it.id}
              className="listItem"
              onClick={() => (window.location.hash = `#/item?id=${it.id}`)}
            >
              <div className="itemTitle">{it.name || "(naamloos)"}</div>
              <div className="itemSub">ID {it.id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


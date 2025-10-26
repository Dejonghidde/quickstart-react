`import React from "react";
import monday from "./monday";
import "./ui.css";

/** ───────────────────────────── ItemId uit hash ───────────────────────────── */
function useItemIdFromHash() {
  const read = () =>
    new URLSearchParams((window.location.hash.split("?")[1] || "")).get("id") || "";
  const [id, setId] = React.useState(read);
  React.useEffect(() => {
    const onHash = () => setId(read());
    window.addEventListener("hashchange", onHash);
      <div className="wrap">return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return id; // altijd string ("" als niet aanwezig)
}

/** ────────────────────── GQL-queries (let op: column.title) ───────────────────── */
const ITEM_Q_ID = `
  query ($itemIds: [ID!]) {
    items(ids: $itemIds) {
      id
      name
      board { id name }
      column_values { id text column { title } value }
      assets { id name url_thumbnail url public_url }
    }
  }
`;

const ITEM_Q_INT = `
  query ($itemIds: [Int!]) {
    items(ids: $itemIds) {
      id
      name
      board { id name }
      column_values { id text column { title } value }
      assets { id name url_thumbnail url public_url }
    }
  }
`;


/** ─────────────── Extract prompts + hooks o.b.v. kolomtitels ──────────────── */
function extractPromptsAndHooks(cols = []) {
  const byTitle = (re) =>
    cols.find((c) => re.test(c?.column?.title || "")) ||
    cols.find((c) => re.test(c?.id || "")); // fallback op id

  const p1 = byTitle(/prompt\s*1/i)?.text || "";
  const p2 = byTitle(/prompt\s*2/i)?.text || "";
  const p3 = byTitle(/prompt\s*3/i)?.text || "";

  // "10 HOOKS" staat in één text kolom – splits op enters / nummers / bullets
  const hooksRaw = byTitle(/hook/i)?.text || "";
  const hooks = hooksRaw
    .split(/\r?\n|(?:^|\s)\d+\.\s+|(?:^|\s)[•\-–]\s+/g)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 10);

  return { prompts: [p1, p2, p3], hooks };
}

/** ─────── Probeer eerst [ID], val terug op [Int] bij type-mismatch ───────── */
async function fetchItemSmart(itemIdStr) {
  console.log("[ItemPage] itemIdStr =", itemIdStr, "typeof:", typeof itemIdStr);

  try {
    console.log("[GQL] Try ID schema → vars:", { itemIds: [itemIdStr] });
    const r1 = await monday.api(ITEM_Q_ID, { variables: { itemIds: [itemIdStr] } });
    if (r1?.error) throw r1.error;
    const it = r1?.data?.items?.[0] || null;
    if (it) return it;
    throw new Error("No item via ID schema");
  } catch (e) {
    const msg = String(e || "");
    console.warn("[GQL] ID schema failed:", msg);

    // Vallen we écht over naar Int?
    const idAsInt = Number.parseInt(itemIdStr, 10);
    const shouldTryInt =
      Number.isFinite(idAsInt) &&
      (/expected type \[Int!?]!?/i.test(msg) || /expecting type "\[Int!?]!?"/i.test(msg));

    if (!shouldTryInt) throw e;

    console.log("[GQL] Try INT schema → vars:", { itemIds: [idAsInt] });
    const r2 = await monday.api(ITEM_Q_INT, { variables: { itemIds: [idAsInt] } });
    if (r2?.error) throw r2.error;
    const it = r2?.data?.items?.[0] || null;
    if (!it) throw new Error("No item via INT schema");
    return it;
  }
}

/** ────────────────────────────── Component ──────────────────────────────── */
export default function ItemPage() {
  const itemIdStr = useItemIdFromHash(); // ← string uit #/item?id=...
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [item, setItem] = React.useState(null);

  // Prompts (volledig bewerkbaar in UI)
  const [prompts, setPrompts] = React.useState(["", "", ""]);
  const [activePromptIdx, setActivePromptIdx] = React.useState(0);
  const activePromptText = React.useMemo(() => (prompts?.[activePromptIdx] || "").trim(), [prompts, activePromptIdx]);

  // Hooks (klikbare pills)
  const [hooks, setHooks] = React.useState([]);
  const [activeHookIdx, setActiveHookIdx] = React.useState(null);

  // Preview-override (vrije bewerking)
  const [isDirty, setIsDirty] = React.useState(false);
  const [previewOverride, setPreviewOverride] = React.useState("");

  // Media (eerste asset)
  const [media, setMedia] = React.useState(null);
  const [mediaLabel, setMediaLabel] = React.useState("");

  // Persistente media-lijst (ingeladen uit item.assets) + welke in de preview staat
  const [mediaFiles, setMediaFiles] = React.useState([]); // [{id,name,thumbUrl,url}]
  const [mediaIdx, setMediaIdx] = React.useState(0);

// --- Media upload + preview state ---
const [uploaded, setUploaded] = React.useState([]);          // [{url, name, type, isLocal}]
const [activeMediaIdx, setActiveMediaIdx] = React.useState(0);
const activeMedia = React.useMemo(
  () => uploaded[activeMediaIdx] || null,
  [uploaded, activeMediaIdx]
);

// Vind de kolom-id van "Media" op basis van de kolomtitel (fallback: 'files')
const mediaColumnId = React.useMemo(() => {
  const hit = (item?.column_values || []).find(cv => /media/i.test(cv?.column?.title || ""));
  return hit?.id || "files";
}, [item]);

// Zorg dat we een Int itemId hebben voor de mutatie
const itemIdInt = React.useMemo(() => {
  const raw = (item && item.id) || itemIdStr || "";
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}, [item, itemIdStr]);

// ───────────────── Upload handler ─────────────────
async function handleFilesPicked(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length || !itemIdInt) return;

  for (const file of files) {
    // 1) Plaats een tijdelijke UI-kaart met een unieke sleutel
    const objectUrl = URL.createObjectURL(file);
    const tmpKey = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const isVideo = /^video\//i.test(file.type);

    // voeg placeholder toe en onthoud de index via de unieke sleutel
    setUploaded(prev => [...prev, {
      url: objectUrl,
      name: file.name,
      type: isVideo ? "video/*" : "image/*",
      isLocal: true,
      _tmpKey: tmpKey,           // ← unieke sleutel om later te vervangen
    }]);
    setActiveMediaIdx(i => Math.max(i, 0));

    try {
// 2) Upload naar Monday (file column)  ⬅️ type fix: ID! en id als string
const MUT = `
  mutation add($file: File!, $itemId: ID!, $columnId: String!) {
    add_file_to_column(file: $file, item_id: $itemId, column_id: $columnId) { id }
  }
`;

const itemIdForMutation = String(item?.id ?? itemIdStr);   // <-- forceer string
const r1 = await monday.api(MUT, {
  variables: { file, itemId: itemIdForMutation, columnId: mediaColumnId }
});
const assetId = r1?.data?.add_file_to_column?.id;
if (!assetId) throw new Error("Geen assetId terug van monday");

      // 3) Haal publieke URL op (LET OP: ID!, niet Int!)
      const Q = `
        query ($ids:[ID!]) {
          assets(ids:$ids){ id name public_url url url_thumbnail }
        }`;
      const r2 = await monday.api(Q, { variables: { ids: [String(assetId)] } });
      const a = r2?.data?.assets?.[0];
      if (!a) throw new Error("Asset details niet gevonden");

      // 4) Vervang de tijdelijke entry op basis van _tmpKey
      setUploaded(prev => {
        const ix = prev.findIndex(p => p._tmpKey === tmpKey);
        if (ix === -1) return prev;

        const next = [...prev];
        next[ix] = {
          url: a.public_url || a.url || a.url_thumbnail || next[ix].url,
          name: a.name || file.name,
          type: isVideo ? "video/*" : "image/*",
          isLocal: false,
        };
        return next;
      });
    } catch (e) {
      console.warn("Upload mislukt:", e);
      // als upload faalt: laat placeholder staan maar haal 'uploading…' weg en markeer ‘(failed)’
      setUploaded(prev => {
        const ix = prev.findIndex(p => p._tmpKey === tmpKey);
        if (ix === -1) return prev;
        const next = [...prev];
        next[ix] = { ...next[ix], isLocal: false, name: `${file.name} (failed)` };
        return next;
      });
    }
  }
}

  /** Data-load */
  React.useEffect(() => {
    let cancel = false;
    if (!itemIdStr) return;

    setLoading(true);
    setErr(null);

    (async () => {
      try {
        const it = await fetchItemSmart(itemIdStr);
        if (cancel) return;

        setItem(it);

        // prompts + hooks
        const { prompts, hooks } = extractPromptsAndHooks(it?.column_values || []);
        setPrompts(prompts);
        setHooks(hooks);
        setActiveHookIdx(hooks.length ? 0 : null);

// --- media: hydrate uploaded[] vanuit it.assets ---
const assets = Array.isArray(it?.assets) ? it.assets : [];

const inferType = (a) => {
  const n = (a?.name || "").toLowerCase();
  const u = (a?.public_url || a?.url || a?.url_thumbnail || "").toLowerCase();
  return /\.(mp4|mov|webm|ogg|m4v)$/.test(n) || /\.(mp4|mov|webm|ogg|m4v)$/.test(u)
    ? "video/*"
    : "image/*";
};

const mapped = assets.map(a => ({
  id: a.id, // <— belangrijk voor key
  url: a.public_url || a.url || a.url_thumbnail || "",
  name: a.name || "",
  type: inferType(a),
  isLocal: false,
}));

setUploaded(mapped);
setActiveMediaIdx(0);

// oude state (laat je huidige preview gewoon werken totdat we omschakelen)
if (assets[0]) {
  const a0 = assets[0];
  setMedia({
    name: a0.name,
    thumbUrl: a0.url_thumbnail || a0.url || a0.public_url,
  });
  setMediaLabel(a0.name || "");
} else {
  setMedia(null);
  setMediaLabel("");
}
      } catch (e) {
        setErr(String(e));
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [itemIdStr]);

  /** Preview-compositie (hook + prompt) */
  const selectedHook = activeHookIdx != null ? hooks[activeHookIdx] || "" : "";
  const selectedPrompt = prompts[activePromptIdx] || "";
  const composedPreview = React.useMemo(() => {
    const parts = [selectedHook, "", selectedPrompt].filter(Boolean);
    return parts.join("\n");
  }, [selectedHook, selectedPrompt]);

  const effectivePreview = isDirty ? previewOverride : composedPreview;

  /** Kleine helpers */
  const displayItemId = item?.id ?? itemIdStr ?? "—";
  const displayBoardName = item?.board?.name ?? "—";
  const displayBoardId = item?.board?.id ?? "—";

// Leeg de files-kolom op Monday (eerst officieel, zo nodig fallback)
async function clearMediaOnMonday() {
  const itemIdForMutation = String(item?.id ?? itemIdStr);
  if (!itemIdForMutation) return;

  try {
    const M1 = `
      mutation ($itemId: ID!, $columnId: String!) {
        clear_item_files(item_id: $itemId, column_id: $columnId) { id }
      }`;
    await monday.api(M1, {
      variables: { itemId: itemIdForMutation, columnId: mediaColumnId }
    });
  } catch (e) {
    console.warn("clear_item_files faalde, fallback proberen…", e);
    const M2 = `
      mutation ($itemId: ID!, $columnId: String!, $val: JSON!) {
        change_simple_column_value(item_id: $itemId, column_id: $columnId, value: $val) { id }
      }`;
    await monday.api(M2, {
      variables: { itemId: itemIdForMutation, columnId: mediaColumnId, val: "{}" }
    });
  }
}

// UI + Monday in één keer opschonen
async function handleClearAllMedia() {
  try { await clearMediaOnMonday(); } catch (e) { console.warn(e); }
  setUploaded([]);
  setActiveMediaIdx(0);
}

  /** Render */
  if (!itemIdStr) {
    return (
      <div className="wrap">
<button type="button" className="btnBack" onClick={() => window.history.back()}>
  ← Terug
</button>
        <div className="meta" style={{ marginTop: 12 }}>Geen itemId in URL.</div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="hrow" style={{ justifyContent: "space-between" }}>
        <button className="btnBack" onClick={() => (window.location.hash = "#/")}>← Terug</button>
        <div className="meta">ItemId: {displayItemId} · Board: {displayBoardName} (ID {displayBoardId})</div>
      </div>

      <h2 className="h1" style={{ marginTop: 8 }}>Item detail</h2>

      {loading && <div className="hint" style={{ marginTop: 12 }}>Laden…</div>}
      {err && <div style={{ color: "#b00020", marginTop: 12 }}>Fout: {err}</div>}

      {!loading && !err && (
        <>
          {/* ───────── Prompts (tabs + textarea) ───────── */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="cardHeader">
              <div className="sectionTitle">Prompts</div>
              <div className="tabs">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    className={`tab ${activePromptIdx === i ? "active" : ""}`}
                    onClick={() => {
                      setActivePromptIdx(i);
                      if (!isDirty) setPreviewOverride(""); // reset override als user nog niet edite
                    }}
                  >
                    Prompt {i + 1}
                  </button>
                ))}
              </div>
            </div>
<div className="cardBody">
  <div
    className="promptBox preWrap"
    aria-label={`Prompt ${activePromptIdx + 1}`}
  >
    {activePromptText
      ? activePromptText
      : <span className="muted">Geen tekst voor deze prompt.</span>}
  </div>
</div>
</div> 

{/* ───────── Hooks (verticale, aanklikbare cards) ───────── */}
<div className="card" style={{ marginTop: 16 }}>
  <div className="sectionTitle">Hooks</div>

  {hooks.length ? (
    <div className="hookList" style={{ marginTop: 8 }}>
      {hooks.map((h, i) => (
<label
  key={i}
  className={`hookRow ${activeHookIdx === i ? "active" : ""}`}
>
  <input
    type="radio"
    name="hook"
    checked={activeHookIdx === i}
    onChange={() => {
      setActiveHookIdx(i);
      if (!isDirty) setPreviewOverride("");
    }}
  />
  <span className="hookBadge">#{i + 1}</span>
  <span className="hookText">{h}</span>
</label>
      ))}
    </div>
  ) : (
    <div className="hint" style={{ marginTop: 8 }}>Geen hooks gevonden.</div>
  )}
</div>

{/* ───────── Media Attachment (tussen Hooks en Preview) ───────── */}
<div className="card" style={{ marginTop: 16 }}>
  <div className="sectionTitle">Media Attachment</div>

  <label className="dropZone">
    <input
      type="file"
      multiple
      accept="image/*,video/*"
      style={{ display: "none" }}
      onChange={(e) => handleFilesPicked(e.target.files)}
    />
    <div className="dzInner">
      <div className="dzIcon">🖼️</div>
      <div>Drop files here or click to browse</div>
      <div className="dzSub">Images and videos supported</div>
    </div>
  </label>

  {/* B: Alles verwijderen knop */}
  <div className="mediaToolbar">
    <button
      type="button"
      className="linkBtn danger"
      disabled={!uploaded.length}
      onClick={handleClearAllMedia}
      title="Verwijder alle geüploade media uit dit item"
    >
      Verwijder alle media
    </button>
  </div>
          

  {/* Bestandenlijst (alleen tonen als er items zijn) */}
  {uploaded.length > 0 && (
    <div className="mediaList">
      {uploaded.map((m, ix) => (
        <div
          key={(m.id || m.url) + ix}
          className={`mediaRow ${ix === activeMediaIdx ? "is-active" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setActiveMediaIdx(ix)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActiveMediaIdx(ix)}
        >
          <div className="mediaMeta">
            <span className="mediaType" title={m.type || ""}>
              {m.type && m.type.startsWith("video") ? "🎬" : "🖼️"}
            </span>
            <span className="mediaName" title={m.name || "(naamloos)"}>
              {m.name || "(naamloos)"}
            </span>
            {m.isLocal && <span className="badge">uploading…</span>}
          </div>

          <div className="mediaActions">
            <button
              type="button"
              className="linkBtn danger"
              onClick={(e) => {
                e.stopPropagation(); // voorkom activeren van de rij bij klikken op Verwijder
                setUploaded((prev) => {
                  const next = prev.filter((_, i) => i !== ix);
                  // corrigeer actieve index
                  if (ix === activeMediaIdx) {
                    const newIdx = Math.min(Math.max(0, ix - 1), next.length - 1);
                    setActiveMediaIdx(next.length ? newIdx : 0);
                  } else if (ix < activeMediaIdx) {
                    setActiveMediaIdx((i) => Math.max(0, i - 1));
                  }
                  return next;
                });
              }}
            >
              Verwijder
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* ───────── Preview (LinkedIn-stijl) ───────── */}
<div className="li-card" style={{ marginTop: 16 }}>
  <div className="liHeader">
    <div className="liAvatar">YN</div>
    <div className="liHeadText">
      <div className="liWho">Your Name</div>
      <div className="liSub">Just now • 🌐</div>
    </div>
  </div>

  <div className="liBody">
    {/* Eén enkel vlak, geen tweede ‘card’ eronder */}
    <div
      className="liPostText"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        setIsDirty(true);
        setPreviewOverride(e.currentTarget.innerText);
      }}
    >
      {(isDirty ? previewOverride : effectivePreview) || "Voorvertoning verschijnt hier…"}
    </div>
  </div>

{activeMedia ? (
  <div className="liMedia" style={{ position: "relative" }}>
    {activeMedia.type && activeMedia.type.startsWith("video")
      ? <video controls src={activeMedia.url} />
      : <img src={activeMedia.url} alt={activeMedia.name || "media"} />}
    {uploaded.length > 1 && (
      <div className="mediaNav">
        <button
          type="button"
          onClick={() => setActiveMediaIdx(i => (i - 1 + uploaded.length) % uploaded.length)}
          aria-label="Previous media"
        >
          ‹
        </button>
        <span>{activeMediaIdx + 1}/{uploaded.length}</span>
        <button
          type="button"
          onClick={() => setActiveMediaIdx(i => (i + 1) % uploaded.length)}
          aria-label="Next media"
        >
          ›
        </button>
      </div>
    )}
  </div>
) : (
  <div className="liMedia liMedia--empty">
    <div className="liMediaPlaceholder">
      <span className="liMediaIcon">🖼️</span>
      <span>No media attached</span>
    </div>
  </div>
)}

{/* Onderste balk zoals op LinkedIn */}
    <div className="liActions">
      <button className="liAction">👍 Like</button>   
      <button className="liAction">💬 Comment</button>
      <button className="liAction">🔗 Share</button>
      <button className="liAction">✉️ Send</button>
    </div>
  </div>
  
  </>
)}

</div>
);
}

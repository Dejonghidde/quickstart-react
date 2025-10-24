import React from "react";
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
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return id; // altijd string ("" als niet aanwezig)
}

/** ────────────────────── GQL-queries (let op: column.title) ───────────────── */
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

  // Hooks (klikbare pills)
  const [hooks, setHooks] = React.useState([]);
  const [activeHookIdx, setActiveHookIdx] = React.useState(null);

  // Preview-override (vrije bewerking)
  const [isDirty, setIsDirty] = React.useState(false);
  const [previewOverride, setPreviewOverride] = React.useState("");

  // Media (eerste asset)
  const [media, setMedia] = React.useState(null);
  const [mediaLabel, setMediaLabel] = React.useState("");

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

        // media (eerste asset)
        const a = it?.assets?.[0];
        if (a) {
          setMedia({
            name: a.name,
            thumbUrl: a.url_thumbnail || a.url || a.public_url,
          });
          setMediaLabel(a.name || "");
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

  /** Render */
  if (!itemIdStr) {
    return (
      <div className="wrap">
        <button className="btn" onClick={() => (window.location.hash = "#/")}>← Terug</button>
        <div className="meta" style={{ marginTop: 12 }}>Geen itemId in URL.</div>
      </div>
    );
  }

  return (
    <div className="wrap">
      <div className="hrow" style={{ justifyContent: "space-between" }}>
        <button className="btn" onClick={() => (window.location.hash = "#/")}>← Terug</button>
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
              <textarea
                className="textarea"
                rows={10}
                placeholder={`Schrijf of plak hier je Prompt ${activePromptIdx + 1}…`}
                value={prompts[activePromptIdx] || ""}
                onChange={(e) => {
                  const next = [...prompts];
                  next[activePromptIdx] = e.target.value;
                  setPrompts(next);
                  if (!isDirty) {
                    // laat preview meekantelen met wijzigingen (zolang user preview niet handmatig overschrijft)
                    setPreviewOverride("");
                  }
                }}
              />
              <div className="hint" style={{ marginTop: 6 }}>
                Tip: gebruik lege regels voor paragrafen; deze worden 1-op-1 in de preview getoond.
              </div>
            </div>
          </div>

          {/* ───────── Hooks (klikbare pills) ───────── */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Hooks</div>
            {hooks.length ? (
              <div className="hook-grid" style={{ marginTop: 8 }}>
                {hooks.map((h, i) => (
                  <button
                    key={i}
                    className={`pill ${activeHookIdx === i ? "pill-active" : ""}`}
                    title={h}
                    onClick={() => {
                      setActiveHookIdx(i);
                      if (!isDirty) setPreviewOverride(""); // bij wisselen hook -> terug naar auto-preview
                    }}
                  >
                    {h.length > 64 ? h.slice(0, 64) + "…" : h}
                  </button>
                ))}
              </div>
            ) : (
              <div className="hint" style={{ marginTop: 8 }}>Geen hooks gevonden.</div>
            )}
          </div>

          {/* ───────── Preview (LinkedIn-stijl) ───────── */}
          <div className="card li-card" style={{ marginTop: 16 }}>
            <div className="liHeader">
              <div className="liAvatar" />
              <div className="liMeta">
                <div className="liName">Jouw Bedrijf</div>
                <div className="liSub">· LinkedIn preview</div>
              </div>
            </div>

            <div className="liBody">
              {/* Bewerkbare preview: als je hierin typt, gaat isDirty aan en gebruiken we override */}
              <textarea
                className="textarea preWrap"
                rows={10}
                value={isDirty ? previewOverride : effectivePreview}
                onChange={(e) => {
                  setIsDirty(true);
                  setPreviewOverride(e.target.value);
                }}
                placeholder="Voorvertoning verschijnt hier…"
              />
            </div>

            {media && (
              <div className="liMedia">
                {media.thumbUrl ? (
                  <img src={media.thumbUrl} alt={media.name || "media"} />
                ) : (
                  <div className="hint">{media.name || "Media"}</div>
                )}
              </div>
            )}
          </div>

          {/* ───────── Media label (optioneel) ───────── */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="sectionTitle">Media (optioneel)</div>
            <input
              className="input"
              type="text"
              placeholder="Bestandsnaam of omschrijving…"
              value={mediaLabel}
              onChange={(e) => setMediaLabel(e.target.value)}
            />
            <div className="hint" style={{ marginTop: 6 }}>
              Dit is alleen een label in de UI. Uploads via een file column-integratie voegen we later toe.
            </div>
          </div>
        </>
      )}
    </div>
  );
}


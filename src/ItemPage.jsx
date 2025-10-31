import React from "react";
import monday from "./monday";
import { uploadFileToMonday } from "./mondayUpload";
import ErrorBoundary from './components/ErrorBoundary';
import LoadingIndicator from './components/LoadingIndicator';
import "./ui.css";

const TEXTUAL_COLUMN_TYPES = new Set([
  "text",
  "long-text",
  "long_text",
  "rich-text",
  "rich_text"
]);

function pickPreviewColumn(columnValues = []) {
  if (!Array.isArray(columnValues) || !columnValues.length) return null;

  const normalised = columnValues.map((cv) => ({
    ref: cv,
    id: (cv?.id || "").toLowerCase(),
    title: (cv?.column?.title || "").toLowerCase(),
    type: (cv?.column?.type || "").toLowerCase()
  }));

  const matchById = normalised.find((cv) => cv.id === "text_mkx3qq8w");
  if (matchById && TEXTUAL_COLUMN_TYPES.has(matchById.type)) {
    return matchById.ref;
  }

  const matchByTitle = normalised.find(
    (cv) =>
      TEXTUAL_COLUMN_TYPES.has(cv.type) &&
      /linkedin preview|linkedin\s*copy|preview|linkedin/i.test(cv.title || "")
  );
  if (matchByTitle) return matchByTitle.ref;

  const fallbackTextual = normalised.find((cv) =>
    TEXTUAL_COLUMN_TYPES.has(cv.type)
  );
  if (fallbackTextual) {
    console.warn("Fallback preview column selected:", {
      id: fallbackTextual.ref?.id,
      title: fallbackTextual.ref?.column?.title,
      type: fallbackTextual.ref?.column?.type
    });
    return fallbackTextual.ref;
  }

  console.warn(
    "No textual column available for preview. Candidates:",
    normalised.map(({ id, title, type }) => ({ id, title, type }))
  );
  return null;
}

function createTextColumnValue(text) {
  return JSON.stringify({ text });
}

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
  const itemIdStr = useItemIdFromHash();
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [isSavingPreview, setIsSavingPreview] = React.useState(false);
  const [previewSavedAt, setPreviewSavedAt] = React.useState(null);

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
  const previewRef = React.useRef(null);

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

  const safeNotice = React.useCallback((payload) => {
    if (!payload) return;
    try {
      if (typeof monday?.execute === "function") {
        monday.execute("notice", payload);
      } else {
        console.warn("monday.execute unavailable; skipping notice:", payload);
      }
    } catch (err) {
      console.warn("monday.execute('notice') failed:", err);
    }
  }, []);

  // Vind de kolom-id van "Media" op basis van de kolomtitel (fallback: 'files')
  const mediaColumnId = React.useMemo(() => {
    if (!item?.column_values) return null;

    // 1. Hard match op de échte column id van de Media-kolom
    const hard = item.column_values.find(cv => cv.id === "file_mkwyrehq");
    if (hard) return hard.id;

    // 2. Safety fallback: titel bevat "media"
    const byTitle = item.column_values.find(cv =>
      /media/i.test(cv?.column?.title || "")
    );
    if (byTitle) return byTitle.id;

    console.warn("⚠ mediaColumnId niet gevonden in item.column_values");
    return null;
  }, [item]);

  // Zorg dat we een Int itemId hebben voor de mutatie
  const itemIdInt = React.useMemo(() => {
    const raw = (item && item.id) || itemIdStr || "";
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : null;
  }, [item, itemIdStr]);

  // ───────────────── Upload handler ─────────────────
  async function handleFilesPicked(fileList = []) {
    const files = Array.from(fileList || []);
    if (!files.length || !itemIdInt) return;

    for (const file of files) {
      const objectUrl = URL.createObjectURL(file);
      const tmpKey = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const isVideo = /^video\//i.test(file.type);

      setUploaded(prev => [...prev, {
        url: objectUrl,
        name: file.name,
        type: isVideo ? "video/*" : "image/*",
        isLocal: true,
        _tmpKey: tmpKey,
        status: 'uploading'
      }]);

      try {
        const asset = await uploadFileToMonday({
          file,
          itemId: String(item?.id ?? itemIdStr),
          columnId: mediaColumnId
        });

        setUploaded(prev => {
          const ix = prev.findIndex(p => p._tmpKey === tmpKey);
          if (ix === -1) return prev;
          
          const next = [...prev];
          next[ix] = {
            url: asset.public_url || asset.url || asset.url_thumbnail,
            name: asset.name || file.name,
            type: isVideo ? "video/*" : "image/*",
            isLocal: false,
            status: 'success'
          };
          return next;
        });

        safeNotice({
          message: `Uploaded: ${file.name}`,
          type: 'success',
          timeout: 5000
        });
      } catch (err) {
        console.error("Upload failed:", err);
        setUploaded(prev => {
          const ix = prev.findIndex(p => p._tmpKey === tmpKey);
          if (ix === -1) return prev;
          
          const next = [...prev];
          next[ix] = {
            ...next[ix],
            isLocal: false,
            status: 'error',
            error: err.message
          };
          return next;
        });
        
        safeNotice({
          message: `Upload failed: ${file.name}`,
          type: 'error',
          timeout: 5000
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
    const rawId = item?.id ?? itemIdStr;
    const boardId = item?.board?.id;
    
    if (!rawId || !boardId) {
      console.warn("clearMediaOnMonday: missing itemId or boardId", { rawId, boardId });
      return false;
    }
    if (!mediaColumnId) {
      console.warn("clearMediaOnMonday: geen mediaColumnId");
      return false;
    }

    try {
      const mutation = `
        mutation ($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
          change_column_value(
            item_id: $itemId,
            board_id: $boardId,
            column_id: $columnId,
            value: $value
          ) {
            id
          }
        }`;

      // File column expects this structure
      const fileValue = JSON.stringify({
        files: []
      });

      const variables = {
        itemId: String(rawId),
        boardId: String(boardId),
        columnId: mediaColumnId,
        value: fileValue
      };

      const res = await monday.api(mutation, { variables });
      console.log("Clear media response:", res);

      if (res?.error || !res?.data?.change_column_value?.id) {
        throw new Error(res?.error || 'Failed to clear files');
      }

      return true;
    } catch (err) {
      console.error("Failed to clear media:", err);
      throw err;
    }
  }

  // UI + Monday in één keer opschonen
  async function handleClearAllMedia() {
    try {
      const success = await clearMediaOnMonday();
      if (success) {
        setUploaded([]);
        setActiveMediaIdx(0);
      } else {
        console.error("Failed to clear media on Monday.com");
        setErr("Failed to clear media on Monday.com");
      }
    } catch (error) {
      console.error("Error clearing media:", error);
      setErr(`Error clearing media: ${error.message}`);
    }
  }

  // keep a reliable preview column id (prefer the exact internal id you provided)
  const previewColumn = React.useMemo(
    () => pickPreviewColumn(item?.column_values || []),
    [item?.column_values]
  );

  // Sync DOM -> set initial/externally-updated preview text when user hasn't edited
  React.useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (!isDirty) {
      const text = (effectivePreview || "");
      if (el.innerText !== text) {
        el.innerText = text;
      }
    }
  }, [effectivePreview, isDirty]);

  // Then update the savePreviewToMonday function
  async function savePreviewToMonday() {
    if (!item?.id || !item?.board?.id) {
      safeNotice({
        message: "Missing item ID or board ID",
        type: 'error',
        timeout: 5000
      });
      return;
    }

    if (!previewColumn) {
      console.warn("Available columns:", item?.column_values);
      safeNotice({
        message: "Preview text column niet gevonden",
        type: 'error',
        timeout: 5000
      });
      return;
    }

    const currentText = (previewRef.current?.innerText || "").trim();
    
    setIsSavingPreview(true);
    setErr(null);

    try {
      const mutation = `
        mutation ($itemId: ID!, $boardId: ID!, $columnId: String!, $value: JSON!) {
          change_column_value(
            item_id: $itemId,
            board_id: $boardId,
            column_id: $columnId,
            value: $value
          ) {
            id
          }
        }`;

      const value = createTextColumnValue(currentText);

      const variables = {
        itemId: String(item.id),
        boardId: String(item.board.id),
        columnId: previewColumn.id,
        value
      };

      console.log("Saving preview text", {
        columnId: previewColumn.id,
        columnTitle: previewColumn.column?.title,
        columnType: previewColumn.column?.type
      });
      const res = await monday.api(mutation, { variables });
      
      if (res?.error || !res?.data?.change_column_value?.id) {
        throw new Error(res?.error || "Failed to save");
      }

      // Update local state
      setItem(prev => ({
        ...prev,
        column_values: prev.column_values.map(cv =>
          cv.id === previewColumn.id ? {
            ...cv,
            text: currentText,
            value: value
          } : cv
        )
      }));

      setIsDirty(false);
      setPreviewOverride("");
      setPreviewSavedAt(new Date());
      safeNotice({
        message: "Preview saved successfully",
        type: 'success',
        timeout: 5000
      });
    } catch (err) {
      console.error("Save failed:", err);
      safeNotice({
        message: `Save failed: ${err.message || 'Unknown error'}`,
        type: 'error',
        timeout: 5000
      });
    } finally {
      setIsSavingPreview(false);
    }
  }

  /** Render */
  return (
    <ErrorBoundary>
      <div className="wrap">
        
        {!itemIdStr ? (
          <>
            <button type="button" className="btnBack" onClick={() => window.history.back()}>
              ← Back
            </button>
            <div className="meta" style={{ marginTop: 12 }}>No item ID in URL</div>
          </>
        ) : (
          <>
            <div className="hrow" style={{ justifyContent: "space-between" }}>
              <button className="btnBack" onClick={() => (window.location.hash = "#/")}>
                ← Back
              </button>
              <div className="meta">
                {item && `Item: ${item.name} · Board: ${item.board?.name}`}
              </div>
            </div>

            <h2 className="h1" style={{ marginTop: 8 }}>Item Detail</h2>

            {loading && <LoadingIndicator text="Loading item details..." />}
            {err && (
              <div className="error-message" style={{ marginTop: 12, color: "#b00020" }}>
                Error: {err}
                <button 
                  onClick={() => window.location.reload()}
                  className="retry-button"
                  style={{ marginLeft: 8 }}
                >
                  Retry
                </button>
              </div>
            )}

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
                    {/* uncontrolled contentEditable: React does not write children so caret won't jump */}
                    <div
                      ref={previewRef}
                      className="liPostText"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        setIsDirty(true);
                        setPreviewOverride(e.currentTarget.innerText);
                      }}
                    />
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

                {/* Save button */}
                <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={savePreviewToMonday}
                    disabled={isSavingPreview}
                    className="linkBtn btnSave"
                  >
                    {isSavingPreview ? "Saving…" : "Save preview"}
                  </button>
                  {previewSavedAt && (
                    <span style={{ fontSize: 12, color: "#666" }}>
                      Saved {previewSavedAt.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

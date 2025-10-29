import monday from "./monday";

export async function uploadFileToMonday({ file, itemId, columnId }) {
  const form = new FormData();

  const operations = JSON.stringify({
    query: `mutation($file: File!, $itemId: ID!, $columnId: String!) {
      add_file_to_column(
        file: $file,
        item_id: $itemId,
        column_id: $columnId
      ) { id }
    }`,
    variables: {
      file: null,
      itemId: String(itemId),
      columnId
    }
  });

  form.append("operations", operations);
  form.append("map", JSON.stringify({ "0": ["variables.file"] }));
  form.append("0", file);

  // Important: do NOT set unsafe headers like "user-agent" here.
  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    // Note: Do not set 'Content-Type' or 'User-Agent' manually when using FormData
    body: form
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Upload request failed: ${res.status} ${res.statusText} ${txt}`);
  }

  let json;
  try {
    json = await res.json();
  } catch (err) {
    throw new Error("Failed to parse upload response as JSON");
  }

  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message || "Upload GraphQL error");
  }

  const assetId = json.data?.add_file_to_column?.id;
  if (!assetId) throw new Error("No asset ID returned after upload");

  // Resolve asset details via monday.api (SDK) to get public_url / thumbnail
  const resp = await monday.api(
    `
      query($ids: [ID!]!) {
        assets(ids: $ids) {
          id
          name
          url
          public_url
          url_thumbnail
        }
      }`,
    { variables: { ids: [String(assetId)] } }
  );
  const asset = resp?.data?.assets?.[0] || null;

  return asset || { id: assetId };
}
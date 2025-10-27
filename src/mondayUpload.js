export async function uploadFileToMonday({ file, itemId, columnId, apiToken }) {
  // GraphQL multipart (operations + map)
  const operations = JSON.stringify({
    query: `
      mutation add($file: File!, $itemId: ID!, $columnId: String!) {
        add_file_to_column(file: $file, item_id: $itemId, column_id: $columnId) { id }
      }`,
    variables: { file: null, itemId: String(itemId), columnId }
  });

  const map = JSON.stringify({ "0": ["variables.file"] });

  const form = new FormData();
  form.append("operations", operations);
  form.append("map", map);
  form.append("0", file, file.name);

  const headers = {};
  if (apiToken) headers["Authorization"] = apiToken;

  const resp = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers,
    body: form,
    credentials: "omit",
  });

  const json = await resp.json();
  if (json.errors) throw json.errors;
  return json.data?.add_file_to_column?.id;
}
export async function uploadFileToMonday({ file, itemId, columnId }) {
  const form = new FormData();
  
  const operations = JSON.stringify({
    query: `
      mutation($file: File!, $itemId: ID!, $columnId: String!) {
        add_file_to_column(
          file: $file,
          item_id: $itemId,
          column_id: $columnId
        ) {
          id
        }
      }
    `,
    variables: {
      file: null,
      itemId: String(itemId),
      columnId
    }
  });

  form.append("operations", operations);
  form.append("map", JSON.stringify({ "0": ["variables.file"] }));
  form.append("0", file);

  const res = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      // Don't set user-agent header
      Accept: "application/json",
    },
    body: form
  });

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  
  return json.data?.add_file_to_column?.id;
}
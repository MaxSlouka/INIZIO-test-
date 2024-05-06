let searchData = [];

async function searchForQuery() {
  const apiKey = "AIzaSyCnHQ_nOl9roNUzl_hPRUjmyErZPMhOBk8";
  const searchEngineId = "e211addab2b8040ad";
  const query = document.getElementById("searchQuery").value;

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Výsledky vyhledávání:", data);
    searchData = data.items;
    displayResults(searchData);
  } catch (error) {
    console.error("Chyba při provádění vyhledávání:", error);
  }
  document.getElementById("searchQuery").value = "";
}

function displayResults(items) {
  const searchResultDiv = document.getElementById("searchResults");
  searchResultDiv.innerHTML = "";

  items.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.innerHTML = `
      <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
      <p>${item.snippet}</p>`;
    searchResultDiv.appendChild(resultItem);
  });
}

function downloadResultsAsJSON() {
  if (searchData.length === 0) {
    alert("Nejprve proveďte vyhledávání.");
    return;
  }

  const dataString = JSON.stringify(searchData);
  const blob = new Blob([dataString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "search_results.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function downloadResultsAsCSV() {
  if (searchData.length === 0) {
    alert("Nejprve proveďte vyhledávání.");
    return;
  }

  const csvHeaders = ["Title", "Link", "Snippet"];
  const csvRows = searchData.map((item) => [
    item.title,
    item.link,
    item.snippet,
  ]);

  const csvContent = [
    csvHeaders.join(","),
    ...csvRows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "search_results.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadResultsAsXML() {
  if (searchData.length === 0) {
    alert("Nejprve proveďte vyhledávání.");
    return;
  }

  const xmlData = `
    <items>
      ${searchData
        .map(
          (item) => `
        <item>
          <title>${item.title}</title>
          <link>${item.link}</link>
          <snippet>${item.snippet}</snippet>
        </item>
      `
        )
        .join("")}
    </items>
  `;

  const blob = new Blob([xmlData], { type: "application/xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "search_results.xml";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

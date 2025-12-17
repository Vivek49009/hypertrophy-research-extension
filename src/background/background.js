chrome.runtime.onInstalled.addListener(async () => {
  console.log("Hypertrophy Research background worker installed");

  const ids = await fetchPubMedIds();
  console.log("Fetched PubMed IDs:", ids);

  const xmlData = await fetchPubMedDetails(ids);
  console.log("Fetched PubMed XML length:", xmlData.length);

  chrome.storage.local.set({
    pubmedIds: ids,
    pubmedRawXml: xmlData
  });
});



async function fetchPubMedIds() {
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi';

    const params = new URLSearchParams({
        db: 'pubmed',
        term: 'muscle hypertrophy resistance training',
        retmode: 'json',
        retmax: '10',
        sort: 'pub date'
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();
    return data.esearchresult.idlist;
}

async function fetchPubMedDetails(ids){
    const baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";

    const params = new URLSearchParams({
        db: 'pubmed',
        id: ids.join(','),
        retmode: 'xml'
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const xmlText = await response.text();
    return xmlText;
}
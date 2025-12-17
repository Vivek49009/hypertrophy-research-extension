chrome.runtime.onInstalled.addListener(async () => {
  const ids = await fetchPubMedIds();
  const xmlData = await fetchPubMedDetails(ids);

  const studies = parsePubMedArticles(xmlData);

  console.log("Parsed studies:", studies);

  chrome.storage.local.set({
    pubmedStudies: studies
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

function parsePubMedArticles(xml) {
  const articles = [];
  const articleBlocks = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  articleBlocks.forEach(block => {
    const get = (regex) => {
      const match = block.match(regex);
      return match ? match[1].trim() : "";
    };

    const id = get(/<PMID.*?>(.*?)<\/PMID>/);
    const title = get(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);

    const abstractMatches = [...block.matchAll(/<AbstractText.*?>([\s\S]*?)<\/AbstractText>/g)];
    const abstract = abstractMatches.map(m => m[1].trim()).join("\n\n");

    const journal = get(/<Journal>[\s\S]*?<Title>(.*?)<\/Title>/);
    const year =
      get(/<PubDate>[\s\S]*?<Year>(.*?)<\/Year>/) ||
      get(/<PubDate>[\s\S]*?<MedlineDate>(.*?)<\/MedlineDate>/);

    articles.push({
      id,
      title,
      abstract,
      journal,
      year
    });
  });

  return articles;
}

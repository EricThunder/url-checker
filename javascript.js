async function processInput() {
  let url = document.getElementById('entered_url').value;
  let cleanedUrl = cleanUrl(url);
  let isNonLatin = checkNonLatinCharacters(cleanedUrl);

  document.getElementById('clean_url').innerText = cleanedUrl;
  document.getElementById('non_latin').innerText = isNonLatin ? "The URL contains non-latin characters." : "The URL does not contain non-latin characters.";

  // let isUrlFound = await checkUrlInFiles(cleanedUrl);
  // document.getElementById('url_found').innerText = isUrlFound ? "The URL is found in the list." : "The URL is not found in the list.";
}

function cleanUrl(url) {
  url = url.replace("https://", "");
  url = url.replace("http://", "");
  url = url.split("/")[0];
  url = url.split("?")[0];
  url = url.split("#")[0];
  url = url.split(":")[0];
  return url;
}

function checkNonLatinCharacters(url) {
  return /[^\u0000-\u007F]/.test(url);
}


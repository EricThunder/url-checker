function processInput() {


  document.getElementById('clean_url').innerText = cleanUrl(document.getElementById('entered_url').value);
}

function cleanUrl(clean_url) {
//  var clean_url = document.getElementById('entered_url').value;
  clean_url = clean_url.replace("https://", "");
  clean_url = clean_url.replace("http://", "");
  clean_url = clean_url.split("/")[0];
  clean_url = clean_url.split("?")[0];
  clean_url = clean_url.split("#")[0];
  clean_url = clean_url.split(":")[0];
  return clean_url;
}

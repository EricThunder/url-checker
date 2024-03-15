async function processInput() {
  let url = document.getElementById('entered_url').value;
  let cleanedUrl = cleanUrl(url);
  let isNonLatin = checkNonLatinCharacters(cleanedUrl);
  let whoisData = whois_lookup(cleanedUrl);

  document.getElementById('clean_url').innerText = cleanedUrl;
  document.getElementById('non_latin').innerText = isNonLatin ? "The URL contains non-latin characters." : "The URL does not contain non-latin characters.";
//  document.getElementById('whois_result').innerText = whoisData;


  // Clean the URL to remove any unnecessary parts
  function cleanUrl(url) {
  url = url.replace("https://", "");
  url = url.replace("http://", "");
  url = url.split("/")[0];
  url = url.split("?")[0];
  url = url.split("#")[0];
  url = url.split(":")[0];
  return url;
}

// Non-latin characters are characters that are not part of the ASCII character set (characters 0-127).
function checkNonLatinCharacters(url) {
    return /[^\u0000-\u007F]/.test(url);

  }
  const GoogleSafeBrowsing_APIKey = "AIzaSyB04V8E4IJlrx3ywKqkjJ2vgEAHucJibWQ";
  const safeBrowsingUrl = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=' + GoogleSafeBrowsing_APIKey;

  const requestData = {
    client: {
      clientId: 'Google-SafeBrowsing-API-Client',
      clientVersion: '1.5.2'
    },
    threatInfo: {
      threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [{ 'url': cleanedUrl }]
    }
  };

  try {
    const response = await fetch(safeBrowsingUrl, {
      method: 'POST',
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    Display_GoogleSafeBrowsing_Results(data);
  } catch (error) {
    console.error('Error:', error);
  }
}


// Display the results of the Google Safe Browsing API
function Display_GoogleSafeBrowsing_Results(data) {
  const resultsContainer = document.getElementById('GoogleSafeBrowsing_Result');

  let GoogleSafeBrowsing_Result = '';
  if (data.matches && data.matches.length > 0) {
    GoogleSafeBrowsing_Result = '<p>Threat detected!</p>';
    data.matches.forEach(({platformType, threat, threatEntryType, threatType}) => {
      GoogleSafeBrowsing_Result += `<p>Threat type: ${threatType}</p>`;
      GoogleSafeBrowsing_Result += `<p>Platform type: ${platformType}</p>`;
      GoogleSafeBrowsing_Result += `<p>Threat entry type: ${threatEntryType}</p>`;
      GoogleSafeBrowsing_Result += `<p>Threat URL: ${threat.url}</p>`;
    });
  } else {
    GoogleSafeBrowsing_Result = '<p>No threat detected.</p>';
  }
  resultsContainer.innerHTML = GoogleSafeBrowsing_Result;
}

async function whois_lookup(url) {
  const apiKey = 'at_Qy1xr2IAdN2t99QITjaV6pz6LWfm0'; // Replace with your actual API key
  const apiUrl = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';
    try {
        const response = await fetch(`${apiUrl}?domainName=${url}&apiKey=${apiKey}&outputFormat=JSON`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const creationDate = data.WhoisRecord.createdDate;
        document.getElementById('whois_result').textContent = `Domain Creation Date: ${creationDate}`;
        //console.log('Domain Creation Date:', creationDate);
        return creationDate;
    } catch (error) {
        console.error('Error:', error);
        return 'Error';
    }
}





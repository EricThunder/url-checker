async function processInput() {
  let url = document.getElementById('entered_url').value;
  let cleanedUrl = cleanUrl(url);
  let isNonLatin = checkNonLatinCharacters(cleanedUrl);
  let whoisData = whois_lookup(cleanedUrl);

  document.getElementById('clean_url').innerText = cleanedUrl;
  document.getElementById('non_latin').innerText = isNonLatin ? "L'URL contient des caractères non latins." : "L'URL ne contient pas de caractères non latins.";

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
  const GoogleSafeBrowsing_APIKey = "AIzaSyAYuqkchTccs8HnhW985bpqa1roI1qtoWU"; // Don't try to use this key. I made a burner account just for it and only the Google Safe Browsing API is enabled.
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
    GoogleSafeBrowsing_Result = '<p>Menace détectée!</p>';
    data.matches.forEach(({platformType, threat, threatEntryType, threatType}) => {
      GoogleSafeBrowsing_Result += `<p>Type de menace: ${threatType}</p>`;
      //GoogleSafeBrowsing_Result += `<p>Threat URL: ${threat.url}</p>`;
    });
  } else {
    GoogleSafeBrowsing_Result = '<p>Pas de menace détectée</p>';
  }
  resultsContainer.innerHTML = GoogleSafeBrowsing_Result;
}

async function whois_lookup(url) {
  const whois_apiKey = 'at_Qy1xr2IAdN2t99QITjaV6pz6LWfm0'; // Don't try to use this key. I made a burner account just for it.
  const apiUrl = 'https://www.whoisxmlapi.com/whoisserver/WhoisService';
    try {
        const response = await fetch(`${apiUrl}?domainName=${url}&apiKey=${whois_apiKey}&outputFormat=JSON`);
        if (!response.ok) {
            throw new Error("La réponse du réseau n'était pas correcte");
        }
        const data = await response.json();
        const creationDate = data.WhoisRecord.createdDate;
        const relative_time = relative_time_calculator(creationDate);
        document.getElementById('whois_result').textContent = `Date de création du domaine: ${relative_time}` + ' (' + creationDate + ')';
        return creationDate;
    } catch (error) {
        console.error('Error:', error);
        return 'Error';
    }
}

function relative_time_calculator(creationDate) {
    const currentDate = new Date();
    const createdDate = new Date(creationDate);
    const timeDifference = currentDate - createdDate;

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return years === 1 ? 'Il y a 1 an' : `Il y a ${years} ans`;
    } else if (months > 0) {
        return months === 1 ? 'Il y a 1 mois' : `Il y a ${months} mois`;
    } else if (days > 0) {
        return days === 1 ? 'Il y a un jour' : `Il y a ${days} jours`;
    } else if (hours > 0) {
        return hours === 1 ? 'Il y a une heure' : `Il y a ${hours} heures`;
    } else if (minutes > 0) {
        return minutes === 1 ? 'il y a 1 minute' : `il y a ${minutes} minutes`;
    } else {
        return seconds < 5 ? "tout à l'heure" : `il y a ${seconds} secondes`;
    }
}
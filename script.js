const tomtomKey = "hG3QhTQW0LbEK0wsZlv5sKOPWr26kQny";
const geocodeKey = "8980a897f1b14214afd08efbf872745a";

const weatherKey = '171189a99e15448ab14163913230205';
const WeatherUrl = 'http://api.weatherapi.com/v1/current.json?key=' + weatherKey + '&q=Milan&aqi=no';


// MAPPA: Utilizzo un'API per ottenere le coordinate degli indirizzi del footer. I tornei variano da città a città, 
//quindi mi basterà cambiare gli indirizzi nel footer per ottenere le coordinate delle città desiderate.
//Una volta ottenute le coordinate utilizzo l'altra API per ottenere la mappa e il marker.
//Tutto questo viene attivato quando si clicca su uno degli indiriizzi del footer.

function goBack(event) {
  // Ritorno al footer, nascondo la mappa e riabilito lo scroll
  location.href = "#down";
  mapContainer.classList.add("hidden");
  document.querySelector('body').classList.remove("disable-scroll");
  map_.innerHTML = "";

}


function getCoordinates(event) {
  // Ottengo la via cliccata, la inserisco nell'url e faccio la fetch

  const place = event.currentTarget.innerHTML;
  console.log(place);

  // Per inserire la via nell'url, devo sostituire gli spazi con %20
  let addr = place.split(" ");
  let url = "https://api.geoapify.com/v1/geocode/search?text="
  for (let i = 0; i < addr.length; i++) {
    url += addr[i] + "%20";
    console.log(url)
  }

  fetch(url + "%20Italy&apiKey=" + geocodeKey, { method: "GET" }).then(onResponse).then(onJson_xy);

}

function onJson_xy(json) {
  console.log('JSON Coordinate ricevuto');
  console.log(json);

  const results = json.features
  console.log(results);

  if (results.length == 0) {
    console.log("Indirizzo non trovato");
  }
  // Se trova l'indirizzo, ottengo le coordinate e inizializzo la mappa
  else {
    const lat = results[0].geometry.coordinates[1];
    const lon = results[0].geometry.coordinates[0];
    console.log(lat, lon);
    center = [lon, lat];
    map = tt.map({
      key: tomtomKey,
      container: "map",
      center: center,
      zoom: 14
    });

    // Una volta caricata la mappa, aggiungo il marker

    map.on("load", function () {
      new tt.Marker().setLngLat(center).addTo(map);
    });

    location.href = "#modalview";
    mapContainer.classList.remove("hidden");
    // Una volta che la mappa è stata caricata, elimino la possibilità di scrollare la pagina
    mapContainer.addEventListener('wheel', preventScroll, { passive: false });
    document.querySelector('body').classList.add("disable-scroll");


  }
}




// Una volta che la mappa è stata caricata, elimino la possibilità di scrollare la pagina
function preventScroll(element) {
  element.preventDefault();
  return false;
}

function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

// METEO: Utilizzo un'API per ottenere le informazioni meteo della città dove si svolgono i tornei
// L'idea era quella di mostrare le previsioni per la settimana successiva, ma l'API è a pagamento

const options = { method: "GET" };

function Weather(event) {
  fetch(WeatherUrl, options).then(onResponse).then(onJsonWeather);

}

function closeWeather(event) {
  const weather = document.querySelector("#weather");
  weather.classList.add("hidden");
  meteo.removeEventListener("click", closeWeather);
  meteo.addEventListener("click", Weather);
}

function onJsonWeather(json) {
  console.log(json);
  meteo.removeEventListener("click", Weather);
  meteo.addEventListener("click", closeWeather);
  const weather = document.querySelector("#weather");
  weather.classList.remove("hidden");
  const meteoLogo = document.querySelector("#meteoLogo");
  const meteoInfo = document.querySelector("#meteoInfo");
  const meteoTemp = document.querySelector("#meteoTemp");

  meteoInfo.textContent = json.current.condition.text;
  meteoTemp.textContent = json.current.temp_c + "°C";
  meteoLogo.src = json.current.condition.icon;
}





const sede = document.querySelector("#sede");
const segre = document.querySelector("#segre");
const campo = document.querySelector("#campo");
const mapContainer = document.querySelector("#modalview");
const map_ = document.querySelector("#map");
const meteo = document.querySelector("#meteo");

sede.addEventListener("click", getCoordinates);
segre.addEventListener("click", getCoordinates);
campo.addEventListener("click", getCoordinates);
mapContainer.addEventListener("click", goBack);
map_.addEventListener("click", function (event) { event.stopPropagation(); });
meteo.addEventListener("click", Weather);




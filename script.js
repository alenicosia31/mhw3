const tomtomKey = "hG3QhTQW0LbEK0wsZlv5sKOPWr26kQny";
const geocodeKey = "8980a897f1b14214afd08efbf872745a";


function goBack(event) {
    // Ritorno al footer, nascondo la mappa e riabilito lo scroll
    location.href = "#down";
    mapContainer.classList.add("hidden");
    document.querySelector('body').classList.remove("disable-scroll");
    
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

    fetch(url + "%20Italy&apiKey=" + geocodeKey, { method: "GET" })
        .then(onResponse)
        .then(onJson_xy);
    
}

function onJson_xy(json){
    console.log('JSON Coordinate ricevuto');
    console.log(json);
    
    const results = json.features
    console.log(results);
    
    if(results.length == 0)
    {
        console.log("Indirizzo non trovato");
    }
    // Se trova l'indirizzo, ottengo le coordinate e inizializzo la mappa
    else{
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
        mapContainer.addEventListener('wheel', preventScroll, {passive: false});
        document.querySelector('body').classList.add("disable-scroll");
        

    }
}


// Una volta che la mappa è stata caricata, elimino la possibilità di scrollare la pagina
function preventScroll(element){
    element.preventDefault();
    return false;
}

function onResponse(response) {
    console.log('Risposta ricevuta');
    return response.json();
  }


const sede = document.querySelector("#sede");
const segre = document.querySelector("#segre");
const campo = document.querySelector("#campo");
const mapContainer = document.querySelector("#modalview");
const map_ = document.querySelector("#map");

sede.addEventListener("click", getCoordinates);
segre.addEventListener("click", getCoordinates);
campo.addEventListener("click", getCoordinates);
mapContainer.addEventListener("click", goBack);
map_.addEventListener("click", function(event) { event.stopPropagation(); });




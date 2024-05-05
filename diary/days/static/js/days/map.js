maptilersdk.config.apiKey = 'Lve4k0PNe4gWKGMF4lxx';

const visitedPlacesList = document.querySelector(".visited-places-list");
const visitedPlaces = document.querySelectorAll(".visited-place");


const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: "streets-v2",
    center: [28, 48], // starting position [lng, lat]
    zoom: 4, // starting zoom
    scaleControl: true,
    fullscreenControl: "top-right",
});

const gc = new maptilersdkMaptilerGeocoder.GeocodingControl();
map.addControl(gc, 'top-left');

map.on('load', async () => {
    const geolocationIP = await maptilersdk.geolocation.info();
    const {country_languages} = geolocationIP;
    map.setLanguage(`name:${country_languages[0]}`);
});

let markers = [];
visitedPlaces.forEach(value => {
    const longitude = parseFloat(value.getAttribute('data-longitude'));
    const latitude = parseFloat(value.getAttribute('data-latitude'));
    const title = value.getAttribute('data-title');
    let popup = new maptilersdk.Popup({offset: 25}).setHTML(
        `<div class="place-title">${title}</div>`
    );
    const marker = new maptilersdk.Marker().setLngLat([longitude, latitude]).setPopup(popup).addTo(map);
    markers.push(marker);
    value.addEventListener("click", () => {
        map.setCenter([longitude, latitude]);
        map.zoomTo(15);
    })
    if (editMode) {
        const deleteBtn = value.querySelector('.delete-place-button');
        deleteBtn.addEventListener('click', (event) => {
            deleteVisitedPlace(value.getAttribute('data-id'), marker);
            event.stopImmediatePropagation();
        });
    }
});

if (editMode) {
    map.on('contextmenu', function (event) {
        let coordinates = event.lngLat;
        const placeTitle = prompt("Задайте назву для відвіданого місця");
        if (placeTitle) {
            let popup = new maptilersdk.Popup({offset: 25}).setHTML(
                `<div class="place-title">${placeTitle}</div>`
            );
            let marker = new maptilersdk.Marker()
                .setLngLat(coordinates).setPopup(popup)
                .addTo(map);
            markers.push(marker);
            addVisitedPlace(coordinates, placeTitle, marker);
        }
    });
}


function addVisitedPlace(coordinates, placeTitle, marker) {
    const url = `${window.location.href}visited_place/add/`;
    const formData = new FormData();
    formData.append('longitude', coordinates.lng);
    formData.append('latitude', coordinates.lat);
    formData.append('title', placeTitle);
    sendFormData(url, formData, (data) => {
        const visitedPlaceElem = document.createElement('div');
        visitedPlaceElem.classList.add("visited-place");
        visitedPlaceElem.setAttribute('data-id', data['data']['place_id']);
        visitedPlaceElem.setAttribute('data-longitude', coordinates.lng);
        visitedPlaceElem.setAttribute('data-latitude', coordinates.lat);
        visitedPlaceElem.setAttribute('data-title', placeTitle);
        visitedPlaceElem.innerHTML += `<i class="material-icons-outlined">location_on</i>
                                    <span class="visited-place-name">${placeTitle}</span>`;
        const deleteBtn = document.createElement('div');
        deleteBtn.classList.add('delete-place-button');
        deleteBtn.classList.add('item-text-button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = `<i class="material-icons-outlined">delete</i>`;
        deleteBtn.addEventListener('click', (event) => {
            deleteVisitedPlace(data['data']['place_id'], marker);
            event.stopImmediatePropagation();
        });
        visitedPlaceElem.appendChild(deleteBtn);
        visitedPlacesList.appendChild(visitedPlaceElem);
        visitedPlaceElem.addEventListener("click", () => {
            map.setCenter([coordinates.lng, coordinates.lat]);
            map.zoomTo(15);
        })
        setDayUpdateTime(data['updated']);
    });
}

function deleteVisitedPlace(pk, marker) {
    const item = document.querySelector(`.visited-place[data-id="${pk}"`);
    const url = `${window.location.href}visited_place/${pk}/delete/`;
    sendFormData(url, null, (data) => {
        marker.remove();
        item.parentNode.removeChild(item);
        setDayUpdateTime(data['updated']);
    });
}
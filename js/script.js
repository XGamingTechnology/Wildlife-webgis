document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map centered globally
    const map = L.map('map').setView([0, 0], 2);

    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Define icons for each species
    const icons = {
        Lion: L.icon({ iconUrl: 'icons/lion.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Elephant: L.icon({ iconUrl: 'icons/elephant.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Giraffe: L.icon({ iconUrl: 'icons/giraffe.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Zebra: L.icon({ iconUrl: 'icons/zebra.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Tiger: L.icon({ iconUrl: 'icons/tiger.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Cheetah: L.icon({ iconUrl: 'icons/cheetah.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Kangaroo: L.icon({ iconUrl: 'icons/kangaroo.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Panda: L.icon({ iconUrl: 'icons/panda.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Penguin: L.icon({ iconUrl: 'icons/penguin.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Koala: L.icon({ iconUrl: 'icons/koala.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Bear: L.icon({ iconUrl: 'icons/bear.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        Gorilla: L.icon({ iconUrl: 'icons/gorilla.png', iconSize: [32, 32], iconAnchor: [16, 32] }),
        ArcticFox: L.icon({ iconUrl: 'icons/fox.png', iconSize: [32, 32], iconAnchor: [16, 32] })
    };

    // Function to load and display GeoJSON data
    function loadGeoJsonData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const geoJsonLayer = L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        const species = feature.properties.species;
                        const icon = icons[species] || L.icon({ iconUrl: 'icons/default.png', iconSize: [32, 32], iconAnchor: [16, 32] });
                        return L.marker(latlng, { icon: icon });
                    },
                    onEachFeature: function (feature, layer) {
                        const popupContent = `
                            <div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <h5 class="card-title">${feature.properties.animalName}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">${feature.properties.species}</h6>
                                    <p class="card-text">
                                        <strong>ID:</strong> ${feature.properties.animalId}<br>
                                        <strong>Timestamp:</strong> ${new Date(feature.properties.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>`;
                        layer.bindPopup(popupContent);
                    }
                });

                // Add the layer to the map
                geoJsonLayer.addTo(map);

                // Handle species selection
                document.getElementById('species-select').addEventListener('change', function () {
                    const selectedSpecies = this.value;
                    geoJsonLayer.clearLayers(); // Clear the existing layers

                    if (selectedSpecies === 'all') {
                        geoJsonLayer.addData(data); // Show all species if "All Species" is selected
                    } else {
                        const filteredData = {
                            type: 'FeatureCollection',
                            features: data.features.filter(feature => feature.properties.species === selectedSpecies)
                        };
                        geoJsonLayer.addData(filteredData); // Add only the filtered species
                    }
                });
            })
            .catch(error => console.error('Error loading the GeoJSON data:', error));
    }

    // Load the bird tracking data
    loadGeoJsonData('data/bird-tracking-data.geojson');
});

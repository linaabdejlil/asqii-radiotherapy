import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import axios from "axios";

const AffichageCentreTraitement = () => {
  const [centresTraitement, setCentresTraitement] = useState([]);
  let map;

  useEffect(() => {
    // Initialiser la carte Mapbox
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGVsYS10YWxiaSIsImEiOiJjbHZhenpxbHkwM2dsMmlsaDBmeGtpZmlnIn0.NcmkgMsBgMFCdZzcVsE3LQ";

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [-77.034084142948, 38.909671288923], // Coordonnées par défaut
      zoom: 13,
      scrollZoom: false,
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add the markers and listings to the map
    map.on("load", async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/centreTraitements/getAll"
        );
        setCentresTraitement(response.data);

        map.addSource("places", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: response.data.map((centre, index) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [centre.longitude, centre.latitude],
              },
              properties: {
                id: index,
                address: centre.nom,
                city: centre.ville,
                postalCode: centre.codePostal,
              },
            })),
          },
        });

        addMarkers();
        buildLocationList(response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des centres de traitement :",
          error
        );
        alert(
          "Une erreur s'est produite lors du chargement des centres de traitement."
        );
      }
    });

    // Nettoyer la carte lorsque le composant est démonté
    return () => map.remove();
  }, []);

  const addMarkers = () => {
    // For each feature in the GeoJSON object, create a marker and add it to the map
    centresTraitement.forEach((centre, index) => {
      // Create a div element for the marker
      const el = document.createElement("div");
      // Assign a unique `id` to the marker
      el.id = `marker-${index}`;
      // Assign the `marker` class to each marker for styling
      el.className = "marker";

      // Create a marker using the div element defined above and add it to the map
      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat([centre.longitude, centre.latitude])
        .addTo(map);

      // Add an event listener to the marker
      el.addEventListener("click", () => {
        // Fly to the point
        map.flyTo({
          center: [centre.longitude, centre.latitude],
          zoom: 15,
        });

        // Open a popup
        new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat([centre.longitude, centre.latitude])
          .setHTML(
            `<h3>${centre.nom}</h3><h4>${centre.ville}, ${centre.codePostal}</h4>`
          )
          .addTo(map);
      });
    });
  };

  const buildLocationList = (centres) => {
    const listings = document.getElementById("listings");

    // Remove existing listings
    while (listings.firstChild) {
      listings.removeChild(listings.firstChild);
    }

    // Add a new listing section to the sidebar
    centres.forEach((centre, index) => {
      // Add a new listing
      const listing = listings.appendChild(document.createElement("div"));
      // Assign a unique `id` to the listing
      listing.id = `listing-${index}`;
      // Assign the `item` class to each listing for styling
      listing.className = "item";

      // Add the link to the individual listing created above
      const link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = `link-${index}`;
      link.innerHTML = `${centre.nom}`;

      // Add details to the individual listing
      const details = listing.appendChild(document.createElement("div"));
      details.innerHTML = `${centre.ville}, ${centre.codePostal}`;

      // Add an event listener to the link
      link.addEventListener("click", () => {
        // Fly to the point
        map.flyTo({
          center: [centre.longitude, centre.latitude],
          zoom: 15,
        });

        // Open a popup
        new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat([centre.longitude, centre.latitude])
          .setHTML(
            `<h3>${centre.nom}</h3><h4>${centre.ville}, ${centre.codePostal}</h4>`
          )
          .addTo(map);

        // Highlight listing in sidebar
        const activeItem = document.getElementsByClassName("active");
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        listing.classList.add("active");
      });
    });
  };

  return (
    <div>
      <div className="sidebar">
        <div className="heading">
          <h1>Centres de Traitement</h1>
        </div>
        <div id="listings" className="listings"></div>
      </div>
      <div
        id="map"
        style={{ width: "100%", height: "400px", position: "relative" }}
        className="map"
      ></div>

      <style jsx>{`
        .mapboxgl-popup-close-button {
          display: none;
        }

        .marker {
          border: none;
          cursor: pointer;
          height: 56px;
          width: 56px;
          background-image: url("https://docs.mapbox.com/help/demos/building-a-store-locator/marker.png");
        }

        /* Marker tweaks */
        .mapboxgl-popup {
          padding-bottom: 50px;
        }

        .mapboxgl-popup-content {
          font: 400 15px/22px "Source Sans Pro", "Helvetica Neue", sans-serif;
          padding: 0;
          width: 180px;
        }

        .mapboxgl-popup-content h3 {
          background: #91c949;
          color: #fff;
          margin: 0;
          padding: 10px;
          border-radius: 3px 3px 0 0;
          font-weight: 700;
          margin-top: -15px;
        }

        .mapboxgl-popup-content h4 {
          margin: 0;
          padding: 10px;
          font-weight: 400;
        }

        .mapboxgl-popup-content div {
          padding: 10px;
        }

        .mapboxgl-popup-anchor-top > .mapboxgl-popup-content {
          margin-top: 15px;
        }

        .mapboxgl-popup-anchor-top > .mapboxgl-popup-tip {
          border-bottom-color: #91c949;
        }
      `}</style>
    </div>
  );
};

export default AffichageCentreTraitement;

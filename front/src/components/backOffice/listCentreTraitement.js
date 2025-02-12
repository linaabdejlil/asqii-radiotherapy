import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";
import "./style/listCentreTraitement.css";
import LeftBar from "./leftBar";
import backoffice from "../../assets/images/backoffice.png";
import "mapbox-gl/dist/mapbox-gl.css";

const ListCentreTraitement = () => {
  const [centresTraitement, setCentresTraitement] = useState([]);
  let map;

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGVsYS10YWxiaSIsImEiOiJjbHZhemN2cXcwMmE0MnZudmF3c3FjMWJsIn0.Fqzw615zGTP6SdmFclHxSA";

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v9",
      projection: "globe",
      center: [10.1797, 36.8065],
      zoom: 1,
      scrollZoom: false,
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on("style.load", () => {
      map.setFog({});
    });

    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;

    let userInteracting = false;
    const spinEnabled = true;

    function spinGlobe() {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.on("mousedown", () => {
      userInteracting = true;
    });
    map.on("dragstart", () => {
      userInteracting = true;
    });

    map.on("moveend", () => {
      spinGlobe();
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/centreTraitements/getAll"
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

    return () => map.remove();
  }, []);

  const addMarkers = () => {
    centresTraitement.forEach((centre, index) => {
      const el = document.createElement("div");
      el.className = "marker";

      new mapboxgl.Marker(el)
        .setLngLat([centre.longitude, centre.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${centre.nom}</h3><h4>${centre.ville}, ${centre.codePostal}</h4>`
          )
        )
        .addTo(map);
    });
  };

  const buildLocationList = (centres) => {
    const listings = document.getElementById("listings");

    while (listings.firstChild) {
      listings.removeChild(listings.firstChild);
    }

    centres.forEach((centre, index) => {
      const listing = listings.appendChild(document.createElement("div"));
      listing.id = `listing-${index}`;
      listing.className = "item";

      const link = listing.appendChild(document.createElement("a"));
      link.href = "#";
      link.className = "title";
      link.id = `link-${index}`;
      link.innerHTML = `${centre.nom}`;

      const details = listing.appendChild(document.createElement("div"));
      details.innerHTML = `${centre.ville}, ${centre.codePostal}`;

      link.addEventListener("click", () => {
        map.flyTo({
          center: [centre.longitude, centre.latitude],
          zoom: 15,
        });

        const activeItem = document.getElementsByClassName("active");
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
        listing.classList.add("active");
      });
    });
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backoffice})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw",
      }}
    >
      {" "}
      <LeftBar></LeftBar>
      <div style={{ display: "flex" }}>
        <div className="containerSideMap">
          <div className="listeCentre">Les centres de traitement</div>
          <div id="listings" className="listings"></div>
        </div>
        <div className="containerMap">
          <div
            id="map"
            style={{
              width: "1180px",
              height: "650px",
              position: "relative",
              left: "20px",
              top: "20px",
            }}
            className="map"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ListCentreTraitement;

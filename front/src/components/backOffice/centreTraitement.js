import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import axios from "axios";

const CentreTraitement = () => {
  const [centresTraitement, setCentresTraitement] = useState([]);
  let map;

  useEffect(() => {
    // Initialiser la carte Mapbox
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGVsYS10YWxiaSIsImEiOiJjbHZhenpxbHkwM2dsMmlsaDBmeGtpZmlnIn0.NcmkgMsBgMFCdZzcVsE3LQ";

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [10.1797, 36.8065], // Coordonnées de Tunis par défaut
      zoom: 10,
    });

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());

    // Add the geocoder control to the map.
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Rechercher un lieu",
      countries: "tn", // Limiter la recherche à la Tunisie
      types: "country, region, place, locality, address, poi, district",
      proximity: { longitude: 10.1797, latitude: 36.8065 }, // Coordonnées de Tunis
      language: "fr", // Afficher les résultats en français
    });

    map.addControl(geocoder);

    // Ajouter un listener pour écouter les clics sur la carte
    map.on("click", async (e) => {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const features = response.data.features;
        if (features.length > 0) {
          console.log("Détails de l'adresse :");
          console.log("Nom :", features[0].place_name);
          console.log("Coordonnées :", e.lngLat.lng, e.lngLat.lat);
          features[0].context.forEach((contextItem) => {
            console.log(
              `${contextItem.id.split(".")[0]} : ${contextItem.text}`
            );
          });
        }
      } catch (error) {
        console.error("Erreur lors de la recherche d'adresse :", error);
      }
    });

    // Nettoyer la carte lorsque le composant est démonté
    return () => map.remove();
  }, []);

  return (
    <div>
      <h1>Centres de traitement</h1>
      <div
        id="map"
        style={{ width: "100%", height: "400px", position: "relative" }}
      ></div>
      <style>
        {`
          .mapboxgl-ctrl-geocoder {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1;
          }
        `}
      </style>
    </div>
  );
};

export default CentreTraitement;

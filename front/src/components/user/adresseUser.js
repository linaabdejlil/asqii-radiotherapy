import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "../../style/adresseUser.css";

function AdresseUser({ closeModal, onAddressSelect }) {
  const mapContainer = useRef(null);
  const [address, setAddress] = useState({});

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaGVsYS10YWxiaSIsImEiOiJjbHZhenpxbHkwM2dsMmlsaDBmeGtpZmlnIn0.NcmkgMsBgMFCdZzcVsE3LQ";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-79.4512, 43.6568],
      zoom: 13,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: { color: "orange" },
    });

    map.addControl(geocoder, "top-left");

    geocoder.on("result", ({ result }) => {
      if (!result.context) {
        console.error("No context provided for this location");
        setAddress({});
        return;
      }

      const country =
        result.context.find((c) => c.id.startsWith("country"))?.text || "";
      const city = result.text || "";
      const postalCode =
        result.context.find((c) => c.id.startsWith("postcode"))?.text || "";

      const addressDetails = {
        country: country,
        city: city,
        postalCode: postalCode,
      };

      setAddress(addressDetails);
    });
  }, []);

  const handleValidate = () => {
    const fullAddress = `${address.country} ${address.city} ${address.postalCode}`;
    onAddressSelect(fullAddress);
    closeModal();
  };

  return (
    <div className="boxAdresseUser">
      <div className="groupAdresseUser">
        <div className="nouveau-AdresseUser-wrapperAdresseUser">
          <div className="AdresseUser">Ajouter Adresse</div>
          <div className="mapAdresse">
            <div ref={mapContainer} className="mapContainer" />
            <div className="loc">
              <div className="locc">Adresse</div>
              {(address.country || address.city || address.postalCode) && (
                <div className="addressDetails">
                  <div className="Localisation">
                    {address.country} {address.city} {address.postalCode}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="divAdresseUser">
          <button className="champ-textAdresseUser" onClick={handleValidate}>
            <label className="text-wrapperAdresseUser">Valider</label>
          </button>
          <button className="div-wrapperAdresseUser" onClick={closeModal}>
            <label className="text-wrapperAdresseUser">Annuler</label>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdresseUser;

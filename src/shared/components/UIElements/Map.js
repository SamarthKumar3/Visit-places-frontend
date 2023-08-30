import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = (props) => {
  const mapRef = useRef();

  const { center, zoom } = props;

  useEffect(() => {

    if (!center || typeof center !== 'object' || !center.lat || !center.lng) {
      console.error('Invalid center prop:', center);
      return;
    }

    const latitude = parseFloat(center.lat);
    const longitude = parseFloat(center.lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('Invalid latitude or longitude:', center.lat, center.lng);
      return;
    }

    if (latitude < -90 || latitude > 90) {
      console.error('Invalid latitude for center:', latitude);
      return;
    }

    if (longitude < -180 || longitude > 180) {
      console.error('Invalid longitude for center:', longitude);
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: zoom
    });
  
    new window.google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: map });
  }, [center, zoom]);  

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const HospitalMap = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTmapLoaded, setIsTmapLoaded] = useState(false);

  useEffect(() => {
    const checkTmapLoad = setInterval(() => {
      if (window.Tmapv2) {
        setIsTmapLoaded(true);
        clearInterval(checkTmapLoad);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (isTmapLoaded && !map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          const initMap = new window.Tmapv2.Map(mapContainerRef.current, {
            center: new window.Tmapv2.LatLng(latitude, longitude),
            zoom: 15
          });
          setMap(initMap);
          
          fetchHospitals(latitude, longitude);

        },
        (err) => {
          console.error("위치 정보를 가져오는 데 실패했습니다.", err);
          setError("현재 위치를 찾을 수 없습니다. 위치 권한을 허용해주세요.");
          setLoading(false);
        }
      );
    }
  }, [isTmapLoaded, map]);

  const fetchHospitals = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/center', {
        params: { lat: lat, lng: lon }
      });
      setHospitals(response.data);
      setError(''); 
    } catch (err) {
      console.error("병원 정보를 가져오는 데 실패했습니다.", err);
      setError("병원 정보를 불러오는 중 오류가 발생했습니다. 현재 위치만 표시됩니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (map && hospitals.length > 0) {
      hospitals.forEach(hospital => {
        const markerPosition = new window.Tmapv2.LatLng(hospital.latitude, hospital.longitude);
        const marker = new window.Tmapv2.Marker({
          position: markerPosition,
          map: map,
          title: hospital.name
        });
        marker.addListener("click", () => {
          new window.Tmapv2.InfoWindow({
            position: markerPosition,
            content: `
              <div style="padding: 10px;">
                <strong>${hospital.name}</strong><br>
                주소: ${hospital.address}<br>
                거리: ${hospital.distance} km<br>
                전화번호: ${hospital.phone}<br>
                분류: ${hospital.category}
              </div>
            `,
            type: 2,
            map: map
          });
        });
      });
    }
  }, [map, hospitals]);

  return (
    <div>
      <h2>내 주변 정신상담 병원 찾기</h2>
      {loading && <p>위치 정보와 병원 정보를 불러오는 중입니다...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="map_container" ref={mapContainerRef} style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default HospitalMap;
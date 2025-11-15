import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; // 기존 axios 인스턴스
import axios from 'axios';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import './Location.module.css'; // 기존 CSS

// --- Geolocation Promise (변경 없음) ---
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 이 브라우저에서 지원되지 않습니다.'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
};

// --- 지도 관련 설정 ---
// 지도의 기본 크기
const mapContainerStyle = {
  width: '100%',
  height: '400px', // 높이는 원하는 대로 조절
  borderRadius: '8px',
  marginBottom: '20px',
};

// Google Maps API 키
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// --- 컴포넌트 ---
const Location = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // 1. 현재 위치 좌표를 state로 관리
  const [currentLocation, setCurrentLocation] = useState(null);
  
  // 2. InfoWindow(마커 클릭 시 정보창) 관리를 위한 state
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        // Geolocation API (변경 없음)
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;
        
        // 3. 현재 위치 state에 저장
        setCurrentLocation({ lat: latitude, lng: longitude });

        // API 호출 (변경 없음)
        const response = await api.get('/api/center', {
          params: {
            lat: latitude,
            lng: longitude,
          },
        });
        
        const centersWithoutCoords = response.data;

         if (centersWithoutCoords.length === 0) {
          setCenters([]);
          return;
        }

        const geocodingPromises = centersWithoutCoords.map(async (center) => {
          try {
            const geocodeResponse = await axios.get(
              'https://maps.googleapis.com/maps/api/geocode/json',
              {
                params: {
                  address: center.address, // API에서 받은 주소
                  key: googleMapsApiKey,     // Google API 키
                },
              }
            );
            
            // Google Geocoding 결과에서 lat, lng 추출
            const location = geocodeResponse.data.results[0].geometry.location;
            
            // 기존 center 객체에 lat, lng를 추가하여 반환
            return {
              ...center,
              lat: location.lat,
              lng: location.lng,
            };
          } catch (geoError) {
            console.error('Geocoding error for address:', center.address, geoError);
            return null; // 변환 실패 시 null 반환
          }
        });

        // 모든 Geocoding Promise가 완료될 때까지 기다림
        const geocodedCenters = await Promise.all(geocodingPromises);
        
        // 4. (추가) Geocoding이 성공한 센터들만 state에 저장
        setCenters(geocodedCenters.filter(Boolean)); // filter(Boolean)은 null 값 제거

      } catch (error) {
        // ... (기존 에러 처리) ...
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  // 로딩 중 UI (간소화)
  if (loading) {
    return (
      <div className="center-container">
        <div className="loader"></div> 
        <p className="info-text">주변 센터 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 발생 UI
  if (errorMsg) {
    return (
      <div className="center-container">
        <p className="error-text">{errorMsg}</p>
      </div>
    );
  }

  // 4. 지도 + 리스트 렌더링
  return (
    <div className="center-list-container">
      <h2>🏥 주변 치료 센터/병원</h2>

      {/* API 키가 있어야 LoadScript가 지도를 로드합니다. */}
      {googleMapsApiKey && currentLocation ? (
        <LoadScript googleMapsApiKey={googleMapsApiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={14} // 줌 레벨 (숫자가 클수록 확대)
            center={currentLocation} // 지도의 중심을 현재 내 위치로
          >
            {/* 현재 내 위치 마커 (파란색 기본 아이콘) */}
            <MarkerF 
              position={currentLocation} 
              // '내 위치' 구분을 위한 커스텀 아이콘 (옵션)
              // icon={{
              //   url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              // }}
            />

            {/* 병원/센터 마커들 (API 응답 기반) */}
            {centers.map((item) => (
              <MarkerF
                key={item.name} // (key는 고유해야 함)
                position={{ lat: item.lat, lng: item.lng }} // API에서 받은 좌표
                onClick={() => {
                  setSelectedCenter(item); // 클릭 시 정보창 열기
                }}
              />
            ))}

            {/* 선택된 병원/센터의 정보창 */}
            {selectedCenter && (
              <InfoWindowF
                position={{ lat: selectedCenter.lat, lng: selectedCenter.lng }}
                onCloseClick={() => {
                  setSelectedCenter(null); // 닫기 버튼 클릭 시
                }}
              >
                {/* 정보창 내부 컨텐츠 */}
                <div className="info-window">
                  <h4>{selectedCenter.name}</h4>
                  <p>{selectedCenter.address}</p>
                  <a href={`tel:${selectedCenter.phone}`} className="item-phone">
                    📞 {selectedCenter.phone}
                  </a>
                </div>
              </InfoWindowF>
            )}

          </GoogleMap>
        </LoadScript>
      ) : (
        <p className="error-text">지도 API 키가 설정되지 않았거나 위치를 가져올 수 없습니다.</p>
      )}

      {/* --- 기존 리스트 렌더링 (변경 없음) --- */}
      {centers.length > 0 ? (
        <ul>
          {centers.map((item, index) => (
            <li key={item.name + index} className="item-container">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-address">{item.address}</p>
              <p className="item-info">
                거리: {item.distance}km | 분류: {item.category}
              </p>
              <a href={`tel:${item.phone}`} className="item-phone">
                📞 {item.phone} (전화 걸기)
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="center-container">
          <p className="info-text">주변에 등록된 센터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Location;
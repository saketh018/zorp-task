// import all the required packages and libraries
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

//used the set state to store data from api
const Map = () => {
  const [dataX, setDataX] = useState([]);
  const [selectedloc, setSelectedloc] = useState(null); // for the selected marker

  // fetching the data from the api and storing it locally
  const retrieveData = () => {
    const response = axios
      .get(
        "http://ec2-13-126-90-72.ap-south-1.compute.amazonaws.com:8082/user/1/tasks/"
      )
      .then((resp) => {
        setDataX(resp.data);
        return resp.data;
      })
      .catch((err) => {
        console.log("error: " + err);
      });
  };
  //providing duumy data in the beginning
  const center = {
    lat: 28.7041,
    lng: 77.1025,
  };
  //useeffect will tell it needs to do something after render
  useEffect(() => {
    retrieveData();
  }, []);
  //styling the maps
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };
  // for the center to be assigned to task 1
  const changeCord = () => {
    dataX.forEach(function (item) {
      if (item.seq === 1) {
        center.lat = item.location.lat;
        center.lng = item.location.lon;
      }
    });
  };
  //map implementation and components for map
  return (
    <LoadScript googleMapsApiKey="AIzaSyDafac2DZUblVP9asDxR8P7g22qME2smKE">
      {changeCord()}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={19}>
        <>
          {/* iterating over the data and assgining values using it */}
          {dataX.map((item) => (
            <Marker
              key={item.taskId}
              position={{ lat: item.location.lat, lng: item.location.lon }}
              name={item.seq}
              icon={{
                url:
                  "http://www.googlemapsmarkers.com/v1/" +
                  item.seq +
                  "/0099FF/",
              }}
              onClick={() => {
                setSelectedloc(item);
              }}
            />
          ))}
          {/* in case we select particluar marker then to get the details about it.info window is being used to display the data */}
          {selectedloc && (
            <InfoWindow
              onCloseClick={() => {
                setSelectedloc(null);
              }}
              position={{
                lat: selectedloc.location.lat,
                lng: selectedloc.location.lon,
              }}
            >
              <div>
                <h2>{selectedloc.name}</h2>
                <p>{selectedloc.customerInfo}</p>
              </div>
            </InfoWindow>
          )}
        </>
      </GoogleMap>
    </LoadScript>
  );
};
export default React.memo(Map);

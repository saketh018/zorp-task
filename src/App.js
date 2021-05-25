import axios from "axios";
import React,{useState,useEffect} from "react";
import {

  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";

function Map() {
const [data,setData]=useState([]);


// const retrieveData= async()=>
// {
//   const response = await axios.get("http://ec2-13-126-90-72.ap-south-1.compute.amazonaws.com:8082/user/1/tasks/").then();
//   return response.data;
// }
//  useEffect (()=>{
// const getAllData = async ()=>
// {
//   const allData=await retrieveData();
//   setData(allData);
// };
// getAllData();
//  },[data]);
 useEffect(async () => {
  const result = await axios(
    `http://ec2-13-126-90-72.ap-south-1.compute.amazonaws.com:8082/user/1/tasks/`
  );

  setData(result.data);
});
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
        >
          </GoogleMap>
          
  );
}
const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDafac2DZUblVP9asDxR8P7g22qME2smKE&v=3.exp&libraries=geometry,drawing,places`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  );
}

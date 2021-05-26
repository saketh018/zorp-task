import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";

const Map = () => {
  /*
    Created By Saketh G
    Timestamp: 1622033190
    ------------------------
    Map Component: 
      - retreiveData(): perfrom axios api call from the server.
      - useEffect(): LifeCycle Hook for performing actions prior to render
      - changeCord(): Re-render with First Co-ordinate

    Using Google Maps v9.4.5 --
    Exposes GoogleMap, Marker, InfoWindow, LoadScript
      -GoogleMap: 
        state: GoogleMapState
        componentDidMount: void

        Note: Instead of ref prop, you need to use onLoad callback on <GoogleMap /> component.

      -Marker:
        marker: google.maps.Marker | undefined
        componentDidMount(): void
        componentDidUpdate(prevProps: MarkerProps): void
        componentWillUnmount(): void
        render(): React.ReactNode

          --args: 
          position	  LatLng | LatLngLiteral	        Required	  Marker position.
          icon	      string | Icon | Symbol |        undefined		Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url.
          onClick	    ((e: MapMouseEvent) => void) |  undefined		This event is fired when the marker icon was clicked.

      -WindowInfo:
        state: InfoWindowState
        open: (infoWindow: google.maps.InfoWindow, anchor?: google.maps.MVCObject | undefined) => void

        --args:
        onCloseClick	(() => void) | undefined		          This event is fired when the close button was clicked.
        position	    LatLng | LatLngLiteral | undefined		The LatLng at which to display this InfoWindow. If the InfoWindow is opened with an anchor, the anchor's position will be used instead.
        
      -LoadScript:
        state: loaded: boolean
        
    -------------------------
  */

  const [dataX, setDataX] = useState([]);
  const [selectedloc, setSelectedloc] = useState(null); // for the selected marker

  /*
    Axios --
      Asynchronous Data Fechting via `retrieveData` function.
      Response handled and state changes made according to React Virtual DOM.
      Resp. Status other than 200, i.e 500 (Internal Server Error) caught (err)

      Data Endpoint --
      http://ec2-13-126-90-72.ap-south-1.compute.amazonaws.com:8082/user/1/tasks/
  */
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

  /*
    Holisting center data via Javascript Engine to --
      latitude: 28.7041 `Number`
      longitude: 77.1025 `Number`
    Changes to the variable may occur during render function.
    Changes might re-render the DOM. 
  */
  let center = {
    lat: 28.7041,
    lng: 77.1025,
  };

  /*
    **** LIFE CYCLE METHOD ****
    Perform Side effects to the Map Function Component
    [] -> Perform the api call with no additional re-render
    **** **** **** **** **** ****
  */
  useEffect(() => {
    retrieveData();
  }, []);

  /*
    CSS Customizations applied on App
    * Occupy total height on the screen.
                        (in terms of vh)
    * Occupy total width on the screen.
                        (in terms of %)
  */
  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  /*
    useState Lifecycle Hook, used to store data.
    (dataX)
    Iterate Objects to find the initial object required
                  (**as per sequence id's)
  */
  const changeCord = () => {
    dataX.forEach(function (item) {
      if (item.seq === 1) {
        center.lat = item.location.lat;
        center.lng = item.location.lon;
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDafac2DZUblVP9asDxR8P7g22qME2smKE">
      {changeCord()}
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={19}>
        <>
          {/* 
                Iterate over the existing objects
                assign `key`, `position`,`name`, `icon`, `onClick`    
                Possible Re-Render: 3 (THREE) times.
                RENDER (1): Render map with Inital hard-coded data to avoid (undefined || null)
                RENDER (2): Render map with Data and Center Position of Marker 1
                RENDER (3): Fetch the required Image Marker with Numerical View

                **NOTE** --
                    RE-RENDER Does not effect the load time of the Component.
                                                                                  */}
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

          {/*
              InfoWindow --
                  Render Modal on Map View.
                  Data may change on second Re-render.
                  
                  --position (sample args):
                    lat: 28.7041 `Number`
                    lng: 77.1025 `Number`
                  --api_args:
                    Name: Sample_String `String`
                    Customer Info: Sample_String `String`

                                                      */}
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

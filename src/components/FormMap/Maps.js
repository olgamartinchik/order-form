import React, { useState, useRef, useEffect } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
import "./FormMap.scss";
import {
  BASE_TARIFF_LESS_50_KM,
  RATIO_PER_KM,
  API_KEY,
} from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useSelector } from "react-redux";
import { calculateDistance } from "../../utils/utils";

const Maps = (props) => {
  const yMapsState = {
    apikey: API_KEY,
    ns: "use-load-option",
    load: "Map,Placemark",
  };
  const mapState = {
    center: [53.902735, 27.555696],
    zoom: 9,
  };

  const [ymaps, setYmaps] = useState(null);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.Form);
  console.log("typeAuto1", props.typeAuto, state.auto);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        ref.routePanel.options.set({
          types: { auto: true },
        });
        const route = await ref.routePanel.getRouteAsync();
        route.model.events.add("requestsuccess", () => {
          handleRequestSuccess(route);
        });
      }
    } catch {
      throw new Error();
    }
  };
  const handleRequestSuccess = async (route) => {
    const activeRoute = route.getActiveRoute();
    let length;
    let duration;
    let newBoundedBy;
    let newPrice;
    let addresses;

    if (activeRoute) {
      console.log("active route");
      length = route.getActiveRoute().properties.get("distance");

      duration = route.getActiveRoute().properties.get("duration").text;

      newBoundedBy = route.getActiveRoute().properties.get("boundedBy");
      console.log("route.getActiveRoute()", route.getActiveRoute());

      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto
      );

      addresses = await getAddress(ymaps, newBoundedBy);
      // console.log("address", addresses);
    }
    dispatch(
      AddFormAction({
        price: newPrice,
        distance: length && length.text,
        time: duration,
        from: addresses ? addresses[0] : null,
        to: addresses ? addresses[1] : null,
      })
    );
  };

  const getAddress = async (ymaps, boundedBy) => {
    let from = null;
    let to = null;
    console.log("boundedBy", boundedBy);
    if (boundedBy) {
      const resFrom = await ymaps.geocode(boundedBy[0]);
      from = resFrom.geoObjects.get(0).properties.get("text");
      const resTo = await ymaps.geocode(boundedBy[1]);
      to = resTo.geoObjects.get(0).properties.get("text");
    }
    console.log("from, to2", from, to);
    return [from, to];
  };

  return (
    <div className='map-container'>
      <YMaps className='yMaps' query={yMapsState}>
        <div>
          <h2>Маршрут</h2>
          <Map
            defaultState={mapState}
            onLoad={(ymaps) => setYmaps(ymaps)}
            width={"100%"}
            height={"350px"}
            modules={["geocode"]}
          >
            <RoutePanel
              instanceRef={(ref) => createRoutPanel(ref)}
              options={{
                float: "right",
                showHeader: true,
                title: "Расчёт поездки",
                autofocus: false,
              }}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  );
};
export default Maps;

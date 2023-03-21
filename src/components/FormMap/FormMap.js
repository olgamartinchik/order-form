import React, { useState } from "react";
import {
  YMaps,
  Map,
  RoutePanel,
  FullscreenControl,
} from "@pbe/react-yandex-maps";
import "./FormMap.scss";

const FormMap = () => {
  const yMapsState = {
    apikey: "3e81625e-57df-45de-9974-eb3b13e85ceb",
    ns: "use-load-option",
    load: "Map,Placemark,control.ZoomControl",
  };
  const mapState = {
    center: [53.902735, 27.555696],
    zoom: 9,
    controls: ["zoomControl"],
  };

  const [ymaps, setYmaps] = useState(null);

  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [time, setTime] = useState(null);
  const [boundedBy, setBoundedBy] = useState(null);

  const createRoutPanel = (ref) => {
    // console.log("ymaps1", ymaps);
    // Стоимость за километр.
    const DELIVERY_TARIFF = 20;
    // Минимальная стоимость.
    const MINIMUM_COST = 500;

    if (ref) {
      ref.routePanel.options.set({
        types: { auto: true },
      });

      ref.routePanel.getRouteAsync().then((route) => {
        route.model.setParams({ result: 1 }, true);
        route.model.events.add("requestsuccess", () => {
          const activeRoute = route.getActiveRoute();
          if (activeRoute) {
            const length = route.getActiveRoute().properties.get("distance");
            const duration = route.getActiveRoute().properties.get("duration");

            const newDoundedBy = route
              .getActiveRoute()
              .properties.get("boundedBy");

            const newPrice = calculate(
              Math.round(length.value / 1000),
              DELIVERY_TARIFF,
              MINIMUM_COST
            );

            setPrice(newPrice);
            setBoundedBy(newDoundedBy);
            setDistance(length.text);
            setTime(duration.text);
            console.log("ymaps", ymaps);
            console.log("boundedBy", boundedBy);

            ymaps.geocode(boundedBy[0]).then((res) => {
              const firstGeoObject =
                res.geoObjects.get(0).properties._data.text;
              setFrom(firstGeoObject);
              console.log("firstGeoObject", firstGeoObject);
            });

            ymaps.geocode(boundedBy[1]).then((res) => {
              const secondGeoObject =
                res.geoObjects.get(0).properties._data.text;
              setTo(secondGeoObject);
              console.log("secondGeoObject", secondGeoObject);
            });

            // const balloonContentLayout = ymaps.templateLayoutFactory
            //   .createClass(`"<span>Расстояние: " +
            // ${distance} +
            // ".</span><br/>" +
            // '<span style="font-weight: bold; font-style: italic">Стоимость доставки: ' +
            // ${price} +
            // " р.</span>"`);
            // console.log("balloonContentLayout", balloonContentLayout);

            // route.options.set(
            //   "routeBalloonContentLayout",
            //   balloonContentLayout
            // );
            // // Откроем балун.
            // activeRoute.balloon.open();
          } else {
            setPrice(null);
            setBoundedBy(null);
            setDistance(null);
            setTime(null);
            setTo(null);
            setFrom(null);
          }
        });
      });
    }
  };
  const calculate = (routeLength, DELIVERY_TARIFF, MINIMUM_COST) => {
    return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
  };

  return (
    <div className='map-container'>
      <YMaps className='yMaps' query={yMapsState}>
        <div>
          <h2>Маршрут</h2>
          <Map
            defaultState={mapState}
            // instanceRef={map}
            onLoad={(ymaps) => setYmaps(ymaps)}
            width={"100%"}
            height={"300px"}
            modules={["geocode"]}
          >
            <FullscreenControl options={{ float: "left" }} />

            <RoutePanel
              instanceRef={(ref) => createRoutPanel(ref)}
              options={{
                float: "right",
                showHeader: true,
                title: `Расчёт поездки ${
                  distance && price
                    ? "Расстояние: " +
                      distance +
                      " Стоимость: " +
                      price +
                      " бел.p."
                    : ""
                }`,
              }}
            />
          </Map>
        </div>
      </YMaps>
      {distance && price && (
        <p>
          Расстояние: {distance}, Стоимость: {price}, Продолжительность:
          {time}
        </p>
      )}
      {from && to && (
        <p>
          from: {from}, to: {to}
        </p>
      )}
    </div>
  );
};
export default FormMap;

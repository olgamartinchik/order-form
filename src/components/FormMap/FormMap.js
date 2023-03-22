import React, { useState } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
import "./FormMap.scss";
import { BASE_TARIFF_LESS_50_KM, RATIO_PER_KM, API_KEY } from "../../constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";

const FormMap = (props) => {
  // console.log("typeAuto1", props.typeAuto);
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

  const [price, setPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [time, setTime] = useState(null);
  const dispatch = useDispatch();

  const createRoutPanel = (ref) => {
    // console.log("ymaps1", ymaps);

    if (ref) {
      ref.routePanel.options.set({
        types: { auto: true },
        autofocus: false,
      });

      ref.routePanel
        .getRouteAsync()
        .then((route) => {
          route.model.setParams({ result: 1 }, true);
          route.model.events.add("requestsuccess", () => {
            const activeRoute = route.getActiveRoute();
            if (activeRoute) {
              const length = route.getActiveRoute().properties.get("distance");
              const duration = route
                .getActiveRoute()
                .properties.get("duration");

              const newBoundedBy = route
                .getActiveRoute()
                .properties.get("boundedBy");

              const newPrice = calculate(Math.round(length.value / 1000));

              setPrice(newPrice);
              setDistance(length.text);
              setTime(duration.text);
              // console.log("ymaps", ymaps);

              ymaps
                .geocode(newBoundedBy[0])
                .then((res) => {
                  const firstGeoObject =
                    res.geoObjects.get(0).properties._data.text;
                  setFrom(firstGeoObject);
                  // console.log("firstGeoObject", firstGeoObject);
                })
                .catch((error) => {
                  throw new Error(error);
                });

              ymaps
                .geocode(newBoundedBy[1])
                .then((res) => {
                  const secondGeoObject =
                    res.geoObjects.get(0).properties._data.text;
                  setTo(secondGeoObject);
                  // console.log("secondGeoObject", secondGeoObject);
                })
                .catch((error) => {
                  throw new Error(error);
                });
            } else {
              setPrice(null);
              setDistance(null);
              setTime(null);
              setTo(null);
              setFrom(null);
            }
            dispatch(
              AddFormAction({
                price,
                distance,
                from,
                to,
                auto: props.typeAuto,
              })
            );
          });
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };

  const calculate = (routeLength) => {
    let cost;
    if (routeLength <= 50) {
      cost = BASE_TARIFF_LESS_50_KM[props.typeAuto];
    } else {
      cost = Math.round(routeLength * RATIO_PER_KM[props.typeAuto]);
    }
    return cost;
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
            height={"350px"}
            modules={["geocode"]}
          >
            <RoutePanel
              instanceRef={(ref) => createRoutPanel(ref)}
              options={{
                float: "right",
                showHeader: true,
                title: "Расчёт поездки",
                // title: `Расчёт поездки ${
                //   distance && price
                //     ? "Расстояние: " +
                //       distance +
                //       " Стоимость: " +
                //       price +
                //       " бел.p."
                //     : ""
                // }`,
              }}
            />
          </Map>
        </div>
      </YMaps>
      {/* {distance && price && (
        <p>
          Расстояние: {distance}, Стоимость: {price}, Продолжительность:
          {time}
        </p>
      )}
      {from && to && (
        <p>
          from: {from}, to: {to}
        </p>
      )} */}
    </div>
  );
};
export default FormMap;

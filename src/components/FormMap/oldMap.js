import React, { useState, useRef } from "react";
import { YMaps, Map, RoutePanel, GeoObject } from "@pbe/react-yandex-maps";
import "./MapLayout.scss";
import { API_KEY } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useSelector } from "react-redux";
import { calculateDistance } from "../../utils/utils";
import minskData from "../../utils/minsk.json";

const MapLayout = (props) => {
  const yMapsState = {
    apikey: API_KEY,
    ns: "use-load-option",
    load: "Map,Placemark,GeoObject",
    // load: "package.full",
  };
  const mapState = {
    center: [53.902735, 27.555696],
    zoom: 9,
  };

  const mapRef = useRef(null);
  const [minskPolygon, setMinskPolygon] = useState(null);
  const [ymapsRef, setYmapsRef] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [routeModel, setRouteModel] = useState(null);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.Form);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        // ref.geometry.events.add('change', (e: any) => setCoordinates(e.get('newCoordinates')));

        // ref.routePanel.options.set({
        //   types: { auto: true },
        //   allowSwitch: false,
        // });

        ref.routePanel.state.set({
          from,
          to,
        });

        console.log(" ref.routePanel.model", ref.routePanel);
        const route = await ref.routePanel.getRouteAsync();
        console.log("route", route);
        console.log("route.model", route.model);
        setRouteModel(route.model);
        // if (route) {
        //   route.model.setParams({ results: 1 });
        // }
        //
        route.model.events
          .add("requestsuccess", (e) => {
            // console.log("e", e);
            // .originalEvent.target
            // setFromCoord(
            // e.originalEvent.target.properties._data.waypoints[0].coordinate
            // );
            // setToCoord(e.target.waypoints[1].coordinate);
            // console.log("FromCoord, ToCoord", fromCoord, toCoord);
            handleRequestSuccess(route);
          })
          .add("requestfail", (event) => {
            console.log("Error: " + event.get("error").message);
          });
        // route.model.destroy();
      }
    } catch (e) {
      throw new Error(e);
    }
  };
  const handleRequestSuccess = async (route) => {
    const activeRoute = route.getActiveRoute();
    console.log("activeRoute", activeRoute);

    let length;
    let duration;
    let newPrice;
    let pathsObjects;
    let edges = [];
    let distanceOutsideMinsk = 0;
    let distanceInsideMinsk = 0;

    const geoObjectsLength = mapRef.current.geoObjects.getLength();
    console.log("x1x1x1x1x1x1x1", geoObjectsLength);

    if (geoObjectsLength > 1) {
      // mapRef.current.geoObjects.removeAll();
      // mapRef.current.destroy();
      // console.log("mapRef.current before clean", mapRef.current);
      // console.log("x1x1x1x1x1x1x1 clean", geoObjectsLength);
    }
    mapRef.current.geoObjects.add(minskPolygon);
    // console.log("minskPolygon", minskPolygon);
    // console.log("mapRef.current after clean", mapRef.current);

    if (activeRoute) {
      // console.log("get activeRoute coord", route.getCoordinates());
      console.log("edges1", edges);

      length = route.getActiveRoute().properties.get("distance");
      duration = route.getActiveRoute().properties.get("duration").text;

      // const geoObjectsLength = mapRef.current.geoObjects.getLength();
      // if (geoObjectsLength > 1) {
      //   console.log("x1x1x1x1x1x1x1", geoObjectsLength);
      //   mapRef.current.geoObjects.removeAll();
      //   // mapRef.current.destroy();
      // }
      // mapRef.current.geoObjects.add(minskPolygon);

      // const responseRoute = await ymapsRef.route([from, to]);
      // // console.log("responseRoute", responseRoute);
      // ymapsRef.geoObjects.add(responseRoute);
      // pathsObjects = ymapsRef.geoQuery(responseRoute.getPaths());
      // // console.log("responseRoute", responseRoute.requestPoints);

      // pathsObjects.each((path) => {
      //   const coordinates = path.geometry.getCoordinates();
      //   for (let i = 1, l = coordinates.length; i < l; i++) {
      //     edges.push({
      //       type: "LineString",
      //       coordinates: [coordinates[i], coordinates[i - 1]],
      //     });
      //     // console.log("edges", edges);
      //   }
      // });

      // // mapRef.current.geoObjects.add(minskPolygon);
      // // console.log("mapRef", mapRef);
      // const routeObjects = ymapsRef
      //   .geoQuery(edges)
      //   .add(responseRoute)
      //   .addToMap(mapRef.current);

      // // console.log("routeObjects", routeObjects);

      // // Найдем все объекты, попадающие внутрь МКАД.
      // const objectsInMinsk = routeObjects
      //   .searchInside(minskPolygon)
      //   .each((path, i) => {
      //     // console.log("path", path);
      //     if (path && i < 10) {
      //       let count = 0;
      //       count += path.geometry.getDistance();
      //       distanceInsideMinsk = count;
      //       // console.log("distanceInsideMinsk", distanceInsideMinsk);
      //     }
      //   });

      // // Найдем объекты, пересекающие МКАД.
      // const boundaryObjects = routeObjects.searchIntersect(minskPolygon);

      // // Объекты за пределами МКАД получим исключением полученных выборок из
      // // исходной.
      // routeObjects
      //   .remove(objectsInMinsk)
      //   .remove(boundaryObjects)
      //   .each((path, i) => {
      //     // console.log("path", path);
      //     if (path && i < 10) {
      //       let count = 0;
      //       count += path.geometry.getDistance();
      //       distanceOutsideMinsk = count;
      //       // console.log("distanceOutsideMinsk", distanceOutsideMinsk);
      //     }
      //   });

      //calculate cost
      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto,
        distanceInsideMinsk,
        distanceOutsideMinsk
      );

      // add balloon
      const balloonContentLayout = createBalloonLayout(
        ymapsRef,
        length.text,
        newPrice,
        duration
      );
      setBallon(balloonContentLayout, route);
      activeRoute.balloon.open();

      dispatch(
        AddFormAction({
          price: newPrice,
          distance: length && length.text,
          time: duration,
          auto: props.typeAuto,
          payment: "cash",
        })
      );
    }
  };
  const createBalloonLayout = (ymaps, distance, newPrice, duration) => {
    return ymaps.templateLayoutFactory.createClass(
      "<span>Расстояние: " +
        distance +
        ".</span><br/>" +
        "<span>Длительность: " +
        "~" +
        duration +
        ".</span><br/>" +
        '<span  style="font-weight: bold; font-style: italic">Стоимость трансфера: ' +
        "~" +
        '<span class = "ballon-price">' +
        newPrice +
        "</span>" +
        " б.р.</span><br/>" +
        '<span  style="color: red; font-style: italic">* Итоговую стоимость уточняйте у оператора</span>'
    );
  };
  const setBallon = (balloonContentLayout, route) => {
    route.options.set("routeBalloonContentLayout", balloonContentLayout);
  };

  const loadSuggest = (ymaps) => {
    console.log("control", mapRef.current.controls);

    // .get("RoutPanelControl")
    setYmapsRef(ymaps);
    const polygon = new ymaps.Polygon(minskData.coordinates);
    polygon.options.set("visible", true);
    mapRef.current.geoObjects.add(polygon);
    setMinskPolygon(polygon);

    const suggestView = new ymaps.SuggestView("from");
    suggestView.events.add("select", (e) => {
      console.log("+++++", routeModel);
      const from = e.get("item");
      setFrom(from.displayName);
      dispatch(
        AddFormAction({
          from: from.displayName,
        })
      );
    });
    const suggestView2 = new ymaps.SuggestView("to");
    suggestView2.events.add("select", (e) => {
      const to = e.get("item");
      setTo(to.displayName);
      dispatch(
        AddFormAction({
          to: to.displayName,
        })
      );
    });
  };

  return (
    <div className='map-container'>
      <YMaps query={yMapsState}>
        <div>
          <h2>Маршрут</h2>
          <div className='inputs_container'>
            <input
              type='text'
              className='input from-control map-input'
              id='from'
              name='from'
              placeholder='Откуда'
              {...props.register("from", { required: true })}
            />
            <input
              type='text'
              className='input to-control map-input'
              id='to'
              name='to'
              placeholder='Куда'
              {...props.register("to", { required: true })}
            />
          </div>

          <Map
            defaultState={mapState}
            instanceRef={mapRef}
            onLoad={(ymaps) => loadSuggest(ymaps)}
            width={"100%"}
            height={"300px"}
            modules={[
              "geocode",
              // "multiRouter.MultiRoute",
              "route",
              "geoQuery",
              "SuggestView",
              "Polygon",
              "templateLayoutFactory",
              "GeoObject",
              "GeoObjectArray",
              "GeoObjectCollection",
              "GeoQueryResult",
              "ObjectManager",
            ]}
            controls={["routePanelControl"]}
          >
            <RoutePanel
              instanceRef={(ref) => createRoutPanel(ref)}
              options={{
                visible: false,
                reverseGeocoding: true,
                allowSwitch: false,
                types: { auto: true },
                allowSwitch: false,
              }}
              state={{
                fromEnabled: true,
                toEnabled: true,
              }}
              modules={["templateLayoutFactory"]}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  );
};
export default MapLayout;

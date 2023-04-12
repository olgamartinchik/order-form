import React, { useState, useRef, useEffect } from "react";
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
    load: "Map,Placemark",
    // load: "package.full",
  };
  const mapState = {
    center: [53.902735, 27.555696],
    zoom: 9,
  };
  const routPanelRef = useRef(null);
  const mapRef = useRef(null);
  const [minskPolygon, setMinskPolygon] = useState(null);
  const [ymapsRef, setYmapsRef] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [routeModel, setRouteModel] = useState(null);
  const [distInside, setDistInside] = useState(0);
  const [distOutside, setDistOutside] = useState(0);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.Form);
  useEffect(() => {
    if (routeModel) {
      routeModel.setParams({ results: 1 });
    }
  }, [routeModel]);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        ref.routePanel.state.set({
          from,
          to,
        });

        const route = await ref.routePanel.getRouteAsync();

        setRouteModel(route.model);

        route.model.events
          .add("requestsuccess", () => {
            handleRequestSuccess(route);
          })
          .add("requestfail", (event) => {
            console.log("Error: " + event.get("error").message);
          });
      }
    } catch (e) {
      throw new Error(e);
    }
  };
  const handleRequestSuccess = async (route) => {
    let length;
    let duration;
    let newPrice;

    const activeRoute = route.getActiveRoute();
    console.log("activeRoute", activeRoute);

    if (activeRoute) {
      const coordFrom = route.model.properties._data.waypoints[0].coordinates;
      const coordTo = route.model.properties._data.waypoints[1].coordinates;
      console.log("coordFrom coordTo", coordFrom, coordTo);

      let pathsObjects;
      let edges = [];
      let distanceOutsideMinsk = 0;
      let distanceInsideMinsk = 0;

      const responseRoute = await ymapsRef.route([from, to]);

      console.log("responseRoute+++++++++++", responseRoute);

      pathsObjects = ymapsRef.geoQuery(responseRoute.getPaths());

      pathsObjects.each((path) => {
        const coordinates = path.geometry.getCoordinates();
        for (let i = 1, l = coordinates.length; i < l; i++) {
          edges.push({
            type: "LineString",
            coordinates: [coordinates[i], coordinates[i - 1]],
          });
          // console.log("edges", edges);
        }
      });

      const routeObjects = ymapsRef
        .geoQuery(edges)
        .add(responseRoute.getWayPoints())
        .addToMap(mapRef.current);

      // Найдем все объекты, попадающие внутрь МКАД.
      const objectsInMinsk = routeObjects
        .searchInside(minskPolygon)
        .each((path, i) => {
          // console.log("path", path);
          if (path && i < 10) {
            let count = 0;
            count += path.geometry.getDistance();
            distanceInsideMinsk = count;
            // distanceInsideMinsk += path.geometry.getDistance();
            // console.log("distanceInsideMinsk", distanceInsideMinsk);
          }
        });
      // setDistInside(distanceInsideMinsk);

      // Найдем объекты, пересекающие МКАД.
      const boundaryObjects = routeObjects.searchIntersect(minskPolygon);

      // Объекты за пределами МКАД получим исключением полученных выборок из
      // исходной.
      routeObjects
        .remove(objectsInMinsk)
        .remove(boundaryObjects)
        .each((path, i) => {
          // console.log("path", path);
          if (path && i < 10) {
            let count = 0;
            count += path.geometry.getDistance();
            distanceOutsideMinsk = count;
            // distanceOutsideMinsk += path.geometry.getDistance();
            // console.log("distanceOutsideMinsk", distanceOutsideMinsk);
          }
        });

      routeObjects.removeFromMap(mapRef.current);

      // const deletedRoute =
      // mapRef.current.geoObjects.removeFromGroup(routeObjects);
      // console.log("deletedRoute", deletedRoute);

      ////

      length = route.getActiveRoute().properties.get("distance");
      duration = route.getActiveRoute().properties.get("duration").text;

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
    setYmapsRef(ymaps);

    const polygon = new ymaps.Polygon(minskData.coordinates);
    polygon.options.set("visible", false);
    mapRef.current.geoObjects.add(polygon);
    setMinskPolygon(polygon);

    const suggestView = new ymaps.SuggestView("from");
    suggestView.events.add("select", (e) => {
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
    // if (ymaps) {
    //   const control = ymaps.control;
    //   console.log("ymaps", ymaps, control);
    // }
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
              // instanceRef={routPanelRef}
              // onChange={(routePanel) => createRoutPanel(routePanel)}
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

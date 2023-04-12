import React, { useState, useRef, useEffect } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
import "./MapLayout.scss";
import { API_KEY } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useSelector } from "react-redux";
import { calculateDistance } from "../../utils/utils";
import minskData from "../../utils/minsk.json";

export const MapLayout = (props) => {
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
  // const routPanelRef = useRef(null);
  const mapRef = useRef(null);
  const [minskPolygon, setMinskPolygon] = useState(null);
  const [ymapsRef, setYmapsRef] = useState(null);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromCoord, setFromCoord] = useState(null);
  const [toCoord, setToCoord] = useState(null);
  const [routeModel, setRouteModel] = useState(null);
  // const [distInside, setDistInside] = useState(0);
  // const [distOutside, setDistOutside] = useState(0);
  const [routePanelControl, setRoutePanelControl] = useState(null);
  // const [responseRoute, setResponseRoute] = useState(null);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.Form);
  useEffect(() => {
    if (routeModel) {
      routeModel.setParams({ results: 1 });
    }
  }, [routeModel]);
  useEffect(() => {
    if ((from || to) && routePanelControl) {
      routePanelControl.routePanel.state.set({
        from,
        to,
      });
      console.log("(from || to) && routePanelControl", from, to);
    }
  }, [from, to, routePanelControl]);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        setRoutePanelControl(ref);

        const route = await ref.routePanel.getRouteAsync();

        setRouteModel(route.model);

        route.model.events
          .once("requestsuccess", () => {
            handleRequestSuccess(route);
          })
          .once("requestfail", (event) => {
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
    let coordFrom;
    let coordTo;

    const activeRoute = route.getActiveRoute();
    // console.log("activeRoute", activeRoute);

    if (activeRoute) {
      coordFrom = routeModel.properties._data.waypoints[0].coordinates;
      coordTo = routeModel.properties._data.waypoints[1].coordinates;
      console.log("coordFrom coordTo", coordFrom, coordTo);

      let pathsObjects;
      let edges = [];
      let distanceOutsideMinsk = 0;
      let distanceInsideMinsk = 0;
      // let routeObjects;
      let responseRoute = null;

      mapRef.current.geoObjects.removeAll();
      mapRef.current.geoObjects.add(minskPolygon);

      console.log("state [from, to]", [state.from, state.to]);
      const points = route.model.getReferencePoints();
      if (
        state.from === points[0] &&
        state.to === points[1] &&
        responseRoute === null
      ) {
        responseRoute = await ymapsRef.route([state.from, state.to]);
      }

      if (responseRoute) {
        console.log(
          "responseRoute+++++++++++",
          responseRoute,
          responseRoute.requestPoints
        );
        console.log("ymapsRef+++++++++++", ymapsRef);

        // console.log("responseRoute.getPaths()", responseRoute.getPaths());
        // console.log(
        //   "activeRoute.getPaths()",
        //   activeRoute,
        //   activeRoute.getPaths(),
        //   route
        // );

        pathsObjects = ymapsRef.geoQuery(responseRoute.getPaths());
        // console.log("pathsObjects", pathsObjects);
        // console.log(
        //   "pathsObjects1111",
        //   ymapsRef.geoQuery(activeRoute.getPaths())
        // );

        pathsObjects.each((path) => {
          const coordinates = path.geometry.getCoordinates();
          for (let i = 1, l = coordinates.length; i < l; i++) {
            edges.push({
              type: "LineString",
              coordinates: [coordinates[i], coordinates[i - 1]],
            });
          }
        });

        const routeObjects = ymapsRef.geoQuery(edges).addToMap(mapRef.current);

        // Найдем все объекты, попадающие внутрь МКАД.
        const objectsInMinsk = routeObjects
          .searchInside(minskPolygon)
          .each((path, i) => {
            if (path && i < 5) {
              // let count = 0;
              // count += path.geometry.getDistance();
              // distanceInsideMinsk = count;
              distanceInsideMinsk += path.geometry.getDistance();
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
            if (path && i < 5) {
              // let count = 0;
              // count += path.geometry.getDistance();
              // distanceOutsideMinsk = count;
              distanceOutsideMinsk += path.geometry.getDistance();
              // console.log("distanceOutsideMinsk", distanceOutsideMinsk);
            }
          });

        //Удаление маршрута и меток с карты и очистка данных
        routeObjects && routeObjects.removeFromMap(ymapsRef);
        routeObjects && routeObjects.removeFromMap(mapRef.current);
        responseRoute && mapRef.current.geoObjects.remove(responseRoute);
        routeObjects && mapRef.current.geoObjects.remove(routeObjects);
        for (var i = 0, l = edges.length; i < l; i++) {
          mapRef.current.geoObjects.remove(edges[i]);
        }
        edges = [];
      }
      //

      length = route.getActiveRoute().properties.get("distance");
      duration = route.getActiveRoute().properties.get("duration").text;

      //calculate cost
      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto,
        distanceInsideMinsk,
        distanceOutsideMinsk,
        coordFrom,
        coordTo
      );
      // distanceOutsideMinsk = 0;
      // distanceInsideMinsk = 0;
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
    console.log("polygon", polygon);
    setMinskPolygon(polygon);

    const suggestView = new ymaps.SuggestView("from");
    console.log("suggestView", suggestView);
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
                // reverseGeocoding: true,
                allowSwitch: false,
                types: { auto: true },
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

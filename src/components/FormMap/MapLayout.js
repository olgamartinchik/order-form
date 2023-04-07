import React, { useState } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
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
  const mapRef = React.createRef(null);
  const [minskPolygon, setMinskPolygon] = useState(null);
  const [ymapsRef, setYmapsRef] = useState(null);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.Form);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        ref.routePanel.options.set({
          types: { auto: true },
          allowSwitch: false,
        });
        ref.routePanel.state.set({
          from: state.from,
          to: state.to,
        });

        const route = await ref.routePanel.getRouteAsync();
        route.model.events.add("requestsuccess", () => {
          handleRequestSuccess(route);
        });
      }
    } catch (e) {
      throw new Error(e);
    }
  };
  const handleRequestSuccess = async (route) => {
    const activeRoute = route.getActiveRoute();
    let length;
    let duration;
    let newPrice;
    let pathsObjects;

    if (activeRoute) {
      length = route.getActiveRoute().properties.get("distance");
      duration = route.getActiveRoute().properties.get("duration").text;

      const edges = [];
      const responseRoute = await ymapsRef.route([state.from, state.to]);

      pathsObjects = ymapsRef.geoQuery(responseRoute.getPaths());

      pathsObjects.each((path) => {
        const coordinates = path.geometry.getCoordinates();
        // console.log("coordinates", coordinates);
        for (var i = 1, l = coordinates.length; i < l; i++) {
          edges.push({
            type: "LineString",
            coordinates: [coordinates[i], coordinates[i - 1]],
          });
          // console.log("edges", edges);
        }
      });
      mapRef.current.geoObjects.add(minskPolygon);
      console.log("mapRef", mapRef);
      const routeObjects = ymapsRef
        .geoQuery(edges)
        // .add(responseRoute.getWayPoints())
        // .add(responseRoute.getViaPoints())
        // .setOptions("strokeWidth", 3)
        .addToMap(mapRef.current);

      console.log(
        "routeObjects,",
        routeObjects,
        responseRoute.getWayPoints(),
        responseRoute.getViaPoints()
      );
      // Найдем все объекты, попадающие внутрь МКАД.
      const objectsInMinsk = routeObjects.searchInside(minskPolygon);
      // Найдем объекты, пересекающие МКАД.
      const boundaryObjects = routeObjects.searchIntersect(minskPolygon);

      // Раскрасим в разные цвета объекты внутри, снаружи и пересекающие МКАД.
      // boundaryObjects.setOptions({
      //   strokeColor: "#06ff00",
      //   preset: "islands#greenIcon",
      // });
      // objectsInMinsk.setOptions({
      //   strokeColor: "#ff0005",
      //   preset: "islands#redIcon",
      // });

      // Объекты за пределами МКАД получим исключением полученных выборок из
      // исходной.
      let distanceOutsideMinsk = 0;
      routeObjects
        .remove(objectsInMinsk)
        .remove(boundaryObjects)
        // .setOptions({
        //   strokeColor: "#0010ff",
        //   preset: "islands#blueIcon",
        // })
        .each((path, i) => {
          // console.log("path", path.geometry.getDistance());
          if (path && i < 10) {
            distanceOutsideMinsk += path.geometry.getDistance();
            // distanceOutsideMinsk = length ? distanceOutsideMinsk + length : 0;
            // dist3 += Math.round(length);
            console.log("distanceOutsideMinsk", distanceOutsideMinsk);
          }
        });

      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto,
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
    }

    dispatch(
      AddFormAction({
        price: newPrice,
        distance: length && length.text,
        time: duration,
        auto: props.typeAuto,
        payment: "cash",
      })
    );
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
    // console.log("minskData", minskData);

    const polygon = new ymaps.Polygon(minskData.coordinates);
    // console.log("polygon1", polygon, "map1", mapRef);
    polygon.options.set("visible", false);
    // mapRef.current.geoObjects.add(polygon);

    // console.log("polygon2s", polygon, "map2", mapRef);
    setMinskPolygon(polygon);

    const suggestView = new ymaps.SuggestView("from");
    suggestView.events.add("select", (e) => {
      const from = e.get("item");
      dispatch(
        AddFormAction({
          from: from.displayName,
        })
      );
    });
    const suggestView2 = new ymaps.SuggestView("to");
    suggestView2.events.add("select", (e) => {
      const to = e.get("item");
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
              // "geocode",
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
              }}
              state={{
                type: "masstransit",
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

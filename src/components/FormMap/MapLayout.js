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
    // load: "Map,Placemark,Polygon",
    load: "package.full",
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
    let newDoundedBy;

    if (activeRoute) {
      length = route.getActiveRoute().properties.get("distance");
      duration = route.getActiveRoute().properties.get("duration").text;
      console.log("minskPolygon", minskPolygon);
      newDoundedBy = route.getActiveRoute().properties.get("boundedBy");
      console.log("newDoundedBy", newDoundedBy);

      // const edges = [];
      const responseRoute = await ymapsRef.route(newDoundedBy);
      console.log("responseRoute", responseRoute);
      pathsObjects = ymapsRef.geoQuery(responseRoute.getPaths());
      console.log("pathsObjects", pathsObjects);
      // pathsObjects.each((path) => {
      //   const coordinates = path.geometry.getCoordinates();
      //   console.log("coordinates", coordinates);
      //   for (var i = 1, l = coordinates.length; i < l; i++) {
      //     edges.push({
      //       type: "LineString",
      //       coordinates: [coordinates[i], coordinates[i - 1]],
      //     });
      //     console.log("edges", edges);
      //   }
      // });
      // var routeObjects = ymapsRef
      //     .geoQuery(edges)
      //     .add(route.getWayPoints())
      //     .add(route.getViaPoints())
      //     .setOptions("strokeWidth", 3)
      //     .addToMap(ymapsRef),
      //   // Найдем все объекты, попадающие внутрь МКАД.
      //   objectsInMoscow = routeObjects.searchInside(minskPolygon),
      //   // Найдем объекты, пересекающие МКАД.
      //   boundaryObjects = routeObjects.searchIntersect(minskPolygon);
      // // Раскрасим в разные цвета объекты внутри, снаружи и пересекающие МКАД.
      // boundaryObjects.setOptions({
      //   strokeColor: "#06ff00",
      //   preset: "islands#greenIcon",
      // });
      // objectsInMoscow.setOptions({
      //   strokeColor: "#ff0005",
      //   preset: "islands#redIcon",
      // });
      // // Объекты за пределами МКАД получим исключением полученных выборок из
      // // исходной.
      // routeObjects.remove(objectsInMoscow).remove(boundaryObjects).setOptions({
      //   strokeColor: "#0010ff",
      //   preset: "islands#blueIcon",
      // });

      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto
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
        newDoundedBy,
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
    polygon.options.set("visible", true);
    mapRef.current.geoObjects.add(polygon);
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
              "geocode",
              "SuggestView",
              "Polygon",
              "templateLayoutFactory",
              "GeoObjectArray",
              "ObjectManager",
              "GeoQueryResult",
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
              modules={["templateLayoutFactory"]}
            />
          </Map>
        </div>
      </YMaps>
    </div>
  );
};
export default MapLayout;

import React, { useState } from "react";
import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
import "./MapLayout.scss";
import { API_KEY } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { AddFormAction } from "../../redux/actions/FormActions";
import { useSelector } from "react-redux";
import { calculateDistance } from "../../utils/utils";

const MapLayout = (props) => {
  const yMapsState = {
    apikey: API_KEY,
    ns: "use-load-option",
    load: "Map,Placemark",
  };
  const mapState = {
    center: [53.902735, 27.555696],
    zoom: 9,
  };

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

    if (activeRoute) {
      length = route.getActiveRoute().properties.get("distance");

      duration = route.getActiveRoute().properties.get("duration").text;

      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto
      );

      const balloonContentLayout = createBalloonLayout(
        ymapsRef,
        length.text,
        newPrice,
        duration
      );

      openBallon(balloonContentLayout, route, activeRoute);
    }

    dispatch(
      AddFormAction({
        price: newPrice,
        distance: length && length.text,
        time: duration,
        auto: props.typeAuto,
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
        '<span  style="color: red; font-style: italic">*Стоимость уточняйте у оператора</span>'
    );
  };
  const openBallon = (balloonContentLayout, route, activeRoute) => {
    route.options.set("routeBalloonContentLayout", balloonContentLayout);
    activeRoute.balloon.open();
  };

  const loadSuggest = (ymaps) => {
    setYmapsRef(ymaps);

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
            onLoad={(ymaps) => loadSuggest(ymaps)}
            width={"100%"}
            height={"300px"}
            modules={["geocode", "SuggestView", "templateLayoutFactory"]}
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

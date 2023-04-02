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
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  // const [price, setPrice] = useState(null);

  const dispatch = useDispatch();

  // const state = useSelector((state) => state.Form);

  const createRoutPanel = async (ref) => {
    try {
      if (ref) {
        ref.routePanel.options.set({
          types: { auto: true },
          allowSwitch: false,
        });
        ref.routePanel.state.set({
          from,
          to,
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
    let newBoundedBy;
    let newPrice;

    if (activeRoute) {
      length = route.getActiveRoute().properties.get("distance");

      duration = route.getActiveRoute().properties.get("duration").text;

      // newBoundedBy = route.getActiveRoute().properties.get("boundedBy");

      newPrice = calculateDistance(
        Math.round(length.value / 1000),
        props.typeAuto
      );
      // setPrice(newPrice);
      const balloonContentLayout = createBalloonLayout(
        ymapsRef,
        length.text,
        newPrice
      );

      openBallon(balloonContentLayout, route, activeRoute);
    }

    dispatch(
      AddFormAction({
        price: newPrice,
        distance: length && length.text,
        time: duration,
        from,
        to,
      })
    );
  };
  const createBalloonLayout = (ymaps, distance, newPrice) => {
    return ymaps.templateLayoutFactory.createClass(
      "<span>Расстояние: " +
        distance +
        ".</span><br/>" +
        '<span style="font-weight: bold; font-style: italic">Стоимость трансфера: ' +
        "~" +
        newPrice +
        " б.р.</span><br/>" +
        '<span style="color: red; font-style: italic">*Стоимость уточняйте у оператора</span>'
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
      setFrom(from.displayName);
    });
    const suggestView2 = new ymaps.SuggestView("to");
    suggestView2.events.add("select", (e) => {
      const to = e.get("item");
      setTo(to.displayName);
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
              className='input form-control'
              id='from'
              name='from'
              placeholder='Откуда'
            />
            <input
              type='text'
              className='input to-control'
              id='to'
              name='to'
              placeholder='Куда'
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

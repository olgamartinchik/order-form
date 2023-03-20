import React from "react";
import {
  YMaps,
  Map,
  RoutePanel,
  Placemark,
  FullscreenControl,
  Polygon,
} from "@pbe/react-yandex-maps";

export class FormMap extends React.Component {
  constructor() {
    super();
    this.map = null;
    this.routePanel = null;
    this.init = this.init.bind(this);
    // this.createRoutPanel = this.createRoutPanel.bind(this);
    this.state = {
      distance: null,
      price: null,
      from: null,
      to: null,
    };
  }
  init() {
    console.log("this.map, ", this.map.controls);
  }
  createRoutPanel(ref) {
    // Стоимость за километр.
    const DELIVERY_TARIFF = 20;
    // Минимальная стоимость.
    const MINIMUM_COST = 500;
    if (ref) {
      ref.routePanel.options.set({
        types: { auto: true },
      });

      ref.routePanel.getRouteAsync().then((route) => {
        console.log("route", route);
        route.model.setParams({ result: 1 }, true);
        route.model.events.add("requestsuccess", () => {
          const activeRoute = route.getActiveRoute();
          if (activeRoute) {
            const length = route.getActiveRoute().properties.get("distance");
            // this.setState({
            //   distance: length.text,
            // });
            const price = this.calculate(
              Math.round(length.value / 1000),
              DELIVERY_TARIFF,
              MINIMUM_COST
            );
            this.setState({
              price: price,
              distance: length.text,
            });
            console.log("price", price, length.text);

            // const balloonContentLayout = ymaps.templateLayoutFactory
            //   .createClass(`"<span>Расстояние: " +
            // ${this.state.distance} +
            // ".</span><br/>" +
            // '<span style="font-weight: bold; font-style: italic">Стоимость доставки: ' +
            // ${this.state.price} +
            // " р.</span>"`);

            // route.options.set(
            //   "routeBalloonContentLayout",
            //   balloonContentLayout
            // );
            // // Откроем балун.
            // activeRoute.balloon.open();
          }
        });
      });
    }
  }
  calculate(routeLength, DELIVERY_TARIFF, MINIMUM_COST) {
    return Math.max(routeLength * DELIVERY_TARIFF, MINIMUM_COST);
  }
  render() {
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

    return (
      <>
        <YMaps
          className='yMaps'
          query={yMapsState}
          instanceRef={(ref) => {
            console.log("ymaps", ref);
          }}
          onApiAvaliable={(ymaps) => console.log("ymaps", ymaps)}
        >
          <div>
            <h2>Маршрут</h2>
            <Map
              defaultState={mapState}
              instanceRef={(ref) => (this.map = ref)}
              onLoad={this.init}
              width={"100%"}
              height={"300px"}
            >
              <FullscreenControl options={{ float: "left" }} />

              <RoutePanel
                instanceRef={(ref) => this.createRoutPanel(ref)}
                options={{
                  float: "right",
                  showHeader: true,
                  title: "Расчёт поездки",
                }}
              />

              {/* <Placemark
                options={{
                  balloonContentLayout: `"<span>Расстояние: " +
          ${this.state.distance} +
          ".</span><br/>" +
          '<span style="font-weight: bold; font-style: italic">Стоимость доставки: ' +
          ${this.state.price} +
          " р.</span>"`,
                }}
              /> */}
            </Map>
          </div>
        </YMaps>
      </>
    );
  }
}

import React from "react";
import { YMaps, Map } from "@pbe/react-yandex-maps";

export class FormMap extends React.Component {
  render() {
    return (
      <>
        <YMaps>
          <div>
            <h2>Маршрут</h2>
            <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }} />
          </div>
        </YMaps>
      </>
    );
  }
}

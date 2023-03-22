// import React, { Component } from "react";
// import { YMaps, Map, RoutePanel } from "@pbe/react-yandex-maps";
// import "./FormMap.scss";
// import { BASE_TARIFF_LESS_50_KM, RATIO_PER_KM, API_KEY } from "../../constants";

// class FormMap1 extends Component {
//   // console.log("typeAuto1", props.typeAuto);
//   constructor(props) {
//     super(props);
//     this.props = props;
//     this.state = {
//       ymaps: null,
//       price: null,
//       distance: null,
//       from: null,
//       to: null,
//       time: null,
//       routePanel: null,
//     };
//     // this.createRoutPanel=this.createRoutPanel
//   }

//   //   const dispatch = useDispatch();

//   createRoutPanel(ref) {
//     // console.log("ymaps1", this.state.ymaps);
//     // console.log("ref", ref);

//     if (ref) {
//       ref.routePanel.options.set({
//         autofocus: false,
//         types: { auto: true },
//       });

//       ref.routePanel
//         .getRouteAsync()
//         .then((route) => {
//           route.model.setParams({ result: 1 }, true);
//           route.model.events.add("requestsuccess", () => {
//             const activeRoute = route.getActiveRoute();
//             if (activeRoute) {
//               const length = route.getActiveRoute().properties.get("distance");
//               const duration = route
//                 .getActiveRoute()
//                 .properties.get("duration");

//               const newBoundedBy = route
//                 .getActiveRoute()
//                 .properties.get("boundedBy");

//               const newPrice = this.calculate(Math.round(length.value / 1000));

//               //   setPrice(newPrice);
//               //   setDistance(length.text);
//               //   setTime(duration.text);
//               console.log("this.state", this.state);

//               let firstGeoObject;
//               let secondGeoObject;
//               this.state.ymaps
//                 .geocode(newBoundedBy[0])
//                 .then((res) => {
//                   firstGeoObject = res.geoObjects.get(0).properties._data.text;
//                   //   setFrom(firstGeoObject);
//                   // console.log("firstGeoObject", firstGeoObject);
//                 })
//                 .catch((error) => {
//                   throw new Error(error);
//                 });

//               this.state.ymaps
//                 .geocode(newBoundedBy[1])
//                 .then((res) => {
//                   secondGeoObject = res.geoObjects.get(0).properties._data.text;
//                   //   setTo(secondGeoObject);
//                   // console.log("secondGeoObject", secondGeoObject);
//                 })
//                 .catch((error) => {
//                   throw new Error(error);
//                 });

//               this.setState({
//                 price: newPrice,
//                 distance: length.text,
//                 time: duration.text,
//                 from: firstGeoObject,
//                 to: secondGeoObject,
//               });
//             } else {
//               //   setPrice(null);
//               //   setDistance(null);
//               //   setTime(null);
//               //   setTo(null);
//               //   setFrom(null);
//               this.setState({
//                 price: null,
//                 distance: null,
//                 time: null,
//                 from: null,
//                 to: null,
//               });
//             }
//             // dispatch(
//             //   AddFormAction({
//             //     price,
//             //     distance,
//             //     from,
//             //     to,
//             //     auto: props.typeAuto,
//             //   })
//             // );
//           });
//         })
//         .catch((error) => {
//           throw new Error(error);
//         });
//     }
//   }

//   calculate(routeLength) {
//     let cost;
//     if (routeLength <= 50) {
//       cost = BASE_TARIFF_LESS_50_KM[this.props.typeAuto];
//     } else {
//       cost = Math.round(routeLength * RATIO_PER_KM[this.props.typeAuto]);
//     }
//     return cost;
//   }
//   render() {
//     const yMapsState = {
//       apikey: API_KEY,
//       ns: "use-load-option",
//       load: "Map,Placemark",
//     };
//     const mapState = {
//       center: [53.902735, 27.555696],
//       zoom: 9,
//     };

//     return (
//       <div className='map-container'>
//         <YMaps className='yMaps' query={yMapsState}>
//           <div>
//             <h2>Маршрут</h2>
//             <Map
//               defaultState={mapState}
//               //   instanceRef={(ref) => (this.ymaps = ref)}
//               onLoad={(ymaps) => this.setState({ ymaps })}
//               width={"100%"}
//               height={"350px"}
//               modules={["geocode"]}
//             >
//               <RoutePanel
//                 instanceRef={(ref) => this.createRoutPanel(ref)}
//                 // instanceRef={(routePanel) => this.setState({ routePanel })}
//                 // onLoad={(ymaps) => this.createRoutPanel(ymaps)}
//                 options={{
//                   float: "right",
//                   showHeader: true,
//                   title: "Расчёт поездки",
//                   // title: `Расчёт поездки ${
//                   //   distance && price
//                   //     ? "Расстояние: " +
//                   //       distance +
//                   //       " Стоимость: " +
//                   //       price +
//                   //       " бел.p."
//                   //     : ""
//                   // }`,
//                 }}
//               />
//             </Map>
//           </div>
//         </YMaps>
//         {this.state.distance && this.state.price && (
//           <p>
//             Расстояние: {this.state.distance}, Стоимость: {this.state.price},
//             Продолжительность:
//             {this.state.time}
//           </p>
//         )}
//         {this.state.from && this.state.to && (
//           <p>
//             from: {this.state.from}, to: {this.state.to}
//           </p>
//         )}
//       </div>
//     );
//   }
// }
// export default FormMap1;

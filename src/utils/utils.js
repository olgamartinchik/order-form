import { BASE_TARIFF_LESS_50_KM, RATIO_PER_KM } from "./constants";

export const calculateDistance = (routeLength, typeAuto) => {
  let cost;
  if (routeLength <= 50) {
    cost = BASE_TARIFF_LESS_50_KM[typeAuto];
  } else {
    cost = Math.round(routeLength * RATIO_PER_KM[typeAuto]);
  }
  return cost;
};

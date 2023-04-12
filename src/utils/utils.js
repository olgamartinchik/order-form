import {
  BASE_TARIFF_LESS_50_KM_AIRPORT,
  RATIO_PER_KM,
  MINSK_TARIFF,
} from "./constants";

export const calculateDistance = (
  routeLength,
  typeAuto,
  distanceInsideMinsk,
  distanceOutsideMinsk
) => {
  let cost;
  console.log("distanceInsideMinsk", distanceInsideMinsk);
  console.log("distanceOutsideMinsk", distanceOutsideMinsk);
  if (distanceInsideMinsk !== 0 && distanceOutsideMinsk === 0) {
    cost = MINSK_TARIFF[typeAuto];
  } else if (routeLength <= 50) {
    cost = BASE_TARIFF_LESS_50_KM_AIRPORT[typeAuto];
  } else {
    cost = Math.round(routeLength * RATIO_PER_KM[typeAuto]);
  }
  return cost;
};

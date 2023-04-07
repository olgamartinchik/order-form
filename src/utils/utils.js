import {
  BASE_TARIFF_LESS_50_KM,
  RATIO_PER_KM,
  MINSK_TARIFF,
} from "./constants";

export const calculateDistance = (
  routeLength,
  typeAuto,
  distanceOutsideMinsk = 0
) => {
  let cost;
  if (distanceOutsideMinsk === 0) {
    cost = MINSK_TARIFF[typeAuto];
  } else if (routeLength <= 50) {
    cost = BASE_TARIFF_LESS_50_KM[typeAuto];
  } else {
    cost = Math.round(routeLength * RATIO_PER_KM[typeAuto]);
  }
  return cost;
};

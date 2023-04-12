import {
  BASE_TARIFF_LESS_50_KM_AIRPORT,
  RATIO_PER_KM,
  MINSK_TARIFF,
  AIRPORT_COORD,
} from "./constants";

export const calculateDistance = (
  routeLength,
  typeAuto,
  distanceInsideMinsk,
  distanceOutsideMinsk,
  coordFrom,
  coordTo
) => {
  let cost;
  console.log("distanceInsideMinsk", distanceInsideMinsk);
  console.log("distanceOutsideMinsk", distanceOutsideMinsk);
  if (distanceInsideMinsk !== 0 && distanceOutsideMinsk === 0) {
    cost = MINSK_TARIFF[typeAuto];
  } else if (
    distanceInsideMinsk &&
    ((AIRPORT_COORD[0] === coordFrom[0] && AIRPORT_COORD[1] === coordFrom[1]) ||
      (AIRPORT_COORD[0] === coordTo[0] && AIRPORT_COORD[1] === coordTo[1])) &&
    routeLength <= 50
  ) {
    cost = BASE_TARIFF_LESS_50_KM_AIRPORT[typeAuto];
  } else if (routeLength <= 50) {
    cost = BASE_TARIFF_LESS_50_KM_AIRPORT[typeAuto];
  } else {
    cost = Math.round(routeLength * RATIO_PER_KM[typeAuto]);
  }
  return cost;
};

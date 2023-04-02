export const typesAuto = [
  { standard: "Стандарт, до 3 пассажиров" },
  { comfort: "Комфорт, до 3 пассажиров" },
  { minivan: "Минивен, до 8 пассажиров" },
  { business: "Бизнес до 3 пассажиров" },
  { vip: "VIP" },
  { minibus: "Микроавтобус до 20 пассажиров" },
];

export const BASE_TARIFF_LESS_50_KM = {
  standard: 50,
  comfort: 60,
  minivan: 80,
  business: 100,
  vip: 240,
  minibus: 180,
};
export const RATIO_PER_KM = {
  standard: 1,
  comfort: 1.1,
  minivan: 1.5,
  business: 2,
  vip: 3,
  minibus: 2.3,
};
export const typeOfPayment = [
  { cash: "Оплата наличными" },
  { card: "Щплата банковской картой" },
  { online: "Онлайн оплата" },
  { cashless: "Безналичный расчет" },
];
export const API_KEY2 = "dd860581-f55b-46fd-b520-49cf11337c2e";
export const API_KEY = "1c324abd-4386-42ae-95df-be1b518bad77";

export const Actions = {
  ADD_FORM_DATA: "ADD_FORM_DATA",
  ADD_IS_USER_DATA_PART: "ADD_IS_USER_DATA_PART",
};
export const initialState = {};

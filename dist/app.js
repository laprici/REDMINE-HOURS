"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const URL_REDMINE = process.env.URL_REDMINE;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;
const feriadosChile = async () => {
    const { data } = await axios_1.default.get("https://api.boostr.cl/holidays.json");
    const { data: feriados } = await data;
    return await feriados.map(({ date }) => date);
};
const laboralesChile = async () => {
    const feriados = await feriadosChile();
    const year = new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = (0, date_fns_1.endOfYear)(new Date(year, 0, 1));
    const allDays = (0, date_fns_1.eachDayOfInterval)({ start, end });
    const laborales = allDays.filter((day) => !(0, date_fns_1.isWeekend)(day) && !feriados.includes((0, date_fns_1.format)(day, "yyyy-MM-dd")));
    return laborales;
};
const checkHours = async (days) => {
    const today = new Date();
    const laborales = await laboralesChile();
    const daysToCheck = (0, date_fns_1.subDays)(today, days);
    const { data } = await axios_1.default.get(`${URL_REDMINE}time_entries.json`, {
        headers: {
            "X-Redmine-API-Key": API_KEY,
        },
        params: {
            user_id: USER_ID,
            from: (0, date_fns_1.format)(daysToCheck, "yyyy-MM-dd"),
            to: (0, date_fns_1.format)(today, "yyyy-MM-dd"),
        },
    });
    const entries = data?.time_entries || [];
    const hoursPerDay = Object.groupBy(entries, ({ spent_on }) => spent_on);
    return data?.time_entries || [];
};
async function init() {
    const laborales = await laboralesChile();
    checkHours(7);
}
init();

// events.js


import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/events/events/";

export async function getEvents() {
  const response = await axios.get(API_BASE);
  return response.data;
}

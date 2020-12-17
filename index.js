const _ical = require("node-ical");
const express = require("express");
const cors = require("cors");
const parser = require("body-parser");
const _ = require("lodash");
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(parser.json());
let calendar = [];

app.get("/getCalendar", function (req, res) {
  console.log("getCalendar");
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(JSON.stringify({ msj: "Exito", calendar }));
});

app.post("/syncCalendar", async function (req, res) {
  const { url } = req.body;
  if (url) {
    const events = await formatEvents(url);
    const hasEvents = !_.isEmpty(events);
    if (hasEvents) {
      saveEvents(events);
      return res.end(JSON.stringify({ calendar }));
    }
  }
  return res.end(JSON.stringify({ msj: "Error" }));
});

const saveEvents = (events) => {
  calendar = [];
  events.map((event) => calendar.push(event));
};
const formatEvents = async (url) => {
  const objectEvents = await _ical.async
    .fromURL(url)
    .catch((error) => console.log(error));
  const events = _.filter(_.values(objectEvents), (item) => item.type);
  return events;
};

app.listen(3001, () => {
  console.log("Server Listening on port 3001.....");
});

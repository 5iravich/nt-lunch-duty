import express from "express";
import fetch from "node-fetch";
import ical from "ical";
import cors from "cors";

const app = express();
app.use(cors());

const HOLIDAY_URL = "https://calendar.google.com/calendar/ical/th.th%23holiday%40group.v.calendar.google.com/public/basic.ics";

app.get("/holidays", async (req, res) => {
  try {
    const response = await fetch(HOLIDAY_URL);
    const text = await response.text();
    const data = ical.parseICS(text);

    const holidays = Object.values(data)
      .filter(event => event.type === "VEVENT")
      .map(event => event.start.toISOString().split("T")[0]);

    res.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    res.status(500).json({ error: "Unable to fetch holidays" });
  }
});

app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
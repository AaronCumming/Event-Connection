{/* 

import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Calendar from "./routes/Calendar";
import DailyView from "./routes/DailyView";
import WeeklyView from "./routes/WeeklyView";
import MonthlyView from "./routes/MonthlyView";

export default function App() {
  return (
    <MantineProvider
      theme={{
        fontFamily: "Gotham, sans-serif",
        colors: {
          concordiaBlue: ["#192C53"],
          sky: ["#5A9DBF"],
          wheat: ["#E2C172"],
          slate: ["#646464"],
          nimbus: ["#C8C8C8"],
          warmWhite: ["#F7F4ED"],
        },
        primaryColor: "concordiaBlue",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/calendar/daily" element={<DailyView />} />
          <Route path="/calendar/weekly" element={<WeeklyView />} />
          <Route path="/calendar/monthly" element={<MonthlyView />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

*/}

// App.jsx

import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}

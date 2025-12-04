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
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import DetailPage from "./routes/DetailPage";
import Calendar from "./routes/Calendar";
import Banner from "./components/Banner";

// Define Concordia theme colors
const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  colors: {
    cuneBlue: ["#192C53"],
    cuneLightBlue: ["#5A9DBF"],
    cuneCream: ["#F7F4ED"],
  },
  primaryColor: "cuneBlue",
});

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light" withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <Banner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<DetailPage />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
import React, { useState, useEffect } from "react";
import {
  SegmentedControl,
  Card,
  Text,
  Title,
  Container,
  Popover,
  Button,
  Group,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { getEvents } from "../api/events";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

dayjs.extend(isBetween);

// --- Brand palette ---
const PALETTE = {
  CONCORDIA_BLUE: "#192C53",
  SKY: "#5A9DBF",
  WHEAT: "#E2C172",
  SLATE: "#646464",
  WARM_WHITE: "#F7F4ED",
  NIMBUS: "#C8C8C8",
};

export default function CalendarView() {
  const [view, setView] = useState("week");
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    getEvents().then((data) => {
      const approved = data.filter((e) => e.status === "approved");
      setEvents(approved);
    });
  }, []);

  // ---- Time formatting helpers ----
  const formatStartTime = (time) => {
    const t = dayjs(time);
    return t.minute() === 0 ? t.format("h A") : t.format("h:mm A");
  };
  const formatEndTime = (time) => {
    if (!time) return null;
    const t = dayjs(time);
    return t.minute() === 0 ? t.format("h A") : t.format("h:mm A");
  };

  // ---- Calendar navigation ----
  const handlePrev = () => {
    const unit = isMobile || view === "day" ? "day" : view;
    setCurrentDate(currentDate.subtract(1, unit));
  };
  const handleNext = () => {
    const unit = isMobile || view === "day" ? "day" : view;
    setCurrentDate(currentDate.add(1, unit));
  };

  const handleToday = () => setCurrentDate(dayjs());

  // ---- Active view helpers ----
  const activeView = isMobile ? "day" : view;

  // ---- Header title text ----
  const getHeaderText = () => {
    if (activeView === "day") {
      return currentDate.format("dddd, MMM D, YYYY");
    } else if (activeView === "week") {
      const start = currentDate.startOf("week");
      const end = currentDate.endOf("week");
      const sameMonth = start.month() === end.month();
      const monthFormat = sameMonth ? "MMM D" : "MMM D";
      return `${start.format(monthFormat)} – ${end.format("MMM D, YYYY")}`;
    } else if (activeView === "month") {
      return currentDate.format("MMMM YYYY");
    }
  };

  // ---- Today button visibility ----
  const today = dayjs();
  const inViewRange = (() => {
    if (activeView === "day") return currentDate.isSame(today, "day");
    if (activeView === "week")
      return today.isBetween(
        currentDate.startOf("week"),
        currentDate.endOf("week"),
        "day",
        "[]"
      );
    if (activeView === "month")
      return today.isBetween(
        currentDate.startOf("month"),
        currentDate.endOf("month"),
        "day",
        "[]"
      );
    return true;
  })();

  // ---- Filter events ----
  const getFilteredEvents = () => {
    const startOfDay = currentDate.startOf("day");
    const startOfWeek = currentDate.startOf("week");
    const startOfMonth = currentDate.startOf("month");
    const endOfDay = currentDate.endOf("day");
    const endOfWeek = currentDate.endOf("week");
    const endOfMonth = currentDate.endOf("month");

    let filtered = [];
    switch (activeView) {
      case "day":
        filtered = events.filter((e) =>
          dayjs(e.event_time).isBetween(startOfDay, endOfDay, null, "[]")
        );
        break;
      case "week":
        filtered = events.filter((e) =>
          dayjs(e.event_time).isBetween(startOfWeek, endOfWeek, null, "[]")
        );
        break;
      case "month":
        filtered = events.filter((e) =>
          dayjs(e.event_time).isBetween(startOfMonth, endOfMonth, null, "[]")
        );
        break;
      default:
        filtered = events;
    }

    return filtered.sort(
      (a, b) => dayjs(a.event_time).valueOf() - dayjs(b.event_time).valueOf()
    );
  };
  const filteredEvents = getFilteredEvents();
  const eventsForGrid =
    activeView === "month" ? events : filteredEvents;

  // ---- Get days for grid ----
  const getDaysForView = () => {
    switch (activeView) {
      case "day":
        return [currentDate];
      case "week":
        return Array.from({ length: 7 }, (_, i) =>
          currentDate.startOf("week").add(i, "day")
        );
      case "month": {
        const startOfMonth = currentDate.startOf("month");
        const startOfGrid = startOfMonth.startOf("week");
        const endOfGrid = currentDate.endOf("month").endOf("week");
        const days = [];
        let d = startOfGrid;
        while (d.isBefore(endOfGrid, "day") || d.isSame(endOfGrid, "day")) {
          days.push(d);
          d = d.add(1, "day");
        }
        return days;
      }
      default:
        return [currentDate];
    }
  };

  // ---- Event state helpers ----
  const isPastEvent = (start, end) =>
    end ? dayjs(end).isBefore(dayjs()) : dayjs(start).isBefore(dayjs());
  const isOngoing = (start, end) =>
    end ? dayjs().isBetween(dayjs(start), dayjs(end)) : false;

  // ---- Event popover card ----
  const EventPopoverCard = ({ event }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const start = dayjs(event.event_time);
    const end = event.event_end_time ? dayjs(event.event_end_time) : null;
    const ongoing = isOngoing(start, end);
    const past = isPastEvent(start, end);
    const bg = ongoing ? PALETTE.SKY : PALETTE.WARM_WHITE;
    const fg = ongoing ? "white" : PALETTE.CONCORDIA_BLUE;
    const dim = past ? { opacity: 0.55, filter: "grayscale(0.6)" } : {};

    return (
      <Popover
        width={260}
        position="bottom-start"
        withArrow
        shadow="md"
        opened={opened}
      >
        <Popover.Target>
          <Card
            p="xs"
            mt="xs"
            withBorder
            component={Link}
            to={`/events/${event.id}`}
            onMouseEnter={!isMobile ? open : undefined}
            onMouseLeave={!isMobile ? close : undefined}
            style={{
              backgroundColor: bg,
              color: fg,
              border: `1px solid ${PALETTE.CONCORDIA_BLUE}`,
              cursor: "pointer",
              ...dim,
            }}
          >
            <Text
              size="xs"
              fw={600}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formatStartTime(event.event_time)} {event.name}
            </Text>
          </Card>
        </Popover.Target>

        {!isMobile && (
          <Popover.Dropdown style={{ pointerEvents: "none" }}>
            <Text fw={700} size="sm" mb={4} c={PALETTE.CONCORDIA_BLUE}>
              {event.name}
            </Text>
            <Text size="xs" c={PALETTE.SLATE} mb={6}>
              {start.format("ddd, MMM D")} • {formatStartTime(start)}
              {end ? ` – ${formatEndTime(end)}` : ""}
            </Text>
            <Text size="xs" mb={6}>
              <strong>Location:</strong> {event.location}
            </Text>
            <Text size="xs" c={PALETTE.SLATE}>
              {event.short_description}
            </Text>
          </Popover.Dropdown>
        )}
      </Popover>
    );
  };

  // ---- Grid render ----
  const renderDayGrid = (daysToShow) => {
    const isMonth = view === "month" && !isMobile;
    const columns =
      activeView === "day"
        ? 1
        : isMobile
        ? 1
        : 7;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "8px",
          width: "100%",
        }}
      >
        {daysToShow.map((day) => {
          const dayEvents = eventsForGrid
            .filter((e) => dayjs(e.event_time).isSame(day, "day"))
            .sort((a, b) =>
              dayjs(a.event_time).valueOf() - dayjs(b.event_time).valueOf()
            );
          const isToday = day.isSame(dayjs(), "day");
          const isPastDay = day.isBefore(dayjs().startOf("day"));

          const bg = isToday ? PALETTE.SKY : isPastDay ? "#E1E1E1" : "#FFFFFF";
          const textColor = isPastDay ? PALETTE.NIMBUS : PALETTE.CONCORDIA_BLUE;

          return (
            <Card
              key={day.format("YYYY-MM-DD")}
              shadow="sm"
              radius="md"
              withBorder
              style={{
                backgroundColor: bg,
                color: textColor,
                borderColor: isToday
                  ? PALETTE.CONCORDIA_BLUE
                  : PALETTE.NIMBUS,
                padding: isMonth ? "0.5rem" : "1rem",
                minHeight: isMonth ? "120px" : "180px",
              }}
            >
              <Title order={5} mb="xs" style={{ color: PALETTE.CONCORDIA_BLUE }}>
                {day.format("ddd, MMM D")}
              </Title>

              {dayEvents.length ? (
                dayEvents.map((event) => (
                  <EventPopoverCard key={event.id} event={event} />
                ))
              ) : (
                <Text size="sm" c="dimmed">
                  No events
                </Text>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  // ---- Render ----
  return (
    <Container fluid my="xl" style={{ width: "100%", maxWidth: "100%" }}>
      {/* Header & navigation */}
      <Group justify="space-between" align="center" mb="md" wrap="nowrap">
        <div>
          <Title order={2} c={PALETTE.CONCORDIA_BLUE}>
            {getHeaderText()}
          </Title>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <Button
              variant="light"
              color="concordiaBlue"
              onClick={handlePrev}
              radius="xl"
              size="compact-md"
            >
              <IconChevronLeft size={16} />
            </Button>

            <Button
              variant="light"
              color="concordiaBlue"
              onClick={handleNext}
              radius="xl"
              size="compact-md"
            >
              <IconChevronRight size={16} />
            </Button>
          </div>

          {!inViewRange && (
            <Button
              onClick={handleToday}
              variant="light"
              color="concordiaBlue"
              radius="xl"
              size="compact-md"
              style={{ marginTop: "6px" }}
            >
              Go to Today
            </Button>
          )}
        </div>
      </Group>

      

      {/* Hide view buttons on mobile */}
      {!isMobile && (
        <SegmentedControl
          value={view}
          onChange={setView}
          data={[
            { label: "Day", value: "day" },
            { label: "Week", value: "week" },
            { label: "Month", value: "month" },
          ]}
          color="concordiaBlue"
          mb="lg"
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          padding: activeView === "day" && !isMobile ? "0 3vw" : 0,
        }}
      >
        <div
          style={{
          width: activeView === "day" && !isMobile ? "100%" : "100%",
          maxWidth: activeView === "day" && !isMobile ? "1200px" : "100%",
          transition: "max-width 0.4s ease",
          }}
        >
          {renderDayGrid(getDaysForView())}
        </div>
      </div>
    </Container>
  );
}

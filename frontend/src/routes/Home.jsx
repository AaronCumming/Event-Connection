// routes/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Title, Card, Text, Button, Center, Stack, Divider} from "@mantine/core";
import { getEvents } from "../api/events";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

import SideNav from "../components/SideNav";

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then((data) => {
      const approved = (data.results || data).filter(
        (e) => e.status === "approved"
      );
      const sorted = approved.sort(
        (a, b) => new Date(a.event_time) - new Date(b.event_time)
      );
      setEvents(sorted);
    });
  }, []);

  const now = dayjs();
  const todayStart = now.startOf("day");
  const todayEnd = now.endOf("day");
  const tomorrowStart = todayStart.add(1, "day");
  const tomorrowEnd = todayStart.add(2, "day");
  const weekEnd = todayStart.add(7, "day");

  const ongoingToday = events.filter((e) => {
    const start = dayjs(e.event_time);
    const end = dayjs(e.event_end_time || e.event_time);
    return start.isSame(todayStart, "day") && now.isBetween(start, end);
  });

  const upcomingToday = events.filter((e) => {
    const start = dayjs(e.event_time);
    return start.isSame(todayStart, "day") && start.isAfter(now);
  });

  const tomorrow = events.filter((e) => {
    const start = dayjs(e.event_time);
    return start.isAfter(todayEnd) && start.isBefore(tomorrowEnd);
  });

  const thisWeek = events.filter((e) => {
    const start = dayjs(e.event_time);
    return start.isAfter(tomorrowEnd) && start.isSameOrBefore(weekEnd, "day");
  });

  const getInitialSection = () => {
    if (ongoingToday.length) return "section-ongoing";
    if (upcomingToday.length) return "section-upcoming";
    if (tomorrow.length) return "section-tomorrow";
    return "section-week";
  };

  const renderSection = (title, list) => {
    if (!list.length) return null;
    return (
      <>
        <Divider
          label={<Title order={2} style={{ color: "#192C53" }}>{title}</Title>}
          labelPosition="center"
          my="lg"
          size="md"
          color="#5A9DBF"
        />

        {list.map((event) => (
          <Card
            key={event.id}
            shadow="lg"
            radius="lg"
            withBorder
            onClick={() => navigate(`/events/${event.id}`)}
            style={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #192C53",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "2rem",
              padding: "1.5rem 2rem",
              marginBottom: "2rem",       // <-- ADD SPACING HERE
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              cursor: "pointer",
              flexWrap: "wrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(25, 44, 83, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ flex: "1 1 55%", minWidth: 260, textAlign: "left" }}>
              <Title order={3} style={{ color: "#192C53" }}>
                {event.name || "Untitled Event"}
              </Title>

              <Text style={{ color: "#333", marginTop: 8, marginBottom: 8 }}>
                {event.short_description || "No description."}
              </Text>

              <Text style={{ marginBottom: 4 }}>
                <strong>Date:</strong>{" "}
                {new Date(event.event_time).toLocaleString([], {
                  dateStyle: "full",
                  timeStyle: "short",
                })}{" "}
                -{" "}
                {event.event_end_time
                  ? new Date(event.event_end_time).toLocaleString([], {
                      timeStyle: "short",
                    })
                  : ""}
              </Text>

              <Text>
                <strong>Location:</strong> {event.location || "N/A"}
              </Text>

              <Button
                mt="md"
                color="#5A9DBF"
                variant="filled"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event.id}`);
                }}
              >
                More Details
              </Button>
            </div>

            <div
              style={{
                flex: "1 1 40%",
                minWidth: 240,
                maxWidth: 400,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {event.image ? (
                <img
                  src={
                    event.image?.startsWith("http")
                      ? event.image
                      : `http://127.0.0.1:8000${event.image}`
                  }
                  alt={event.name}
                  style={{
                    width: "100%",
                    maxHeight: 300,
                    objectFit: "cover",
                    borderRadius: 10,
                    border: "1px solid #192C53",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    background: "#f0f0f0",
                    borderRadius: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                  }}
                >
                  No image
                </div>
              )}
            </div>
          </Card>
        ))}
      </>
    );
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <SideNav initialSection={getInitialSection()} />

      <div style={{ flex: 1 }}>
        <div
          style={{
            backgroundColor: "#ffffffff",
            minHeight: "100vh",
            paddingBottom: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Container size="lg" py="xl">
            <Center mb="xl">
              <Title
                order={1}
                style={{
                  color: "#192C53",
                  fontFamily: "Gotham Black, sans-serif",
                  fontWeight: 800,
                }}
              >
                Concordia's Upcoming Events
              </Title>
            </Center>

            <Stack
              align="stretch"
              gap="xl"
              style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
            >

            <div id="section-ongoing" style={{ scrollMarginTop: "120px", width: "100%" }}>
              {renderSection("Ongoing Today", ongoingToday)}
            </div>

            <div id="section-upcoming" style={{ scrollMarginTop: "120px", width: "100%" }}>
              {renderSection("Upcoming Today", upcomingToday)}
            </div>

            <div id="section-tomorrow" style={{ scrollMarginTop: "120px", width: "100%" }}>
              {renderSection("Tomorrow", tomorrow)}
            </div>

            <div id="section-week" style={{ scrollMarginTop: "120px", width: "100%" }}>
              {renderSection("This Week", thisWeek)}
            </div>



              {!ongoingToday.length &&
                !upcomingToday.length &&
                !tomorrow.length &&
                !thisWeek.length && (
                  <Center>
                    <Text>No upcoming events this week.</Text>
                  </Center>
                )}
            </Stack>
          </Container>
        </div>
      </div>
    </div>
  );
}
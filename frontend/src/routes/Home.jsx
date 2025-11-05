// Home.jsx

{/* 

import React, { useEffect, useState } from 'react';
import { Container, Title, SimpleGrid, Loader, Text } from '@mantine/core';
import { getEvents } from '../api/events';
import EventCard from '../components/EventCard';
import dayjs from 'dayjs';

export default function Home() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  if (!events) return <Loader size="lg" />;

  const today = dayjs().startOf('day');
  const todaysEvents = events.filter(e => dayjs(e.event_time).isAfter(today));

  return (
    <Container>
      <Title order={1} mb="lg" c="concordiaBlue">Today's Events</Title>
      <SimpleGrid cols={3}>
        {todaysEvents.length ? (
          todaysEvents.map(event => <EventCard key={event.id} event={event} />)
        ) : (
          <Text>No events today.</Text>
        )}
      </SimpleGrid>
    </Container>
  );
}


*/}


// routes/Home.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Title, Card, Text, Button, Center, Stack, } from "@mantine/core";
import { getEvents } from "../api/events";

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data.results || data);
    });
  }, []);

  return (
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
              letterSpacing: "0.5px",
            }}
          >
            Upcoming Events
          </Title>
        </Center>

        {events.length === 0 ? (
          <Center>
            <Text>No events available</Text>
          </Center>
        ) : (
          <Stack align="center" gap="xl" style={{ width: "100%" }}>
            {events.map((event) => (
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
                  maxWidth: 1000,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "2rem",
                  padding: "1.5rem 2rem",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                  flexWrap: "wrap", // responsive stacking
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
                {/* Left side (text) */}
                <div
                  style={{
                    flex: "1 1 55%",
                    minWidth: 260,
                    textAlign: "left",
                  }}
                >
                  <Title order={2} style={{ color: "#192C53" }}>
                    {event.name || "Untitled Event"}
                  </Title>
                  <Text
                    style={{
                      color: "#333",
                      lineHeight: 1.5,
                      marginTop: 8,
                      marginBottom: 8,
                    }}
                  >
                    {event.short_description || "No description."}
                  </Text>
                  <Text style={{ marginBottom: 4 }}>
                    <strong>Date:</strong>{" "}
                    {event.event_time
                      ? new Date(event.event_time).toLocaleString()
                      : "No date provided"}
                  </Text>
                  <Text>
                    <strong>Location:</strong>{" "}
                    <span>
                      {event.location || "N/A"}
                    </span>
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

                {/* Right side (image) */}
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
                        maxHeight: 320,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #192C53",
                        display: "block",
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
                        border: "1px solid #dcdcdc",
                      }}
                    >
                      No image
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
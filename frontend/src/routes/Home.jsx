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
import { useEffect, useState } from "react";
import { Container, Title, Card, Text, Image, Center, Stack, Divider, Group, Grid } from "@mantine/core";
import { getEvents } from "../api/events";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((data) => {
      setEvents(data.results || data);
    });
  }, []);

  return (
    <div
      style={{
        backgroundColor: "rgba(245, 245, 245, 1)",
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
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #192C53",
                width: "100%",
                maxWidth: 1000,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "stretch",
                gap: "2rem",
                padding: "2rem",
              }}
            >
              {/* Left side */}
              <div style={{ flex: 1, textAlign: "left" }}>
                <Title order={2} style={{ color: "#192C53" }}>
                  {event.name || "Untitled Event"}
                </Title>
                <Text style={{ color: "#333", lineHeight: 1.5 }}>
                  {event.short_description || "No description."}
                </Text>
                <Text>
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
              </div>

              {/* Right side */}
              <div style={{ flex: 1 }}>
                {event.image && (
                  <img
                    src={
                      event.image?.startsWith("http")
                        ? event.image
                        : `http://127.0.0.1:8000${event.image}`
                    }
                    alt={event.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid #192C53",
                    }}
                  />
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
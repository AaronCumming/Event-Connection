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
import { Container, Title, Card, Text, Image, Center, Stack, Divider } from "@mantine/core";
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
        backgroundColor: "#FFFFFF",
        minHeight: "100vh",
        paddingBottom: "3rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container size="lg" py="xl" style={{ textAlign: "center" }}>
        <Title
          order={1}
          mb="xl"
          style={{
            color: "#192C53",
            fontFamily: "Gotham Black, sans-serif",
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          Upcoming Events
        </Title>

        {events.length === 0 ? (
          <Text>No events available</Text>
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
                  border: "2px solid #192C53", // 🔹 thin Concordia blue border
                  width: "100%",
                  maxWidth: 700,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  textAlign: "center",
                  padding: "1.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 25px rgba(25, 44, 83, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1.0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Stack
                  align="center"
                  gap="sm"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Title order={1} style={{ color: "#192C53", marginTop: "0.5rem" }}>
                    {event.name}
                  </Title>

                  <Text
                    size="sm"
                    style={{
                      maxWidth: "85%",
                      margin: "0 auto",
                      textAlign: "center",
                      color: "#333",
                      lineHeight: 1.5,
                    }}
                  >
                    {event.short_description}
                  </Text>

                  {/* Event start and end times */}
                  <Text c="dimmed" size="sm" mb="xs">
                    {event.event_time
                      ? `${new Date(event.event_time).toLocaleString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}${
                          event.event_end_time
                            ? ` – ${new Date(event.event_end_time).toLocaleString(undefined, {
                                hour: "numeric",
                                minute: "2-digit",
                              })}`
                            : ""
                        }`
                      : "No date provided"}
                  </Text>

                  {event.location && (
                    <Text
                      size="sm"
                      style={{
                        textTransform: "Camel",
                        letterSpacing: "0.5px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {event.location}
                    </Text>
                  )}

                  <Divider my="xs" color="#E0E0E0" style={{ width: "80%" }} />


                  {event.image && (
                    <Image
                      src={
                        event.image?.startsWith("http")
                          ? event.image
                          : `http://127.0.0.1:8000${event.image}`
                      }
                      alt={event.name}
                      height={250}
                      radius="md"
                      fit="cover"
                      style={{
                        objectPosition: "center",
                        maxWidth: "100%",
                        borderRadius: "10px",
                        marginBottom: "1rem",
                      }}
                    />
                  )}                  

                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
}
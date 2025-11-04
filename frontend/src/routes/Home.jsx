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


import { useEffect, useState } from "react";
import { Container, Title, Card, Text, Image, Group } from "@mantine/core";
import { getEvents } from "../api/events";

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((data) => {
      // Handle both direct array or { results: [...] } responses
      setEvents(data.results || data);
    });
  }, []);

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md" style={{ color: "#192C53" }}>
        Upcoming Events
      </Title>

      {events.length === 0 ? (
        <Text>No events available</Text>
      ) : (
        events.map((event) => (
          <Card
            key={event.id}
            shadow="sm"
            mb="md"
            p="lg"
            radius="md"
            withBorder
            style={{
              backgroundColor: "#F7F4ED",
              borderColor: "#192C53",
            }}
          >
            <Group align="start" gap="md">
              {event.image && (
                <Image
                  src={
                    event.image?.startsWith("http")
                      ? event.image
                      : `http://127.0.0.1:8000${event.image}`
                  }
                  alt={event.name}
                  width={150}
                  radius="md"
                  fallbackSrc="https://via.placeholder.com/150?text=No+Image"
                />
              )}
              <div>
                <Title order={4} style={{ color: "#192C53" }}>
                  {event.name || "Untitled Event"}
                </Title>
                <Text c="dimmed" size="sm">
                  {event.event_time
                    ? new Date(event.event_time).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    : "No date provided"}
                </Text>
                <Text mt="sm" style={{ color: "#5A9DBF" }}>
                  {event.location || ""}
                </Text>
                <Text mt="sm">
                  {event.short_description || event.long_description || "No description."}
                </Text>
              </div>
            </Group>
          </Card>
        ))
      )}
    </Container>
  );
}

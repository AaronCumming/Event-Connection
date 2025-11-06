// routes/DetailPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Divider,
  Image,
  Loader,
} from "@mantine/core";
import { getEvents } from "../api/events";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    getEvents().then((data) => {
      const found = (data.results || data).find((e) => String(e.id) === id);
      setEvent(found);
    });
  }, [id]);

  if (!event)
    return (
      <Container py="xl">
        <Loader />
      </Container>
    );

  return (
    <Container size="lg" py="xl">
      <Button variant="light" color="#192C53" mb="md" onClick={() => navigate("/")}>
        ← Back to Home
      </Button>

      <Group align="flex-start" grow>
        {/* Text Left */}
            <div style={{ flex: 2 }}>
          <Title order={1} style={{ color: "#192C53" }}>
            {event.name}
          </Title>
          <Divider my="sm" />
          <Text size="lg" mb="sm">
            <strong>Date:</strong>{" "}
            {event.event_time
              ? new Date(event.event_time).toLocaleString([], {timeStyle: "short", dateStyle: "full"})
              : "No date provided"} - {event.event_time
              ? new Date(event.event_end_time).toLocaleString([], {timeStyle: "short"})
              : "No date provided"}
          </Text>
          <Text size="lg" mb="sm">
            <strong>Location:</strong> {event.location || "N/A"}
          </Text>
          <Text size="lg" mb="sm">
            <strong>Contact Info:</strong> {event.contact_email || "N/A"}
          </Text>
          <Divider my="sm" />
            <Text size="md" style={{ lineHeight: 1.6 }}>
            {event.short_description}
          </Text>

          <Text size="md" style={{ lineHeight: 1.6 }}>
            {event.long_description}
          </Text>

        </div>
        

        {/* Image Right */}
        <div style={{ flex: 1 }}>
          <Image
            src={
              event.image?.startsWith("http")
                ? event.image
                : `http://127.0.0.1:8000${event.image}`
            }
            alt={event.name}
            radius="md"
            style={{ border: "2px solid #192C53" }}
          />
        </div>

      </Group>
    </Container>
  );
}

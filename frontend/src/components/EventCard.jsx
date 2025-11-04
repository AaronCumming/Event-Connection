import { Card, Image, Text, Badge, Group } from '@mantine/core';
import dayjs from 'dayjs';

export default function EventCard({ event }) {
  return (
    <Card shadow="md" padding="lg" radius="md" bg="warmWhite">
      <Card.Section>
        <Image src={event.image} alt={event.name} height={180} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={700} c="concordiaBlue">{event.name}</Text>
        <Badge color="sky">{dayjs(event.event_time).format('MMM D, h:mm A')}</Badge>
      </Group>

      <Text size="sm" c="slate">
        {event.short_description}
      </Text>
    </Card>
  );
}

// components/MyButton.jsx
import { Button } from '@mantine/core';

export default function MyButton(props) {
  return (
    <Button
      variant="filled"
      color="#192c53ff"
      radius="lg"
      size="lg"
      style={{ fontWeight: 600, letterSpacing: 0.5 }}
      {...props}
    />
  );
}

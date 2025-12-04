import React, { useState, useEffect } from "react";
import { Group, Button, Image, Title, Container } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

export default function Banner() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#192C53",
        color: "white",
        padding: scrolled ? "6px 0" : "14px 0",
        borderBottom: "4px solid #5A9DBF",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.25s ease-in-out",
      }}
    >
      <Container size="xl">
        <Group position="apart" align="center" noWrap>
          {/* Left side: logo + text */}
          <Group align="center" spacing="sm" noWrap>
            <Title
              order={3}
              c="white"
              style={{
                fontSize: scrolled ? "1.3rem" : "1.6rem",
                transition: "all 0.25s ease-in-out",
                fontWeight: 700,
              }}
            >
              CUNE Events
            </Title>
          </Group>

          {/* Center buttons */}
          <Group spacing="md">
            <Button
              component={Link}
              to="/"
              variant={location.pathname === "/" ? "filled" : "outline"}
              color={location.pathname === "/" ? "#5A9DBF" : "white"}
              styles={{
                filled: { backgroundColor: "#5A9DBF", color: "#192C53" },
                outline: { borderColor: "#5A9DBF", color: "white" },
              }}
            >
              List View
            </Button>
            <Button
              component={Link}
              to="/calendar"
              variant={location.pathname === "/calendar" ? "filled" : "outline"}
              color={location.pathname === "/calendar" ? "#5A9DBF" : "white"}
              styles={{
                filled: { backgroundColor: "#5A9DBF", color: "#192C53" },
                outline: { borderColor: "#5A9DBF", color: "white" },
              }}
            >
              Calendar View
            </Button>
          </Group>
        </Group>
      </Container>
    </div>
  );
}

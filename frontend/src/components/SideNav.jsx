import { useEffect, useState } from "react";
import { Burger, Drawer, NavLink } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function SideNav({ initialSection }) {
  const isMobile = useMediaQuery("(max-width: 1400px)");

  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState(initialSection);


const sections = [
  { id: "section-ongoing", label: "Ongoing Today" },
  { id: "section-upcoming", label: "Upcoming Today" },
  { id: "section-tomorrow", label: "Tomorrow" },
  { id: "section-week", label: "This Week" },
];

  // Scroll spy intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { threshold: 0.25 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpened(false);
  };

  const menuLinks = (
    <div style={{ padding: "1.2rem" }}>
      {sections.map((s) => (
        <NavLink
          key={s.id}
          label={s.label}
          variant="subtle"
          color="gray"
          active={active === s.id}
          onClick={() => scrollToSection(s.id)}
          styles={{
            root: {
              marginBottom: "0.6rem",
              borderRadius: 10,
              padding: "0.6rem 0.9rem",
              fontWeight: 600,
              backgroundColor:
                active === s.id ? "#5A9DBF" : "transparent",
              color: active === s.id ? "#ffffffff" : "#333",
              transition: "background 0.2s ease",
            },
            label: { whiteSpace: "nowrap" },
          }}
        />
      ))}
    </div>
  );

  // Mobile version
  if (isMobile) {
    return (
      <>
        <Burger
          opened={opened}
          onClick={() => setOpened((v) => !v)}
          size="lg"
          color="#192C53"
          style={{
            position: "fixed",
            top: 120,           // <-- move below navbar
            left: 15,
            zIndex: 5000,
            opacity: 0.5,      // <-- more transparent
          }}
        />

        <Drawer
          opened={opened}
          onClose={() => setOpened(false)}
          size="60%"
          padding="sm"
        >
          {menuLinks}
        </Drawer>
      </>
    );
  }

  // Desktop persistent sidebar
  return (
    <div
      style={{
        width: 200,
        height: "100vh",
        borderRight: "2px solid #192C53",
        background: "rgba(246, 248, 255, 1)",
        paddingTop: "2rem",
        position: "fixed",        // <-- stays on screen while scrolling
        left: 0,
        top: 20,
        zIndex: 100,
        overflowY: "auto",
      }}
    >
      {menuLinks}
    </div>
  );
}

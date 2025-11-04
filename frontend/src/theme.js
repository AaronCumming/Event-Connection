import { MantineProvider, createTheme } from '@mantine/core';

export const concordiaTheme = createTheme({
  fontFamily: 'Gotham Book, sans-serif',
  headings: {
    fontFamily: 'Gotham Bold, sans-serif',
    sizes: {
      h1: { fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Gotham Black, sans-serif' },
      h2: { fontSize: '2rem', fontWeight: 700 },
    },
  },
  colors: {
    concordiaBlue: ['#192C53'],
    sky: ['#5A9DBF'],
    wheat: ['#E2C172'],
    slate: ['#646464'],
    nimbus: ['#C8C8C8'],
    warmWhite: ['#F7F4ED'],
  },
  primaryColor: 'concordiaBlue',
});

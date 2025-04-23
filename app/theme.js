import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFBC5B",
      light: "#FBEECD",
    },
    secondary: {
      main: "#EADDFF",
    },
    black: {
      main: "#000000", // 黒
      light: "#4F4F4F", // 灰色寄りの黒
      dark: "#000000", // 純粋な黒
    },
  },
});

export default theme;

import { PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    black: PaletteColorOptions;
  }

  interface PaletteOptions {
    black?: PaletteColorOptions;
  }
}

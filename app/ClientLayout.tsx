// app/ClientLayout.tsx
"use client";

import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import theme from "./theme"; // カスタムテーマの import

// MUIのテーマプロバイダーを使用して、アプリ全体にテーマを適用するためのレイアウトコンポーネント
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor={"primary.light"}>{children}</Box>
    </ThemeProvider>
  );
}

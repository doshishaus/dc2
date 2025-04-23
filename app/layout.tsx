// app/layout.tsx
import ClientLayout from "./ClientLayout";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ひだまりルート",
  description: "子供/女性向けの安全な経路検索アプリ",
};

// サーバーサイドのレイアウトコンポーネント
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

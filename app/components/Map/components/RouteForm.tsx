// components/RouteForm.tsx
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
} from "@mui/material";

export default function RouteForm({
  onSubmit,
}: {
  onSubmit: (
    from: { lat: number; lon: number },
    to: { lat: number; lon: number }
  ) => void;
}) {
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // 現在地取得
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const from = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        // 行き先を座標に変換
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            destination
          )}&format=json`
        );
        const data = await res.json();
        if (!data || data.length === 0) {
          alert("目的地が見つかりません");
          setLoading(false);
          return;
        }

        const to = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };

        // コールバック
        onSubmit(from, to);
        setLoading(false);
      },
      () => {
        alert("現在地の取得に失敗しました");
        setLoading(false);
      }
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          行き先検索
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="行き先（例: 京都駅）"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "検索中..." : "検索"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

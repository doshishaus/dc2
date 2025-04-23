"use client";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { RouteResult } from "@/types/route";

type Props = {
  onResult: (res: { routes: RouteResult[] }) => void;
};

// ルート検索フォーム
export default function RouteForm({ onResult }: Props) {
  const [from, setFrom] = useState({ lat: "", lon: "" });
  const [to, setTo] = useState({ lat: "", lon: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: {
          lat: parseFloat(from.lat),
          lon: parseFloat(from.lon),
        },
        to: {
          lat: parseFloat(to.lat),
          lon: parseFloat(to.lon),
        },
        transportMode: "pedestrian",
      }),
    });

    const data = await res.json();
    onResult(data);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5">Valhalla ルート検索フォーム</Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="subtitle1">出発地点</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="緯度"
              value={from.lat}
              onChange={(e) => setFrom({ ...from, lat: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="経度"
              value={from.lon}
              onChange={(e) => setFrom({ ...from, lon: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>

          <Typography variant="subtitle1">到着地点</Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="緯度"
              value={to.lat}
              onChange={(e) => setTo({ ...to, lat: e.target.value })}
              fullWidth
              size="small"
            />
            <TextField
              label="経度"
              value={to.lon}
              onChange={(e) => setTo({ ...to, lon: e.target.value })}
              fullWidth
              size="small"
            />
          </Box>

          <Button variant="contained" type="submit" fullWidth>
            検索
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

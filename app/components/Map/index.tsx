"use client";

import { useState } from "react";
import type { RouteResult } from "@/types/route";
import MapBoxClient from "./components/MapBoxClient";
import RouteForm from "./components/RouteForm";

// 経路検索と地図表示を行うコンポーネント
export default function Map() {
  const [routes, setRoutes] = useState<RouteResult[] | null>(null);
  const [from, setFrom] = useState<{ lat: number; lon: number } | null>(null);
  const [to, setTo] = useState<{ lat: number; lon: number } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleSearch = async (
    from: { lat: number; lon: number },
    to: { lat: number; lon: number }
  ) => {
    setFrom(from);
    setTo(to);
    setShowMap(false); // reset before search

    const res = await fetch("/api/valhalla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, transportMode: "transit" }),
    });

    const data = await res.json();
    setRoutes(data.routes);
    setShowMap(true); // only show map after result is ready
  };

  return (
    <>
      {!showMap ? (
        <RouteForm onSubmit={handleSearch} />
      ) : (
        <MapBoxClient
          route={routes?.[0] || null}
          from={from || undefined}
          to={to || undefined}
        />
      )}
    </>
  );
}

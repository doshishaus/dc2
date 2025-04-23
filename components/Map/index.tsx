"use client";

import { useState } from "react";
import { RouteResult } from "@/types/route";
import RouteForm from "./components/RouteForm";
import MapBoxClient from "./components/MapBoxClient";

// マップページのルートコンポーネント
export default function Map() {
  const [route, setRoute] = useState<RouteResult | null>(null);

  return (
    <div>
      {!route ? (
        <RouteForm onResult={(data) => setRoute(data.routes[0])} />
      ) : (
        <MapBoxClient route={route} />
      )}
    </div>
  );
}

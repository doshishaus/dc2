"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { FeatureCollection, Polygon } from "geojson";
import type { RouteResult } from "@/types/route";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Props = {
  route: RouteResult | null;
  avoidPolygons?: FeatureCollection<Polygon>;
  from?: { lat: number; lon: number };
  to?: { lat: number; lon: number };
};

export default function MapBoxClient({
  route,
  avoidPolygons,
  from,
  to,
}: Props) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);

  // 初期マップ生成
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [135.7677, 35.0038],
      zoom: 13,
    });

    mapRef.current = map;

    map.on("load", () => {
      console.log("🗺️ Map has loaded");
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // route, avoidPolygons, from, to の更新反映
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // 🔁 既存データのクリーンアップ
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route")) map.removeSource("route");

    if (map.getLayer("avoid-area")) map.removeLayer("avoid-area");
    if (map.getSource("avoid")) map.removeSource("avoid");

    // 🛣️ 経路描画
    if (route) {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route.geometry,
          properties: {},
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#3b82f6",
          "line-width": 4,
        },
      });
    }

    // 🚫 回避エリア描画
    if (avoidPolygons) {
      map.addSource("avoid", {
        type: "geojson",
        data: avoidPolygons,
      });

      map.addLayer({
        id: "avoid-area",
        type: "fill",
        source: "avoid",
        paint: {
          "fill-color": "#ff0000",
          "fill-opacity": 0.3,
        },
      });
    }

    // 🟢 出発地マーカー
    if (from) {
      new mapboxgl.Marker({ color: "green" })
        .setLngLat([from.lon, from.lat])
        .addTo(map);
    }

    // 🔴 到着地マーカー
    if (to) {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([to.lon, to.lat])
        .addTo(map);
    }
  }, [route, avoidPolygons, from, to]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}

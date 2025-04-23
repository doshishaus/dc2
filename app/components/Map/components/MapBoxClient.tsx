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
      zoom: 16,
    });

    mapRef.current = map;
    map.on("load", () => {
      console.log("🗺️ Map has loaded");

      // 🔽 3D ビル表示レイヤーを追加
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });

      // 🔄 視点を斜めに設定（初期カメラ）
      map.setPitch(30); // 傾き（0~85）
      // map.setBearing(-20); // 回転（-180~180）
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // route, avoidPolygons, from, to の更新反映
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const drawFeatures = () => {
      console.log("🟢 渡された route geometry:", route?.geometry);

      // 既存データの削除
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getSource("route")) map.removeSource("route");
      if (map.getLayer("avoid-area")) map.removeLayer("avoid-area");
      if (map.getSource("avoid")) map.removeSource("avoid");

      // 経路の描画
      if (route) {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route.geometry,
            properties: {},
          },
        });

        map.addLayer(
          {
            id: "route-line",
            type: "line",
            source: "route",
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
            },
          },
          "3d-buildings"
        );

        const bounds = new mapboxgl.LngLatBounds();
        console.log("🚩 GeoJSON coordinates:", route.geometry.coordinates);
        route.geometry.coordinates.forEach(([lon, lat]) => {
          if (
            typeof lat === "number" &&
            typeof lon === "number" &&
            lat >= -90 &&
            lat <= 90 &&
            lon >= -180 &&
            lon <= 180
          ) {
            bounds.extend([lon, lat]); // LngLatBounds は [lon, lat] 順
          } else {
            console.warn("❌ 無効な座標:", [lat, lon]);
          }
        });

        map.fitBounds(bounds, { padding: 50, pitch: 30, zoom: 16 });
      }

      // 回避ポリゴン
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

      // 出発マーカー
      if (from) {
        new mapboxgl.Marker({ color: "green" })
          .setLngLat([from.lon, from.lat])
          .addTo(map);
      }

      // 到着マーカー
      if (to) {
        new mapboxgl.Marker({ color: "red" })
          .setLngLat([to.lon, to.lat])
          .addTo(map);
      }
    };

    if (map.isStyleLoaded()) {
      drawFeatures();
    } else {
      map.once("load", drawFeatures);
    }
  }, [route, avoidPolygons, from, to]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />;
}

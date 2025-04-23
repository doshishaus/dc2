import { NextRequest, NextResponse } from "next/server";
import polyline from "@mapbox/polyline";
import { ValhallaRequest, RouteResult, ValhallaResponse } from "@/types/route";
import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  LineString,
} from "geojson";

// Valhallaリクエストオブジェクトを組み立て
const buildValhallaRequest = (data: {
  from: { lat: number; lon: number };
  to: { lat: number; lon: number };
  departureTime?: string;
  transportMode: ValhallaRequest["costing"];
  avoidPolygons?: FeatureCollection<Polygon | MultiPolygon>;
}): ValhallaRequest => {
  const valhallaReq: ValhallaRequest = {
    locations: [
      { lat: data.from.lat, lon: data.from.lon },
      { lat: data.to.lat, lon: data.to.lon },
    ],
    costing: data.transportMode,
    directions_options: {
      units: "kilometers",
    },
  };

  if (data.departureTime) {
    valhallaReq.date_time = {
      type: 1,
      value: data.departureTime,
    };
  }

  if (data.avoidPolygons) {
    valhallaReq.avoid_polygons = data.avoidPolygons;
  }

  return valhallaReq;
};

// 🔄 Polyline を GeoJSON LineString にデコード（ここが重要！）
const decodePolylineToGeoJson = (encoded: string): LineString => {
  const coordinates = polyline
    .decode(encoded, 6)
    .map(([lat, lon]) => [lon, lat]); // precision = 6 に！
  return {
    type: "LineString",
    coordinates,
  };
};

// エンドポイント本体
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const valhallaBody = buildValhallaRequest(data);
    const valhallaUrl = `${process.env.VALHALLA_API_URL}/route`;

    const res = await fetch(valhallaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valhallaBody),
    });

    if (!res.ok) {
      throw new Error(`Valhalla error: ${res.status}`);
    }

    const json: ValhallaResponse = await res.json();

    const routes: RouteResult[] = json.trip.legs.map((leg) => ({
      geometry: decodePolylineToGeoJson(leg.shape),
      summary: {
        time: leg.summary.time,
        length: leg.summary.length,
      },
      transitInfo: leg.transit_info
        ? {
            line: leg.transit_info.short_name,
            operator: leg.transit_info.operator_name,
            stops: leg.transit_info.transit_stops.map((stop) => stop.name),
          }
        : undefined,
    }));

    return NextResponse.json({ routes });
  } catch (err) {
    console.error("Valhalla APIでエラー:", err);
    return NextResponse.json({ error: "ルート取得失敗" }, { status: 500 });
  }
}

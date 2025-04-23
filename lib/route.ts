import { NextRequest, NextResponse } from "next/server";
import polyline from "@mapbox/polyline";
import { ValhallaRequest, RouteResult, ValhallaResponse } from "@/types/route";
import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  LineString,
} from "geojson";

// 🔧 Valhallaリクエストオブジェクトを組み立て
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

// 🧭 Polyline を GeoJSON LineString に変換
const decodePolylineToGeoJson = (encoded: string): LineString => {
  const coordinates = polyline.decode(encoded).map(([lat, lon]) => [lon, lat]);
  return {
    type: "LineString",
    coordinates,
  };
};

// 🎯 POST APIエンドポイント
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("🪵 1. 受け取ったリクエスト:", data);

    const valhallaBody = buildValhallaRequest(data);
    const valhallaUrl = `${process.env.VALHALLA_API_URL}/route`;

    console.log("🪵 2. Valhalla URL:", valhallaUrl);
    console.log("🪵 3. Valhalla Body:", JSON.stringify(valhallaBody, null, 2));

    const res = await fetch(valhallaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valhallaBody),
    });

    const rawText = await res.text(); // ← JSON変換前にテキストでログ
    console.log("🪵 4. Valhalla生レスポンス:", rawText);
    console.log("🪵 5. Valhallaステータス:", res.status);

    if (!res.ok) {
      throw new Error(`Valhalla responded with status ${res.status}`);
    }

    const json: ValhallaResponse = JSON.parse(rawText); // ← ここで型変換
    console.log("🪵 6. Valhalla JSON パース結果:", json);

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

    console.log("🪵 7. 加工したRouteResult[]:", routes);
    return NextResponse.json({ routes });
  } catch (err: any) {
    console.error("❌ Valhalla APIでエラー:", err.message || err);
    return NextResponse.json({ error: "ルート取得失敗" }, { status: 500 });
  }
}

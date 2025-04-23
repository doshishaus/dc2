import type {
  FeatureCollection,
  Polygon,
  MultiPolygon,
  LineString,
} from "geojson";

export type LatLng = {
  lat: number;
  lon: number;
};

// リクエストの型定義
export type ValhallaRequest = {
  locations: [LatLng, LatLng];
  costing: "pedestrian" | "bicycle" | "transit" | "multimodal";
  directions_options: {
    units: "kilometers";
  };
  date_time?: {
    type: 1;
    value: string; // "2025-04-18T08:30"
  };
  avoid_polygons?: FeatureCollection<Polygon | MultiPolygon>;
};

export type ValhallaResponse = {
  trip: {
    locations: {
      lat: number;
      lon: number;
      type: string;
      original_index?: number;
    }[];
    legs: ValhallaLeg[];
    status: number;
    status_message: string;
  };
};

export type ValhallaLeg = {
  shape: string; // Polyline encoded string
  summary: {
    time: number; // seconds
    length: number; // km
    cost?: number;
  };
  maneuvers: ValhallaManeuver[];
  transit_info?: ValhallaTransitInfo;
};

export type ValhallaManeuver = {
  type: number;
  instruction: string;
  travel_mode: string;
  travel_type: string;
};

export type ValhallaTransitInfo = {
  onestop_id: string;
  short_name: string;
  long_name: string;
  headsign: string;
  operator_name: string;
  operator_url?: string;
  transit_stops: {
    name: string;
    lat: number;
    lon: number;
    onestop_id?: string;
  }[];
};

// フロント側で受け取る用の型定義
export type RouteResult = {
  geometry: LineString;
  summary: {
    time: number;
    length: number;
  };
  transitInfo?: {
    line: string;
    operator: string;
    stops: string[];
  };
};

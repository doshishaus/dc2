"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 既存の Leg 型
export type Leg = {
  startTime: string;
  endTime: string;
  fromName: string;
  fromLatitude: string; // string 型
  fromLongitude: string; // string 型
  toName: string;
  toLatitude: string; // string 型
  toLongitude: string; // string 型
  distance: string;
  mode: string;
  agency?: string;
  route?: string;
  headsign?: string;
  direction?: string;
  delay?: string; // string 型
  vehicleId?: string;
};

// 型変換後の Leg 型
export type LegWithNumbers = {
  startTime: string;
  endTime: string;
  fromName: string;
  fromLatitude: number; // number 型
  fromLongitude: number; // number 型
  toName: string;
  toLatitude: number; // number 型
  toLongitude: number; // number 型
  distance: string;
  mode: string;
  agency?: string;
  route?: string;
  headsign?: string;
  direction?: string;
  delay?: number; // number 型
  vehicleId?: string;
};

// Itinerary 型と型変換後の Itinerary 型
export type Itinerary = {
  duration: number;
  legs: Leg[];
};

export type ItineraryWithNumbers = {
  duration: number;
  legs: LegWithNumbers[];
};

// 型変換関数
export function convertLegsToNumbers(legs: Leg[]): LegWithNumbers[] {
  return legs.map((leg) => ({
    ...leg,
    fromLatitude: parseFloat(leg.fromLatitude) || 0,
    fromLongitude: parseFloat(leg.fromLongitude) || 0,
    toLatitude: parseFloat(leg.toLatitude) || 0,
    toLongitude: parseFloat(leg.toLongitude) || 0,
    delay: leg.delay ? parseFloat(leg.delay) : undefined, // delay を数値に変換
  }));
}

// RouteSearchContext の型定義
type RouteSearchContextType = {
  itineraries: Itinerary[] | null;
  setItineraries: (itineraries: Itinerary[]) => void;
  selectedRoute: ItineraryWithNumbers | null;
  setSelectedRoute: (route: Itinerary) => void;
};

// Context の作成
const RouteSearchContext = createContext<RouteSearchContextType | undefined>(
  undefined
);

// Provider コンポーネント
export function RouteSearchProvider({ children }: { children: ReactNode }) {
  const [itineraries, setItineraries] = useState<Itinerary[] | null>(null);
  const [selectedRoute, setSelectedRoute] =
    useState<ItineraryWithNumbers | null>(null);

  // 経路データを設定し、型変換を適用する
  const handleSetSelectedRoute = (route: Itinerary) => {
    const convertedRoute: ItineraryWithNumbers = {
      ...route,
      legs: convertLegsToNumbers(route.legs),
    };
    setSelectedRoute(convertedRoute);
  };

  return (
    <RouteSearchContext.Provider
      value={{
        itineraries,
        setItineraries,
        selectedRoute,
        setSelectedRoute: handleSetSelectedRoute,
      }}
    >
      {children}
    </RouteSearchContext.Provider>
  );
}

// Context を使用するカスタムフック
export function useRouteSearch() {
  const context = useContext(RouteSearchContext);
  if (!context) {
    throw new Error("useRouteSearch must be used within a RouteSearchProvider");
  }
  return context;
}

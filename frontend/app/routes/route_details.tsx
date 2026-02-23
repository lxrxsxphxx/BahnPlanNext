import React, { useEffect, useState } from "react";

type Stop = {
  seq: number;
  station_id: number;
  station_name: string;
  km: number;
  arr_a: string | null;
  dep_a: string | null;
  arr_b: string | null;
  dep_b: string | null;
};

type VehicleTypes = {
  IR_WAGEN: boolean;
  IC_WAGEN: boolean;
  ICE_ZUEGE: boolean;
};

type RouteDetail = {
  uuid: string;
  name: string;
  start_station_id: number;
  end_station_id: number;
  distance_km: number;
  track_type: string;
  min_service_percent: number;
  min_trips_per_week_dir: number;
  service_speed_kmh: number;
  max_train_length_wagons: number;
  capacity_recommendation_seats: number;
  cost_per_trip_eur: number;
  fahrzeugtypen: VehicleTypes;
  special_notes: string;
  stops: Stop[];
};

type Props = {
  routeUuid: string;
};

const RouteDetailView: React.FC<Props> = ({ routeUuid = "9dc6cdd5-6559-4a92-9ec3-d226a75e855d"
 }) => {
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8000/trasse/${routeUuid}`);
        if (!res.ok) {
          throw new Error(`Fehler ${res.status}: ${res.statusText}`);
        }
        const data: RouteDetail = await res.json();
        setRoute(data);
      } catch (err: any) {
        setError(err.message || "Fehler beim Laden der Trasse");
      } finally {
        setLoading(false);
      }
    };
    fetchRouteDetail();
  }, [routeUuid]);

  if (loading) return <p  className="text-white">Lädt...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!route) return <p className="text-white">Keine Trasse gefunden</p>;

  const { fahrzeugtypen } = route;

  const renderVehicle = (name: string, allowed: boolean, colorClass: string) => (
    <div className={`flex items-center gap-2 ${colorClass}`}>
    <span>{allowed ? "✔" : "✕"}</span>
    <span className="font-medium">{name}</span>
  </div>
  );

  return (
    <div className="bg-gray-900 text-white p-6 max-w-4xl mx-auto rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{route.name}</h2>

      <h3 className="text-lg font-semibold mb-2">Trassendetails</h3>

      <ul className="mb-4 space-y-1 list-disc list-inside">
        <li><strong>Trassenart:</strong> {route.track_type}</li>
        <li>
          <strong>Mindestbedienung:</strong> {route.min_service_percent}% aller möglichen Trassen (= {route.min_trips_per_week_dir} Fahrten pro Woche und Richtung)
        </li>
        <li><strong>Bediengeschwindigkeit:</strong> {route.service_speed_kmh} km/h</li>
        <li><strong>Maximale Zuglänge:</strong> {route.max_train_length_wagons} Wagen</li>
        <li><strong>Kapazitätsempfehlung:</strong> {route.capacity_recommendation_seats} Plätze*</li>
        <li>
          <strong>Trassenlänge:</strong> {route.distance_km.toLocaleString("de-DE")} km ({route.cost_per_trip_eur.toLocaleString("de-DE")} € Trassenkosten je Fahrt)
        </li>
        <li>
          <strong>Einsetzbare Fahrzeugtypen:</strong> <br />
          {renderVehicle("IR-Wagen", fahrzeugtypen.IR_WAGEN, "text-blue-400")}
          {renderVehicle("IC-Wagen", fahrzeugtypen.IC_WAGEN, "text-red-400")}
          {renderVehicle("ICE-Züge", fahrzeugtypen.ICE_ZUEGE, "text-green-400")}
        </li>
        <li><strong>Besonderheiten der Trasse:</strong> {route.special_notes}</li>
      </ul>

      <h3 className="text-lg font-semibold mb-2">Trassenlauf</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-2 py-1 border-b border-gray-700">km</th>
              <th className="px-2 py-1 border-b border-gray-700">Bahnhof</th>
              <th className="px-2 py-1 border-b border-gray-700">an</th>
              <th className="px-2 py-1 border-b border-gray-700">ab</th>
              <th className="px-2 py-1 border-b border-gray-700">an</th>
              <th className="px-2 py-1 border-b border-gray-700">ab</th>
            </tr>
          </thead>
          <tbody>
            {route.stops.map((stop) => (
              <tr key={stop.seq} className="even:bg-gray-800">
                <td className="px-2 py-1 text-center">{stop.km}</td>
                <td className="px-2 py-1 text-center">{stop.station_name}</td>
                <td className="px-2 py-1 text-center">{stop.arr_a || "-"}</td>
                <td className="px-2 py-1 text-center">{stop.dep_a || "-"}</td>
                <td className="px-2 py-1 text-center">{stop.arr_b || "-"}</td>
                <td className="px-2 py-1 text-center">{stop.dep_b || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteDetailView;

'use client';

import { useState, useEffect } from "react";
import WagenCard from "../components/wagen/WagenCard";
import type { Wagen } from "../components/wagen/WagenCard";
import { fetchCompanyInfo } from '@/services/gesellschaftsbereich';
import { API_ENDPOINTS, apiFetch } from "@/services/api";

interface Lok {
  id: number;
  traction_type: string;
  type_name: string;
  suitable_passenger_max_wagons: number;
  leasing_model: number;
}

export default function BeschaffungWagen() {
  const [company, setCompany] = useState<{ id?: number; name?: string; capital?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [lokList, setLokList] = useState<Lok[]>([]);

  // key = lokId, value = wagenId
  const [lokAssignments, setLokAssignments] = useState<Record<number, number>>({});

  // key = lokId, value = Anzahl zugewiesener Wagen
  const [assignedWagenCount, setAssignedWagenCount] = useState<Record<number, number>>({});

  const cashBalance = company?.capital ?? 4000000;

  // --- Load Company ---
  useEffect(() => {
    async function loadCompany() {
      try {
        const info = await fetchCompanyInfo();
        setCompany(info);
      } catch (err) {
        console.error("Fehler beim Laden der Company:", err);
        setCompany(null);
      }
    }
    loadCompany();
  }, []);

  // --- Load meine Loks ---
  useEffect(() => {
    async function loadLoks() {
      try {
        const res = await apiFetch(API_ENDPOINTS.myCompaniesLoks);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Transform to Lok[]
        const loks: Lok[] = data.map((lok: any) => ({
          id: lok.id,
          traction_type: lok.traction_type,
          type_name: lok.type_name,
          suitable_passenger_max_wagons: lok.suitable_passenger_max_wagons,
          leasing_model: lok.leasing_model,
        }));
        setLokList(loks);
      } catch (err) {
        console.error("Fehler beim Laden der Loks:", err);
        setLokList([]);
      } finally {
        setLoading(false);
      }
    }
    loadLoks();
  }, []);

  // --- Wagen sample data ---
  const wagenData: Wagen[] = [
    { id: 1, name: "Silberlinge", image: "/silberlinge.png", vmax: 140, preisStandard: 600000, preisSteuer: 900000, kostenKm: 0.15, kapazitaet: 80 },
    { id: 2, name: "S-Bahn-Wagen", image: "/sbahnwagen.png", vmax: 140, preisStandard: 750000, preisSteuer: 1125000, kostenKm: 0.18, kapazitaet: 70 },
    { id: 3, name: "Doppelstockwagen", image: "/doppelstock.png", vmax: 160, preisStandard: 1000000, preisSteuer: 1500000, kostenKm: 0.2, kapazitaet: 120 },
  ];

  // --- Loading or not logged in ---
  if (loading) {
    return <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center"><p>Lädt...</p></div>;
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center px-8">
        <div className="rounded-md bg-gray-800/60 p-6 text-center text-gray-300">
          <p className="text-lg font-medium">Bitte eingeloggt sein, um Wagen zu sehen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white px-[40px] py-8 md:pl-[100px]">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shop &gt; Wagen</h1>
        <div className="rounded-md bg-gray-800 px-4 py-2 text-sm">
          💰 {cashBalance.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
        </div>
      </div>

      <div className="space-y-7">
        {wagenData.map((wagen) => (
          <WagenCard
            key={wagen.id}
            wagen={wagen}
            cashBalance={cashBalance}
            lokList={lokList}
            lokAssignments={lokAssignments}
            assignedWagenCount={assignedWagenCount}
            onLokAssignmentChange={(newAssignments, newAssignedCount) => {
              setLokAssignments(newAssignments);
              setAssignedWagenCount(newAssignedCount);
            }}
          />
        ))}
      </div>
    </div>
  );
}

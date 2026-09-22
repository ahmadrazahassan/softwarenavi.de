"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatRating } from "@/lib/utils/format";

type Row = { axis: string; a: number; b: number };

/** Five axes: Bedienbarkeit, Preis-Leistung, Kundenservice, Funktionsumfang, Gesamt. Text alternative included. */
export function ComparisonRadarChart({ data, nameA, nameB, colorA, colorB }: { data: Row[]; nameA: string; nameB: string; colorA: string; colorB: string }) {
  const summary = data.map((d) => `${d.axis}: ${nameA} ${formatRating(d.a)}, ${nameB} ${formatRating(d.b)}`).join("; ");
  return (
    <figure>
      <div className="h-[340px] w-full" role="img" aria-label={`Radardiagramm der Bewertungen. ${summary}`}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="currentColor" className="text-zinc-200" />
            <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "currentColor" }} className="text-muted-foreground" />
            <PolarRadiusAxis domain={[0, 5]} tickCount={6} tick={false} axisLine={false} />
            <Radar name={nameA} dataKey="a" stroke={colorA} fill={colorA} fillOpacity={0.22} strokeWidth={2} />
            <Radar name={nameB} dataKey="b" stroke={colorB} fill={colorB} fillOpacity={0.18} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Tooltip formatter={(v) => formatRating(Number(v))} contentStyle={{ borderRadius: 12, fontSize: 13 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="sr-only">
      <table>
        <caption>Bewertungen im Vergleich</caption>
        <thead>
          <tr>
            <th scope="col">Kriterium</th>
            <th scope="col">{nameA}</th>
            <th scope="col">{nameB}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.axis}>
              <th scope="row">{d.axis}</th>
              <td>{formatRating(d.a)}</td>
              <td>{formatRating(d.b)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </figure>
  );
}

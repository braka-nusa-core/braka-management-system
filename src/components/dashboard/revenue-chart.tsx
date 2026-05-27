"use client";

import { useState } from "react";
import { REVENUE_DATA } from "@/constants/mock-data/dashboard";
import { SectionHeader } from "./section-header";

function formatRp(value: number): string {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const WIDTH = 900;
const HEIGHT = 220;
const PADDING = { top: 20, right: 20, bottom: 36, left: 56 };
const INNER_W = WIDTH - PADDING.left - PADDING.right;
const INNER_H = HEIGHT - PADDING.top - PADDING.bottom;

export function RevenueChart() {
  const [hovered, setHovered] = useState<number | null>(null);

  const maxVal = Math.max(...REVENUE_DATA.map((d) => Math.max(d.revenue, d.target)));
  const minVal = 0;
  const range = maxVal - minVal;

  const xStep = INNER_W / (REVENUE_DATA.length - 1);

  function xPos(i: number) {
    return PADDING.left + i * xStep;
  }
  function yPos(val: number) {
    return PADDING.top + INNER_H - ((val - minVal) / range) * INNER_H;
  }

  const revPath = REVENUE_DATA.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d.revenue)}`).join(" ");
  const tgtPath = REVENUE_DATA.map((d, i) => `${i === 0 ? "M" : "L"}${xPos(i)},${yPos(d.target)}`).join(" ");

  // Area fill under revenue line
  const areaPath =
    revPath +
    ` L${xPos(REVENUE_DATA.length - 1)},${PADDING.top + INNER_H} L${PADDING.left},${PADDING.top + INNER_H} Z`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * range);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111827] p-5">
      <SectionHeader
        title="Monthly Revenue"
        description="Full year overview vs target"
        className="mb-5"
      />

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="min-w-[420px] w-full"
          style={{ height: HEIGHT }}
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y grid + labels */}
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={PADDING.left + INNER_W}
                y1={yPos(tick)}
                y2={yPos(tick)}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 8}
                y={yPos(tick) + 4}
                textAnchor="end"
                fontSize={10}
                fill="#A1A1AA"
              >
                {formatRp(tick)}
              </text>
            </g>
          ))}

          {/* Area */}
          <path d={areaPath} fill="url(#rev-grad)" />

          {/* Target dashed line */}
          <path
            d={tgtPath}
            fill="none"
            stroke="rgba(163,230,53,0.25)"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />

          {/* Revenue line */}
          <path
            d={revPath}
            fill="none"
            stroke="#A3E635"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* X labels + interaction targets */}
          {REVENUE_DATA.map((d, i) => {
            const x = xPos(i);
            const y = yPos(d.revenue);
            const isHov = hovered === i;
            return (
              <g key={d.month}>
                {/* Hover zone */}
                <rect
                  x={x - xStep / 2}
                  y={PADDING.top}
                  width={xStep}
                  height={INNER_H}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                />
                {/* X label */}
                <text
                  x={x}
                  y={PADDING.top + INNER_H + 20}
                  textAnchor="middle"
                  fontSize={10}
                  fill={isHov ? "#F4F4F5" : "#A1A1AA"}
                >
                  {d.month}
                </text>
                {/* Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHov ? 5 : 3}
                  fill={isHov ? "#A3E635" : "#111827"}
                  stroke="#A3E635"
                  strokeWidth={2}
                  style={{ transition: "r 0.15s" }}
                />
                {/* Tooltip */}
                {isHov && (
                  <g>
                    <rect
                      x={x - 52}
                      y={y - 38}
                      width={104}
                      height={30}
                      rx={6}
                      fill="#18181B"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth={1}
                    />
                    <text x={x} y={y - 22} textAnchor="middle" fontSize={11} fill="#A3E635" fontWeight="600">
                      {formatRp(d.revenue)}
                    </text>
                    <text x={x} y={y - 11} textAnchor="middle" fontSize={9} fill="#A1A1AA">
                      Target: {formatRp(d.target)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full bg-[#A3E635]" />
          <span className="text-xs text-[#A1A1AA]">Revenue</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full border-t border-dashed border-[#A3E635]/40" />
          <span className="text-xs text-[#A1A1AA]">Target</span>
        </div>
      </div>
    </div>
  );
}

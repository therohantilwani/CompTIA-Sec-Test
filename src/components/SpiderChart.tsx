"use client"

import { useState } from "react"

interface SpiderDataPoint {
  label: string
  value: number // 0-100
  target: number
  color: string
}

interface SpiderChartProps {
  data: SpiderDataPoint[]
  size?: number
}

// Robust text wrapping helper to keep lines clean and within bounds
function wrapText(text: string, maxLen = 16): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let currentLine = ""
  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLen) {
      currentLine = (currentLine + " " + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

export default function SpiderChart({ data, size = 280 }: SpiderChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.38
  const levels = 5
  const labelOffset = 26

  const angleStep = (2 * Math.PI) / data.length
  const startAngle = -Math.PI / 2 // Start at top

  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep
    const r = (value / 100) * radius
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  }

  // Generate grid paths (pentagon rings)
  const gridPaths = []
  const gridLabels = []
  for (let level = 1; level <= levels; level++) {
    const pct = (level / levels) * 100
    const points = data.map((_, i) => getPoint(i, pct))
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z"
    
    // Draw concentric ring lines (theme-aware slate colors)
    gridPaths.push(
      <path
        key={level}
        d={d}
        fill="none"
        strokeWidth={level === levels ? 1.5 : 1}
        className={`transition-all duration-300 ${
          level === levels ? "stroke-slate-400 dark:stroke-slate-600" : "stroke-slate-200 dark:stroke-slate-800"
        }`}
      />
    )

    // Add scale labels along the top axis (index 0, angle = -Math.PI / 2)
    const labelPt = getPoint(0, pct)
    gridLabels.push(
      <text
        key={`grid-label-${level}`}
        x={labelPt.x + 6}
        y={labelPt.y + 3}
        className="text-[8px] fill-slate-500 font-semibold select-none transition-all duration-300"
      >
        {pct}%
      </text>
    )
  }

  // Axis lines
  const axisLines = data.map((d, i) => {
    const p = getPoint(i, 100)
    const isHovered = hoveredIndex === i
    const isAnyHovered = hoveredIndex !== null
    
    // Axis line colors are mapped to domain colors, highlighting on hover
    const opacity = isHovered ? 0.9 : isAnyHovered ? 0.15 : 0.4
    const strokeWidth = isHovered ? 2.5 : 1

    return (
      <line
        key={`axis-${i}`}
        x1={cx}
        y1={cy}
        x2={p.x}
        y2={p.y}
        stroke={isHovered ? d.color : undefined}
        strokeOpacity={opacity}
        strokeWidth={strokeWidth}
        className={`transition-all duration-300 ease-out cursor-pointer ${
          isHovered ? "" : "stroke-slate-200 dark:stroke-slate-800"
        }`}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      />
    )
  })

  // Target area (pentagon at 75% passing threshold)
  const targetPoints = data.map((_, i) => getPoint(i, 75))
  const targetPath = targetPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z"

  // Actual data polygon
  const dataPoints = data.map((d, i) => getPoint(i, d.value))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + "Z"

  // Labels around the perimeter
  const labels = data.map((d, i) => {
    const angle = startAngle + i * angleStep
    const isHovered = hoveredIndex === i
    const isAnyHovered = hoveredIndex !== null

    // Push hovered label slightly further out for a nice pop effect
    const currentLabelOffset = labelOffset + (isHovered ? 4 : 0)
    const lx = cx + (radius + currentLabelOffset) * Math.cos(angle)
    const ly = cy + (radius + currentLabelOffset) * Math.sin(angle)

    const anchor =
      Math.abs(Math.cos(angle)) < 0.1 ? "middle" : Math.cos(angle) > 0 ? "start" : "end"
    
    const opacity = isHovered ? 1 : isAnyHovered ? 0.25 : 0.8

    // Wrap label and center vertically
    const lines = wrapText(d.label, 16)
    const lineHeight = 11
    const startDy = -((lines.length - 1) * lineHeight) / 2

    return (
      <g
        key={`label-${i}`}
        className="transition-all duration-300 ease-out cursor-pointer"
        style={{ opacity }}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <text
          x={lx}
          y={ly}
          textAnchor={anchor}
          dominantBaseline="middle"
          fill={isHovered ? d.color : undefined}
          className={`text-[9.5px] ${isHovered ? "font-bold" : "font-semibold"} select-none ${
            isHovered ? "" : "fill-slate-600 dark:fill-slate-400"
          }`}
        >
          {lines.map((line, idx) => (
            <tspan
              key={idx}
              x={lx}
              dy={idx === 0 ? startDy : lineHeight}
            >
              {line}
            </tspan>
          ))}
        </text>
      </g>
    )
  })

  // Value labels on data points (with dynamic radial offset badges to prevent overlap at center)
  const valueLabels = data.map((d, i) => {
    const p = getPoint(i, d.value)
    const angle = startAngle + i * angleStep
    
    // Radial offset: push the badge 14px outwards along the axis line
    const radialOffset = 14
    const vx = p.x + Math.cos(angle) * radialOffset
    const vy = p.y + Math.sin(angle) * radialOffset

    const isHovered = hoveredIndex === i
    const isAnyHovered = hoveredIndex !== null
    const opacity = isHovered ? 1 : isAnyHovered ? 0.15 : 0.8
    
    const scoreColor = d.value >= 75 ? "#10b981" : d.value >= 50 ? "#f59e0b" : "#ef4444"

    return (
      <g
        key={`val-${i}`}
        className="transition-all duration-300 ease-out cursor-pointer"
        style={{ opacity }}
        onMouseEnter={() => setHoveredIndex(i)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Theme-aware background badge to shield the value text from grid lines */}
        <rect
          x={vx - 14}
          y={vy - 7}
          width={28}
          height={13}
          rx={3}
          fillOpacity={isHovered ? 0.95 : 0.8}
          stroke={isHovered ? scoreColor : undefined}
          strokeWidth={isHovered ? 1.5 : 0.5}
          className={`transition-all duration-300 ease-out shadow-lg fill-slate-50 dark:fill-slate-950 ${
            isHovered ? "" : "stroke-slate-200 dark:stroke-slate-800"
          }`}
        />
        <text
          x={vx}
          y={vy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[9px] font-bold select-none"
          fill={scoreColor}
        >
          {d.value}%
        </text>
      </g>
    )
  })

  // Dynamic color for the data shape fill/stroke
  const activeColor = hoveredIndex !== null ? data[hoveredIndex].color : "#6366f1"

  return (
    <div className="flex flex-col items-center select-none w-full">
      <div className="relative">
        <svg
          width={size + 100}
          height={size + 100}
          viewBox={`-50 -50 ${size + 100} ${size + 100}`}
          className="overflow-visible"
        >
          <defs>
            {/* Dynamic radial gradient centered inside the chart */}
            <radialGradient id="spiderGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeColor} stopOpacity={0.03} />
              <stop offset="70%" stopColor={activeColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={activeColor} stopOpacity={0.3} />
            </radialGradient>
          </defs>

          {/* Grid lines */}
          {gridPaths}
          {gridLabels}
          
          {/* Axis lines */}
          {axisLines}

          {/* Target zone (75% passing) */}
          <path
            d={targetPath}
            fill="rgba(16, 185, 129, 0.02)"
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="4,3"
            strokeOpacity={hoveredIndex !== null ? 0.2 : 0.5}
            className="transition-all duration-300 ease-out"
          />

          {/* Data path polygon */}
          <path
            d={dataPath}
            fill="url(#spiderGradient)"
            stroke={activeColor}
            strokeWidth={2.5}
            className="transition-all duration-300 ease-out"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const p = getPoint(i, d.value)
            const isHovered = hoveredIndex === i
            const isAnyHovered = hoveredIndex !== null
            const radius = isHovered ? 6 : 3.5
            const opacity = isHovered ? 1 : isAnyHovered ? 0.25 : 1

            return (
              <circle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r={radius}
                fill={d.color}
                strokeWidth={isHovered ? 2 : 1.5}
                className="transition-all duration-300 ease-out cursor-pointer stroke-white dark:stroke-slate-950"
                strokeOpacity={opacity}
                fillOpacity={opacity}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )
          })}

          {/* Value Labels */}
          {valueLabels}

          {/* Domain Labels */}
          {labels}

          {/* Center Dot */}
          <circle cx={cx} cy={cy} r={3} className="fill-slate-400 dark:fill-slate-600" />
        </svg>

        {/* Hover info banner overlay at the bottom-center of the SVG container */}
        {hoveredIndex !== null && (
          <div className="absolute left-1/2 bottom-[-8px] transform -translate-x-1/2 bg-slate-100 dark:bg-slate-900 border border-black/10 dark:border-white/10 text-foreground dark:text-white text-[10px] px-2.5 py-1 rounded-full font-medium shadow-md transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: data[hoveredIndex].color }}
            />
            <span className="font-bold">{data[hoveredIndex].label}:</span>
            <span>Score {data[hoveredIndex].value}%</span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-bold">Passing: 75%</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-6 text-[11px] theme-text-muted font-semibold">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500" />
          <span>Your score</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded border border-dashed border-emerald-500 bg-emerald-500/10" />
          <span>Passing (75%)</span>
        </div>
      </div>
    </div>
  )
}

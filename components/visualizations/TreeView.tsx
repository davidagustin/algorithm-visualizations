'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TreeVisualization, HIGHLIGHT_COLORS } from '@/lib/types';

interface TreeViewProps {
  visualization: TreeVisualization;
}

interface NodePosition {
  index: number;
  value: number;
  x: number;
  y: number;
  level: number;
}

interface Edge {
  parentX: number;
  parentY: number;
  childX: number;
  childY: number;
}

function getColor(colorName: string | undefined) {
  if (!colorName || !HIGHLIGHT_COLORS[colorName]) {
    return HIGHLIGHT_COLORS['default'];
  }
  return HIGHLIGHT_COLORS[colorName];
}

// Map Tailwind class names to actual CSS colors for SVG usage
const COLOR_MAP: Record<string, string> = {
  'bg-slate-700':         '#334155',
  'bg-blue-500/30':       'rgba(59, 130, 246, 0.3)',
  'bg-emerald-500/30':    'rgba(16, 185, 129, 0.3)',
  'bg-amber-500/30':      'rgba(245, 158, 11, 0.3)',
  'bg-rose-500/30':       'rgba(239, 68, 68, 0.3)',
  'bg-violet-500/30':     'rgba(139, 92, 246, 0.3)',
  'bg-slate-600/50':      'rgba(71, 85, 105, 0.5)',
  'bg-cyan-500/30':       'rgba(6, 182, 212, 0.3)',
  'bg-indigo-500/30':     'rgba(99, 102, 241, 0.3)',
};

const BORDER_COLOR_MAP: Record<string, string> = {
  'border-slate-600':     '#475569',
  'border-blue-400':      '#60a5fa',
  'border-emerald-400':   '#34d399',
  'border-amber-400':     '#fbbf24',
  'border-rose-400':      '#fb7185',
  'border-violet-400':    '#a78bfa',
  'border-slate-500':     '#64748b',
  'border-cyan-400':      '#22d3ee',
  'border-indigo-400':    '#818cf8',
};

const TEXT_COLOR_MAP: Record<string, string> = {
  'text-slate-200':       '#e2e8f0',
  'text-blue-200':        '#bfdbfe',
  'text-emerald-200':     '#a7f3d0',
  'text-amber-200':       '#fde68a',
  'text-rose-200':        '#fecdd3',
  'text-violet-200':      '#ddd6fe',
  'text-slate-300':       '#cbd5e1',
  'text-cyan-200':        '#a5f3fc',
  'text-indigo-200':      '#c7d2fe',
};

const NODE_RADIUS = 22;
const VERTICAL_GAP = 70;
const SVG_PADDING = 40;

export default function TreeView({ visualization }: TreeViewProps) {
  const { nodes, highlights, depthValues } = visualization;

  const { positions, edges, viewBox } = useMemo(() => {
    const positions: NodePosition[] = [];
    const edges: Edge[] = [];

    if (nodes.length === 0) return { positions: [], edges: [], viewBox: '0 0 400 200' };

    // Calculate max depth
    let maxLevel = 0;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] !== null) {
        const level = Math.floor(Math.log2(i + 1));
        maxLevel = Math.max(maxLevel, level);
      }
    }

    // Calculate width based on tree depth
    const baseWidth = Math.pow(2, maxLevel) * (NODE_RADIUS * 3);
    const totalWidth = Math.max(baseWidth, 200);
    const totalHeight = (maxLevel + 1) * VERTICAL_GAP + SVG_PADDING * 2;

    // Position each node
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === null) continue;

      const level = Math.floor(Math.log2(i + 1));
      const positionInLevel = i - (Math.pow(2, level) - 1);
      const nodesAtLevel = Math.pow(2, level);
      const levelWidth = totalWidth;
      const spacing = levelWidth / (nodesAtLevel + 1);
      const x = spacing * (positionInLevel + 1);
      const y = SVG_PADDING + level * VERTICAL_GAP;

      positions.push({
        index: i,
        value: nodes[i] as number,
        x,
        y,
        level,
      });
    }

    // Build edges
    const posMap = new Map(positions.map((p) => [p.index, p]));

    for (const pos of positions) {
      const leftChild = 2 * pos.index + 1;
      const rightChild = 2 * pos.index + 2;

      const leftPos = posMap.get(leftChild);
      if (leftPos) {
        edges.push({
          parentX: pos.x,
          parentY: pos.y,
          childX: leftPos.x,
          childY: leftPos.y,
        });
      }

      const rightPos = posMap.get(rightChild);
      if (rightPos) {
        edges.push({
          parentX: pos.x,
          parentY: pos.y,
          childX: rightPos.x,
          childY: rightPos.y,
        });
      }
    }

    const viewBox = `0 0 ${totalWidth} ${totalHeight}`;
    return { positions, edges, viewBox };
  }, [nodes]);

  return (
    <div className="flex items-center justify-center w-full py-4">
      <svg
        viewBox={viewBox}
        className="w-full max-h-[400px]"
        style={{ minHeight: 200 }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Edges */}
        {edges.map((edge, i) => (
          <line
            key={`edge-${i}`}
            x1={edge.parentX}
            y1={edge.parentY + NODE_RADIUS}
            x2={edge.childX}
            y2={edge.childY - NODE_RADIUS}
            stroke="#34344a"
            strokeWidth="2"
            opacity="0.6"
          />
        ))}

        {/* Nodes */}
        {positions.map((pos) => {
          const color = getColor(highlights[pos.index]);
          const fill = COLOR_MAP[color.bg] || '#334155';
          const stroke = BORDER_COLOR_MAP[color.border] || '#475569';
          const textFill = TEXT_COLOR_MAP[color.text] || '#e2e8f0';

          return (
            <motion.g key={pos.index}>
              {/* Node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={NODE_RADIUS}
                fill={fill}
                stroke={stroke}
                strokeWidth="2"
                animate={{
                  fill,
                  stroke,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Node value */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textFill}
                fontSize="14"
                fontWeight="bold"
                fontFamily="var(--font-geist-mono), monospace"
              >
                {pos.value}
              </text>

              {/* Depth value label */}
              {depthValues && depthValues[pos.index] !== undefined && (
                <text
                  x={pos.x + NODE_RADIUS + 8}
                  y={pos.y - 4}
                  textAnchor="start"
                  fill="#70707d"
                  fontSize="10"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  {depthValues[pos.index]}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

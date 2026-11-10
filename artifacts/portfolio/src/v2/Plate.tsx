import type { ReactNode } from "react";
import type { PlateKind } from "./content";

// Generated artwork. Each plate is drawn in code from the work it stands for,
// so nothing here is a stock photo or a mocked-up screenshot. Shapes are
// deterministic: the same seed draws the same plate on server and client.

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const ink = "var(--v2-plate-ink)";
const hot = "var(--v2-accent)";
const spark = "var(--v2-spark)";

export const plateCaptions: Record<PlateKind, string> = {
  search: "Of every 100 searches, 7 hit a dead end. Now 2 do.",
  agents: "An agent, its tools, and the one path that ran.",
  taste: "36 taste categories for 20M+ listeners.",
  pricing: "Scrape success across 550+ bots: 94% to 98%.",
  threads: "Comments, layered over any page.",
  screens: "Four sources, one story, a scrubber.",
  festival: "A crowd, drawn from the stage.",
  source: "One model. Left for people, right for machines.",
  breath: "In. Hold. Out.",
  island: "Roosevelt Island, East River.",
  lines: "Essays.",
};

function search() {
  // 10 × 10 searches. Seven were dead ends; five of those are now answered.
  const dead = [13, 27, 38, 54, 61, 76, 89];
  const still = new Set([38, 76]);
  const dots: ReactNode[] = [];
  for (let i = 0; i < 100; i++) {
    const x = 65 + (i % 10) * 30;
    const y = 115 + Math.floor(i / 10) * 30;
    if (!dead.includes(i)) {
      dots.push(<circle key={i} cx={x} cy={y} r={4} fill={ink} />);
    } else if (still.has(i)) {
      dots.push(<circle key={i} cx={x} cy={y} r={8} fill="none" stroke={ink} strokeWidth={1.2} />);
    } else {
      dots.push(
        <g key={i}>
          <circle cx={x} cy={y} r={8} fill={hot} />
          <circle cx={x} cy={y} r={13} fill="none" stroke={hot} strokeWidth={0.8} opacity={0.5} />
        </g>,
      );
    }
  }
  return dots;
}

function agents() {
  const nodes = [
    [200, 90], [105, 190], [295, 190], [70, 310], [170, 310], [250, 310], [330, 310], [210, 420],
  ];
  const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [4, 7], [5, 7]];
  const ran = new Set(["0-2", "2-5", "5-7"]);
  return (
    <>
      {edges.map(([a, b]) => {
        const on = ran.has(`${a}-${b}`);
        return (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
            stroke={on ? hot : ink} strokeWidth={on ? 2 : 1} opacity={on ? 1 : 0.45}
          />
        );
      })}
      {nodes.map(([x, y], i) => {
        const on = [0, 2, 5, 7].includes(i);
        return i >= 3 && i <= 6 ? (
          <rect key={i} x={x - 13} y={y - 13} width={26} height={26} fill={on ? hot : "var(--v2-plate)"} stroke={on ? hot : ink} strokeWidth={1.2} />
        ) : (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 20 : 15} fill={on ? hot : "var(--v2-plate)"} stroke={on ? hot : ink} strokeWidth={1.2} />
        );
      })}
    </>
  );
}

function taste() {
  const rand = rng(36);
  const picked = new Set([4, 15, 20, 31]);
  return Array.from({ length: 36 }, (_, i) => {
    const x = 75 + (i % 6) * 50;
    const y = 125 + Math.floor(i / 6) * 50;
    const radius = r1(5 + rand() * 17);
    return picked.has(i) ? (
      <circle key={i} cx={x} cy={y} r={radius} fill={hot} />
    ) : (
      <circle key={i} cx={x} cy={y} r={radius} fill="none" stroke={ink} strokeWidth={1.1} />
    );
  });
}

function pricing() {
  const rand = rng(550);
  const ticks = Array.from({ length: 55 }, (_, i) => {
    const x = 40 + i * 6;
    const fail = rand() < 0.04;
    return <line key={i} x1={x} y1={410} x2={x} y2={fail ? 418 : 440} stroke={fail ? spark : ink} strokeWidth={1.4} />;
  });
  let y = 330;
  let path = `M 40 ${y}`;
  for (let i = 1; i <= 8; i++) {
    const x = 40 + i * 40;
    y -= r1(8 + rand() * 34);
    path += ` H ${x} V ${y}`;
  }
  return (
    <>
      <path d={path} fill="none" stroke={hot} strokeWidth={2} />
      <path d="M 40 360 H 120 V 345 H 200 V 352 H 280 V 338 H 360" fill="none" stroke={ink} strokeWidth={1} opacity={0.5} strokeDasharray="3 5" />
      {ticks}
    </>
  );
}

function threads() {
  const rows = [
    [50, 90, 230, 62, false], [90, 170, 250, 78, true], [130, 266, 210, 56, false],
    [90, 340, 190, 50, false], [50, 408, 260, 46, false],
  ] as const;
  return rows.map(([x, y, w, h, on], i) => (
    <g key={i}>
      <rect x={x} y={y} width={w} height={h} rx={h / 2.6} fill={on ? hot : "var(--v2-plate)"} stroke={on ? hot : ink} strokeWidth={1.2} />
      <line x1={x + 22} y1={y + h / 2 - 6} x2={x + w - 40} y2={y + h / 2 - 6} stroke={on ? "var(--v2-plate)" : ink} strokeWidth={1.2} opacity={0.7} />
      <line x1={x + 22} y1={y + h / 2 + 6} x2={x + w * 0.55} y2={y + h / 2 + 6} stroke={on ? "var(--v2-plate)" : ink} strokeWidth={1.2} opacity={0.7} />
    </g>
  ));
}

function screens() {
  const cells = [[50, 100], [208, 100], [50, 228], [208, 228]];
  return (
    <>
      {cells.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={142} height={112} fill={i === 1 ? hot : "none"} stroke={i === 1 ? hot : ink} strokeWidth={1.2} />
      ))}
      <line x1={50} y1={395} x2={350} y2={395} stroke={ink} strokeWidth={1.2} />
      {Array.from({ length: 16 }, (_, i) => (
        <line key={i} x1={50 + i * 20} y1={389} x2={50 + i * 20} y2={401} stroke={ink} strokeWidth={1} opacity={0.6} />
      ))}
      <circle cx={170} cy={395} r={9} fill={spark} />
    </>
  );
}

function festival() {
  const rand = rng(300);
  const rays = Array.from({ length: 19 }, (_, i) => {
    const angle = Math.PI * (0.08 + (i / 18) * 0.84);
    return (
      <line
        key={i}
        x1={200} y1={150}
        x2={r1(200 - Math.cos(angle) * 230)} y2={r1(150 + Math.sin(angle) * 150)}
        stroke={i % 6 === 3 ? hot : ink} strokeWidth={i % 6 === 3 ? 1.8 : 0.9} opacity={i % 6 === 3 ? 1 : 0.5}
      />
    );
  });
  const crowd = Array.from({ length: 120 }, (_, i) => (
    <circle key={i} cx={r1(30 + rand() * 340)} cy={r1(330 + rand() * 130)} r={r1(2 + rand() * 2.6)} fill={ink} opacity={r1(0.35 + rand() * 0.65)} />
  ));
  return (
    <>
      {rays}
      <circle cx={200} cy={150} r={12} fill={spark} />
      {crowd}
    </>
  );
}

function source() {
  const left = [150, 120, 138, 90, 146, 110, 128, 70];
  return (
    <>
      <line x1={200} y1={80} x2={200} y2={430} stroke={ink} strokeWidth={1} />
      {left.map((w, i) => (
        <line key={i} x1={40} y1={110 + i * 40} x2={40 + w * 0.92} y2={110 + i * 40} stroke={ink} strokeWidth={i === 0 ? 7 : 1.6} />
      ))}
      {left.map((w, i) => (
        <g key={i}>
          <rect x={222 + (i % 3) * 12} y={105 + i * 40} width={34} height={10} fill={hot} />
          <line x1={266 + (i % 3) * 12} y1={110 + i * 40} x2={r1(266 + (i % 3) * 12 + w * 0.5)} y2={110 + i * 40} stroke={ink} strokeWidth={1.6} opacity={0.7} />
        </g>
      ))}
    </>
  );
}

function breath() {
  return Array.from({ length: 9 }, (_, i) => (
    <circle key={i} cx={200} cy={255} r={18 + i * 19} fill={i === 0 ? spark : "none"} stroke={i === 4 ? hot : ink} strokeWidth={i === 4 ? 2 : 0.9} opacity={i === 0 || i === 4 ? 1 : r1(0.8 - i * 0.07)} />
  ));
}

function island() {
  const water = Array.from({ length: 14 }, (_, i) => (
    <line key={i} x1={30} y1={95 + i * 26} x2={370} y2={95 + i * 26} stroke={ink} strokeWidth={0.8} opacity={0.35} />
  ));
  return (
    <>
      {water}
      <path d="M 268 92 C 282 100 276 150 250 210 C 222 276 180 352 148 410 C 140 424 126 426 124 412 C 124 380 160 300 196 226 C 222 172 244 110 268 92 Z" fill="var(--v2-plate)" stroke={ink} strokeWidth={1.3} />
      <circle cx={150} cy={392} r={7} fill={hot} />
      <circle cx={150} cy={392} r={15} fill="none" stroke={hot} strokeWidth={0.9} opacity={0.6} />
    </>
  );
}

function lines(seed: number) {
  const rand = rng(seed + 7);
  return Array.from({ length: 11 }, (_, i) => (
    <line key={i} x1={50} y1={110 + i * 30} x2={r1(50 + (i === 0 ? 220 : 150 + rand() * 150))} y2={110 + i * 30} stroke={i === 0 ? hot : ink} strokeWidth={i === 0 ? 8 : 1.4} opacity={i === 0 ? 1 : 0.75} />
  ));
}

export function Plate({
  kind,
  label,
  seed = 1,
  className = "",
}: {
  kind: PlateKind;
  label?: string;
  seed?: number;
  className?: string;
}) {
  const art: Record<PlateKind, () => ReactNode> = {
    search, agents, taste, pricing, threads, screens, festival, source, breath, island,
    lines: () => lines(seed),
  };
  return (
    <svg
      className={`v2-plate ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ?? plateCaptions[kind]}
    >
      <rect width="400" height="500" fill="var(--v2-plate)" />
      {art[kind]()}
    </svg>
  );
}

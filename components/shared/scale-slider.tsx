"use client";

interface ScaleSliderProps {
  value: number | null;
  onChange: (v: number | null) => void;
  label: string;
  min?: number;
  max?: number;
}

export function ScaleSlider({
  value,
  onChange,
  label,
  min = 0,
  max = 10,
}: ScaleSliderProps) {
  const displayValue = value ?? Math.floor((min + max) / 2);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-medium tabular-nums">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={displayValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="scale-slider w-full h-4 cursor-pointer"
      />
    </div>
  );
}

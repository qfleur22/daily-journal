"use client";

interface TransitionsChecklistProps {
  transitions: {
    arrivedEarly: boolean;
    seatPicked: boolean;
    fidgetLoopsReady: boolean;
    resetAtCoffeeBreak: boolean;
  };
  onTransitionsChange: (transitions: TransitionsChecklistProps["transitions"]) => void;
}

export function TransitionsChecklist({
  transitions,
  onTransitionsChange,
}: TransitionsChecklistProps) {
  const items = [
    { key: "arrivedEarly" as const, label: "Arrived early" },
    { key: "seatPicked" as const, label: "Seat picked" },
    { key: "fidgetLoopsReady" as const, label: "Fidget/loops ready" },
    { key: "resetAtCoffeeBreak" as const, label: "1 reset at coffee break" },
  ];

  const handleToggle = (key: keyof typeof transitions) => {
    onTransitionsChange({
      ...transitions,
      [key]: !transitions[key],
    });
  };

  return (
    <div>
      <p className="font-medium text-slate-700 mb-2">
        Transitions
      </p>
      <div className="flex flex-wrap gap-4">
        {items.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <input
              type="checkbox"
              checked={transitions[key]}
              onChange={() => handleToggle(key)}
              className="rounded border-thistle text-thistle"
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  );
}

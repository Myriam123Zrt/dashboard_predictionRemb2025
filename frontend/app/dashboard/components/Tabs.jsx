"use client";
import classNames from "classnames";

export default function Tabs({ current, setCurrent }) {
  const tabs = ["Synthèse", "Analyse", "Modèle"];

  return (
    <div className="flex gap-2 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setCurrent(tab)}
          className={classNames(
            "px-4 py-2 rounded-t-lg font-medium",
            current === tab
              ? "bg-white shadow border border-b-0"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

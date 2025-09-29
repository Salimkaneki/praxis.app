'use client'
import React from "react";
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export type KPI = {
  label: string;
  value: string | number;
  trend: "positive" | "negative" | "neutral";
  period: string;
};

type KPIGridProps = {
  kpis: KPI[];
};

export default function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-poppins font-medium text-gray-600">
              {kpi.label}
            </h3>
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </div>

          <div className="mb-2">
            <div className="text-3xl font-poppins font-light text-gray-900 mb-1">
              {kpi.value}
            </div>
            <div className="flex items-center text-sm">
              <span className={`inline-flex items-center font-poppins font-medium ${
                kpi.trend === 'positive' ? 'text-green-700' :
                kpi.trend === 'negative' ? 'text-red-700' : 'text-gray-500'
              }`}>
                {kpi.trend === 'positive' ? (
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                ) : kpi.trend === 'negative' ? (
                  <ArrowDownRight className="w-3 h-3 mr-1" />
                ) : (
                  <Minus className="w-3 h-3 mr-1" />
                )}
              </span>
              <span className="text-gray-500 font-poppins ml-2">{kpi.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
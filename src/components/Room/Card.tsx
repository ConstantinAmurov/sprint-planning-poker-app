"use client";
import { Card as ShadCard, CardContent } from "@/components/ui/card";

interface CardProps {
  value: string;
  onClick: () => void;
  className?: string;
}

export default function Card({ value, onClick, className }: CardProps) {
  return (
    <div className="cursor-pointer" onClick={onClick}>
      <ShadCard
        className={`w-24 h-24 flex items-center justify-center rounded-2xl shadow-lg ${className}`}
      >
        <CardContent className="text-xl font-semibold">{value}</CardContent>
      </ShadCard>
    </div>
  );
}

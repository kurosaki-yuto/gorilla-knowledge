"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Training } from "@/types";

interface TrainingCardProps {
  training: Training;
  progressPercent?: number;
  completedCategories?: number;
  totalCategories?: number;
}

export function TrainingCard({
  training,
  progressPercent = 0,
  completedCategories = 0,
  totalCategories = 0,
}: TrainingCardProps) {
  return (
    <Link href={`/${training.id}`}>
      <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-blue-50 p-2.5 group-hover:bg-blue-100 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{training.name}</h3>
              </div>
              {training.description && (
                <p className="text-sm text-gray-500 ml-[52px] mb-4">
                  {training.description}
                </p>
              )}
              <div className="ml-[52px]">
                <div className="flex justify-between text-sm text-gray-500 mb-1.5">
                  <span>進捗</span>
                  <span>
                    {progressPercent}%（{completedCategories}/{totalCategories}）
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400 mt-3 group-hover:text-blue-600 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

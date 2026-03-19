"use client";

import Link from "next/link";
import { Folder, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { CategoryWithProgress } from "@/types";

interface CategoryCardProps {
  category: CategoryWithProgress;
  trainingId: string;
}

export function CategoryCard({ category, trainingId }: CategoryCardProps) {
  return (
    <Link href={`/${trainingId}/${category.id}`}>
      <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2 group-hover:bg-amber-100 transition-colors">
                <Folder className="h-4 w-4 text-amber-600" />
              </div>
              <h4 className="font-medium">{category.name}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  category.progressPercent >= 100 ? "default" : "secondary"
                }
                className={
                  category.progressPercent >= 100
                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                    : ""
                }
              >
                {category.progressPercent}%
              </Badge>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </div>
          {category.description && (
            <p className="text-sm text-gray-500 mb-3 line-clamp-1">
              {category.description}
            </p>
          )}
          <div className="flex items-center gap-3">
            <Progress value={category.progressPercent} className="h-1.5 flex-1" />
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {category.completedCount}/{category.courseCount}講座
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

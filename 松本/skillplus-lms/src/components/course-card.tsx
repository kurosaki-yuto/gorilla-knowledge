"use client";

import Link from "next/link";
import { Play, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CourseWithProgress } from "@/types";

interface CourseCardProps {
  course: CourseWithProgress;
  trainingId: string;
  categoryId: string;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function CourseCard({
  course,
  trainingId,
  categoryId,
}: CourseCardProps) {
  return (
    <Link href={`/${trainingId}/${categoryId}/${course.id}`}>
      <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer overflow-hidden">
        {/* サムネイル */}
        <div className="relative aspect-video bg-gray-100">
          {course.thumbnailUrl ? (
            <img
              src={course.thumbnailUrl}
              alt={course.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <Play className="h-12 w-12 text-blue-300" />
            </div>
          )}
          {/* 再生時間 */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(course.durationSeconds)}
          </div>
          {/* ホバーオーバーレイ */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <Play className="h-6 w-6 text-blue-600" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm line-clamp-2 flex-1">
              {course.name}
            </h4>
            {course.isComplete ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shrink-0">
                <CheckCircle className="h-3 w-3 mr-1" />
                視聴済み
              </Badge>
            ) : (
              <Badge variant="secondary" className="shrink-0">
                <Clock className="h-3 w-3 mr-1" />
                未視聴
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

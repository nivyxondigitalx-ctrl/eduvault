import React, { Suspense } from "react";
import CollegeDetailClient from "./CollegeDetailClient";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-xs font-semibold text-slate-500">Loading college details...</div>}>
      <CollegeDetailClient slug={resolvedParams.slug} />
    </Suspense>
  );
}

import React from "react";
import CollegeDetailClient from "./CollegeDetailClient";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <CollegeDetailClient slug={resolvedParams.slug} />;
}

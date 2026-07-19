import React from "react";
import MaterialDetailClient from "./MaterialDetailClient";

// Since next.js App router page can receive params, we will extract slug and pass it to a Client component
export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <MaterialDetailClient slug={resolvedParams.slug} />;
}

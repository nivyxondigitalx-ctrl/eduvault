import React from "react";
import LegalClient from "./LegalClient";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const resolvedParams = await params;
  return <LegalClient type={resolvedParams.type} />;
}

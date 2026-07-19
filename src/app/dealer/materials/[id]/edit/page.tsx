import React from "react";
import EditMaterialClient from "./EditMaterialClient";

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditMaterialClient id={resolvedParams.id} />;
}

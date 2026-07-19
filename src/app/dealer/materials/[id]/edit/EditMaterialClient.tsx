"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../../../../../lib/context";
import { ArrowLeft, ArrowRight, Save, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function EditMaterialClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    materials,
    universities,
    colleges,
    departments,
    regulations,
    semesters,
    subjects,
    updateMaterial,
  } = useDemo();

  const mat = materials.find((m) => m.id === id);

  // States
  const [currentStep, setCurrentStep] = useState(0);
  const [univId, setUnivId] = useState("");
  const [collId, setCollId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [regId, setRegId] = useState("");
  const [semId, setSemId] = useState("");
  const [subjId, setSubjId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<any>("study_material");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (mat) {
      setUnivId(mat.universityId);
      setCollId(mat.collegeId);
      setDeptId(mat.departmentId);
      setRegId(mat.regulationId);
      setSemId(mat.semesterId);
      setSubjId(mat.subjectId);
      setTitle(mat.title);
      setDescription(mat.description);
      setCategory(mat.category);
      setPrice(mat.price);
      setDiscount(mat.discount);
    }
  }, [mat]);

  if (!mat) {
    return (
      <div className="p-8 text-center text-xs">
        <p className="text-slate-400">Material not found.</p>
        <button onClick={() => router.push("/dealer/materials")} className="mt-4 px-3 py-1.5 bg-indigo-600 text-white rounded-lg">
          Back
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMaterial(mat.id, {
      title,
      description,
      universityId: univId,
      collegeId: collId,
      departmentId: deptId,
      regulationId: regId,
      semesterId: semId,
      subjectId: subjId,
      category,
      price,
      discount,
      status: "pending", // re-moderate
    });
    toast.success("Material updated successfully. Awaiting re-moderation.");
    router.push("/dealer/materials");
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Edit Material details
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Modifying document properties will resubmit the file to moderators.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl min-h-[100px]"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Gross Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseInt(e.target.value))}
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-zinc-800 flex justify-between gap-2">
            <button
              type="button"
              onClick={() => router.push("/dealer/materials")}
              className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              Save Changes & Re-submit <Save className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

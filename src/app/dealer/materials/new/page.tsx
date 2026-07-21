"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "../../../../lib/context";
import {
  FileText,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  FolderLock,
  BadgeAlert,
} from "lucide-react";
import { formatCurrency } from "../../../../lib/storage";
import { toast } from "sonner";

const STEPS = [
  "Classification",
  "Metadata Details",
  "PDF Upload",
  "Pricing & Access",
  "Declaration",
];

export default function NewMaterialPage() {
  const router = useRouter();
  const {
    universities,
    colleges,
    departments,
    regulations,
    semesters,
    subjects,
    submitMaterial,
  } = useDemo();

  const [currentStep, setCurrentStep] = useState(0);

  // Form Fields State
  const [univId, setUnivId] = useState("");
  const [collId, setCollId] = useState("");
  const [deptId, setDeptId] = useState("");
  const [regId, setRegId] = useState("");
  const [semId, setSemId] = useState("");
  const [subjId, setSubjId] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<any>("study_material");
  const [examType, setExamType] = useState<any>("university");
  const [examMonth, setExamMonth] = useState("Nov");
  const [examYear, setExamYear] = useState("2026");
  const [language, setLanguage] = useState("English");
  const [tags, setTags] = useState("");
  const [includesAnswerKey, setIncludesAnswerKey] = useState(false);

  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [pageCount, setPageCount] = useState(10);
  const [previewPageCount, setPreviewPageCount] = useState(2);

  const [accessModes, setAccessModes] = useState<any[]>(["purchase"]);
  const [price, setPrice] = useState(49);
  const [discount, setDiscount] = useState(10);
  const [subEligible, setSubEligible] = useState(true);

  const [declarationAgree, setDeclarationAgree] = useState(false);

  // Helpers
  const filteredColleges = colleges.filter(c => c.universityId === univId);
  const filteredSubjects = subjects.filter(
    s => s.departmentId === deptId && s.semesterId === semId
  );

  const nextStep = () => {
    // Basic validation per step
    if (currentStep === 0) {
      if (!univId || !collId || !deptId || !regId || !semId || !subjId) {
        toast.error("Please classify all academic taxonomy fields.");
        return;
      }
    } else if (currentStep === 1) {
      if (!title || !description) {
        toast.error("Title and Description are required.");
        return;
      }
    } else if (currentStep === 2) {
      if (!fileUploaded) {
        toast.error("Please select a PDF document to upload.");
        return;
      }
    } else if (currentStep === 3) {
      if (accessModes.length === 0) {
        toast.error("Please choose at least one access mode.");
        return;
      }
      if (accessModes.includes("purchase") && price <= 0) {
        toast.error("Price must be greater than zero for Premium purchases.");
        return;
      }
    }

    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleSimulateUpload = () => {
    setFileUploading(true);
    setUploadProgress(0);
    setFileName("Solved_Question_Paper_2026.pdf");
    setFileSize("3.4 MB");

    const timer = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setFileUploading(false);
          setFileUploaded(true);
          toast.success("PDF upload completed!");
          return 100;
        }
        return p + 20;
      });
    }, 200);
  };

  const handleAccessModeToggle = (mode: string) => {
    if (accessModes.includes(mode)) {
      setAccessModes(accessModes.filter(m => m !== mode));
    } else {
      setAccessModes([...accessModes, mode]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declarationAgree) {
      toast.error("You must accept the terms of copyright declaration.");
      return;
    }

    const targetSubj = subjects.find(s => s.id === subjId);

    // Call context helper
    submitMaterial({
      title,
      description,
      universityId: univId,
      collegeId: collId,
      courseId: "course-1",
      departmentId: deptId,
      regulationId: regId,
      semesterId: semId,
      subjectId: subjId,
      subjectCode: targetSubj ? targetSubj.code : "CSXXXX",
      category,
      examType,
      examMonth,
      examYear,
      language,
      pageCount,
      fileSize,
      thumbnailStyle: "from-indigo-600 to-indigo-800",
      previewPageCount,
      price: accessModes.includes("purchase") ? price : 0,
      discount: accessModes.includes("purchase") ? discount : 0,
      accessModes: accessModes.length > 0 ? accessModes : ["free"],
      subscriptionEligible: subEligible,
      status: "pending", // submitted for moderation
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      includesAnswerKey,
    });

    toast.success("Solved paper uploaded for moderation review!");
    router.push("/dealer/materials");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Publish Solved Key & Guide
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Follow the multi-step wizard to classify and describe your verified reference notes.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-4 rounded-2xl shadow-sm overflow-x-auto gap-4">
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2 shrink-0">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === idx
                ? "bg-indigo-600 text-white"
                : currentStep > idx
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500"
            }`}>
              {idx + 1}
            </span>
            <span className={`text-[11px] font-bold ${currentStep === idx ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
              {step}
            </span>
            {idx < STEPS.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-300" />}
          </div>
        ))}
      </div>

      {/* STEP BODY CARD */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* STEP 0: CLASSIFICATION */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider border-b pb-2 mb-4">
              1. Academic Taxonomy Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">University</label>
                <select
                  value={univId}
                  onChange={(e) => {
                    setUnivId(e.target.value);
                    setCollId("");
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select University</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">College Affiliation</label>
                <select
                  required
                  value={collId}
                  onChange={(e) => setCollId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select College</option>
                  <option value="coll-1">K S Rangasamy College of Technology</option>
                  <option value="coll-2">K S R College of Engineering</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Syllabus Regulation</label>
                <select
                  value={regId}
                  onChange={(e) => setRegId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select Regulation</option>
                  {regulations.map((r) => (
                    <option key={r.id} value={r.id}>{r.year}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Department</label>
                <select
                  value={deptId}
                  onChange={(e) => {
                    setDeptId(e.target.value);
                    setSubjId("");
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Semester</label>
                <select
                  value={semId}
                  onChange={(e) => {
                    setSemId(e.target.value);
                    setSubjId("");
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={subjId}
                  onChange={(e) => setSubjId(e.target.value)}
                  placeholder="e.g. CS3351 - Data Structures"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: DETAILS METADATA */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider border-b pb-2 mb-4">
              2. Document Metadata details
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Document Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. solved previous year Board question keys (2021-2025)"
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="List coverage, unit details, solved equations traces to help students understand what is included."
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs rounded-xl min-h-[100px]"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Resource Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="study_material">Study Material</option>
                  <option value="notes">Lecture Notes</option>
                  <option value="question_paper">Question Paper</option>
                  <option value="important_questions">Important Questions</option>
                  <option value="model_answer">Model Answer</option>
                  <option value="answer_key">Answer Key</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Exam Category Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl"
                >
                  <option value="university">University Board Exam</option>
                  <option value="model">Model Internal Exam</option>
                  <option value="internal">Periodic Internal Test</option>
                  <option value="practical">Practical Laboratory Exam</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Exam Month</label>
                <input
                  type="text"
                  value={examMonth}
                  onChange={(e) => setExamMonth(e.target.value)}
                  placeholder="Nov"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Exam Year</label>
                <input
                  type="text"
                  value={examYear}
                  onChange={(e) => setExamYear(e.target.value)}
                  placeholder="2026"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Document Language</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                Comma Separated Search Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Data Structures, CS3351, Notes, Anna University"
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includesAnswerKey}
                onChange={(e) => setIncludesAnswerKey(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Check this if document includes verified answer keys / model solutions.</span>
            </label>
          </div>
        )}

        {/* STEP 2: FILE UPLOAD */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider border-b pb-2 mb-4">
              3. PDF Document File Upload
            </h3>

            {/* Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-zinc-900/50 p-8 rounded-3xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px]" onClick={!fileUploaded ? handleSimulateUpload : undefined}>
              
              {fileUploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-500 font-semibold">Uploading document... {uploadProgress}%</p>
                </div>
              ) : fileUploaded ? (
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-50">{fileName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{fileSize}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileUploaded(false);
                    }}
                    className="text-[10px] text-rose-500 font-bold hover:underline"
                  >
                    Remove and re-upload
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Click or Drag to Upload PDF Document</p>
                  <p className="text-[10px] text-slate-400">Accepted: Solved key PDF up to 15 MB volume size.</p>
                </div>
              )}
            </div>

            {/* Page Count specs input */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Total Pages</label>
                <input
                  type="number"
                  required
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Free Preview Pages</label>
                <input
                  type="number"
                  required
                  value={previewPageCount}
                  onChange={(e) => setPreviewPageCount(parseInt(e.target.value))}
                  className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                />
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: PRICING & ACCESS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider border-b pb-2 mb-4">
              4. Pricing and Access Policies
            </h3>

            {/* Access modes checklist */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Allowed Access Methods</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <button
                  type="button"
                  onClick={() => handleAccessModeToggle("free")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between ${accessModes.includes("free") ? "border-indigo-600 bg-indigo-50/15" : "border-slate-100"}`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-50">Free Access</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">Allows direct download with no ad checks.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccessModeToggle("ad_unlock")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between ${accessModes.includes("ad_unlock") ? "border-indigo-600 bg-indigo-50/15" : "border-slate-100"}`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-50">Ad Unlock Access</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">Watch 10s ad countdown for a 24h access pass.</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleAccessModeToggle("purchase")}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between ${accessModes.includes("purchase") ? "border-indigo-600 bg-indigo-50/15" : "border-slate-100"}`}
                >
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-50">Premium Purchase</span>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">One-time premium buyout for lifetime library access.</p>
                </button>

              </div>
            </div>

            {/* Pricing details if premium selected */}
            {accessModes.includes("purchase") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-zinc-800/20 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800/80">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Gross Price (INR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 bg-white dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">Discount (INR)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value))}
                    className="block w-full px-3 py-2 bg-white dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Subscription pool checkbox */}
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={subEligible}
                onChange={(e) => setSubEligible(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Eligible for subscriber ad-free pool. Earn share allocations based on subscriber downloads.</span>
            </label>

          </div>
        )}

        {/* STEP 4: PREVIEW & DECLARATION */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-800 dark:text-zinc-100 uppercase tracking-wider border-b pb-2 mb-4">
              5. Declaration & Acceptances
            </h3>

            {/* Summary preview block */}
            <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Publish Preview Details</span>
              <div className="flex justify-between">
                <span>Title:</span>
                <strong className="text-slate-800 dark:text-zinc-200">{title}</strong>
              </div>
              <div className="flex justify-between">
                <span>Subject:</span>
                <strong className="font-mono text-slate-800 dark:text-zinc-200">{subjId ? subjects.find(s => s.id === subjId)?.code : "CSXXXX"}</strong>
              </div>
              <div className="flex justify-between">
                <span>Access:</span>
                <strong className="capitalize text-slate-800 dark:text-zinc-200">{accessModes.join(", ")}</strong>
              </div>
              {accessModes.includes("purchase") && (
                <div className="flex justify-between">
                  <span>Net Price:</span>
                  <strong className="text-indigo-600">{formatCurrency(price - discount)}</strong>
                </div>
              )}
            </div>

            {/* Declaration terms checkbox */}
            <div className="space-y-3 pt-4 border-t border-slate-50 dark:border-zinc-800/40">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={declarationAgree}
                  onChange={(e) => setDeclarationAgree(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
                />
                <span>
                  I declare that I hold copyright ownership of this solved answer document key, and the contents do not violate academic plagiarism parameters.
                </span>
              </label>
            </div>

          </div>
        )}

        {/* Navigation bottom bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/60 mt-8 flex justify-between">
          {currentStep > 0 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 text-xs font-bold rounded-xl hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < STEPS.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
            >
              Publish for Moderation <CheckCircle className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
}

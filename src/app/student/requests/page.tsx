"use client";

import React, { useState } from "react";
import { useDemo } from "../../../lib/context";
import { PlusCircle, HelpCircle, FileText, CheckCircle2, MessageCircle, Send, Check } from "lucide-react";
import { toast } from "sonner";

export default function StudentRequestsPage() {
  const { semesters, subjects, requestMaterial } = useDemo();
  const [studentName, setStudentName] = useState("");
  const [materialTitle, setMaterialTitle] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubj, setSelectedSubj] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    title: string;
    semesterName: string;
    subjectDetail: string;
    whatsappMessage: string;
  } | null>(null);

  // Filter subjects based on selected semester
  const filteredSubjects = selectedSemester
    ? subjects.filter((s) => s.semesterId === selectedSemester)
    : subjects;

  const handleSubmitWithNumber = (e: React.FormEvent, number: string) => {
    e.preventDefault();
    if (!studentName || !materialTitle || !selectedSemester || !selectedSubj) {
      toast.error("Please fill in all the required details.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      requestMaterial(materialTitle, "sub-custom");
      
      // Find objects for text formatting
      const semObj = semesters.find(s => s.id === selectedSemester);
      
      const semName = semObj ? semObj.name : "N/A";
      const subjDetail = selectedSubj;

      // Format text message
      const textMessage = `Hello! I would like to request a study file:\n\n` + 
        `👤 *Name:* ${studentName}\n` +
        `📝 *Document Title:* ${materialTitle}\n` +
        `📅 *Semester:* ${semName}\n` +
        `📚 *Subject:* ${subjDetail}`;
      
      setSubmittedData({
        name: studentName,
        title: materialTitle,
        semesterName: semName,
        subjectDetail: subjDetail,
        whatsappMessage: textMessage
      });

      // Open selected coordinator in a new tab
      const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, "_blank");

      // Reset form fields
      setStudentName("");
      setMaterialTitle("");
      setSelectedSemester("");
      setSelectedSubj("");
      setSubmitting(false);
      toast.success("Study material request submitted!");
    }, 600);
  };

  if (submittedData) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
              Request Submitted Successfully!
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Your academic taxonomy details have been saved. To ensure your notes/keys are compiled immediately, please send the request to both coordinators:
            </p>
          </div>

          {/* Request details preview */}
          <div className="bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 rounded-2xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
            <div><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Student Name</span> <span className="text-slate-800 dark:text-zinc-200 font-semibold">{submittedData.name}</span></div>
            <div><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Document Title</span> <span className="text-slate-800 dark:text-zinc-200 font-semibold">{submittedData.title}</span></div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Semester</span> <span className="text-slate-800 dark:text-zinc-200 font-semibold">{submittedData.semesterName}</span></div>
              <div><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider block">Subject</span> <span className="text-slate-800 dark:text-zinc-200 font-semibold">{submittedData.subjectDetail}</span></div>
            </div>
          </div>

          {/* Action buttons for both coordinators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <a
              href={`https://wa.me/918667636642?text=${encodeURIComponent(submittedData.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Send to Coordinator 1
            </a>
            <a
              href={`https://wa.me/919080909366?text=${encodeURIComponent(submittedData.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" /> Send to Coordinator 2
            </a>
          </div>

          <button
            onClick={() => setSubmittedData(null)}
            className="text-xs font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors pt-2 block mx-auto underline"
          >
            Submit Another File Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 tracking-tight">
          Request Study Files
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          Can't find notes or question papers for your syllabus? Request them, and our verified content dealers will upload them.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Sanjay Kumar"
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Requested Document Title
            </label>
            <input
              type="text"
              required
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
              placeholder="e.g. Unit 3 Object Oriented Programming Practice Exercises"
              className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                Semester
              </label>
              <select
                required
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedSubj(""); // Reset subject if semester changes
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 text-slate-700 dark:text-zinc-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                Associated Syllabus Subject
              </label>
              <input
                type="text"
                required
                disabled={!selectedSemester}
                value={selectedSubj}
                onChange={(e) => setSelectedSubj(e.target.value)}
                placeholder="e.g. CS3351 - Data Structures"
                className="block w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border-0 focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-zinc-50 text-xs font-semibold rounded-xl disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={(e) => handleSubmitWithNumber(e, "918667636642")}
              disabled={submitting}
              className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit to Coordinator 1"}
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmitWithNumber(e, "919080909366")}
              disabled={submitting}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit to Coordinator 2"}
            </button>
          </div>

        </form>
      </div>

      {/* Info helper block */}
      <div className="bg-slate-50 dark:bg-zinc-800/40 rounded-2xl p-5 border border-slate-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400 flex items-start gap-2.5">
        <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="leading-normal">
          <span className="font-bold text-slate-800 dark:text-zinc-200">How Requests Are Fulfilled</span>
          <p className="mt-0.5">
            Your request is broadcasted to all dealers registered for your college. Once a dealer uploads a matching resource and the Admin moderates it, you will receive a notification.
          </p>
        </div>
      </div>

    </div>
  );
}

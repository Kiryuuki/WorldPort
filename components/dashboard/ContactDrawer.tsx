"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, Mail, Building2, DollarSign, Clock, Briefcase, MessageSquare, ArrowRight, Zap, Activity } from "lucide-react";
import { useUI } from "@/components/UIContext";


// Scoring Logic Constants
const budgetMap: Record<string, number>    = { 'under-500': 0, '500-2k': 1, '2k-5k': 2, '5k-plus': 3 };
const timelineMap: Record<string, number>  = { 'exploring': 0, '3-6-months': 1, '1-3-months': 2, 'asap': 3 };
const typeMap: Record<string, number>      = { 'not-sure': 0, 'one-time': 1, 'retainer': 2 };
const keywords = ['urgent', 'asap', 'automat', 'n8n', 'integration', 'crm', 'scraping', 'api', 'workflow', 'retainer'];

export const ContactDrawer: React.FC = () => {
  const { isContactOpen, setContactOpen } = useUI();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: "" });

  useEffect(() => {
    if (status.type) {
      const timer = setTimeout(() => {
        setStatus({ type: null, message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.type]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    timeline: "",
    project_type: "",
    message: ""
  });

  const [score, setScore] = useState(0);

  useEffect(() => {
    // Scoring Logic
    let s = 0;
    s += budgetMap[formData.budget] ?? 0;
    s += timelineMap[formData.timeline] ?? 0;
    s += typeMap[formData.project_type] ?? 0;

    let kw = 0;
    const msg = formData.message.toLowerCase();
    for (const k of keywords) {
      if (msg.includes(k)) kw++;
    }
    s += Math.min(kw, 3);
    setScore(s);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setStatus({ type: "error", message: "Name and email are required." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch('/api/inquiry', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email,
          company: formData.company,
          budget: formData.budget,
          timeline: formData.timeline,
          project_type: formData.project_type,
          project_details: formData.message, // Mapping message to project_details
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus({ type: "success", message: "Got it — I'll be in touch within 24 hours." });
      setFormData({ name: "", email: "", company: "", budget: "", timeline: "", project_type: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: "Something went wrong. Email me directly: hello@kiryuuki.space" });
    } finally {
      setLoading(false);
    }
  };



  return (
    <AnimatePresence>
      {isContactOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setContactOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1100] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[500px] z-[1200] flex flex-col pointer-events-auto glass-drawer"
            data-lenis-prevent
            style={{
              fontFamily: "var(--font-mono)",
            }}
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <span className="text-accent-label mb-2 block">
                  // LET'S_BUILD_SOMETHING
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white">Work With Me</h2>
              </div>
              <button
                onClick={() => setContactOpen(false)}
                className="p-2 text-white/40 hover:text-white transition-all bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 panel-scroll">
              <div className="space-y-10 pb-20">
                <p className="text-body-lg italic border-l-2 border-accent/20 pl-4" style={{ color: 'var(--text-secondary)' }}>
                  Tell me about your project. I'll get back to you within 24 hours with a scope and rough estimate.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label flex items-center gap-2">
                      <User size={10} /> Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all text-white placeholder:text-white/20"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-label flex items-center gap-2">
                      <Mail size={10} /> Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all text-white placeholder:text-white/20"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label flex items-center gap-2">
                    <Building2 size={10} /> Company
                  </label>
                  <input
                    type="text"
                    placeholder="Where do you work?"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all text-white placeholder:text-white/20"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-label flex items-center gap-2">
                      <DollarSign size={10} /> Budget
                    </label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all appearance-none text-white"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="" disabled className="bg-[#010611]">Select range</option>
                      <option value="under-500" className="bg-[#010611]">Under $500</option>
                      <option value="500-2k" className="bg-[#010611]">$500 – $2,000</option>
                      <option value="2k-5k" className="bg-[#010611]">$2,000 – $5,000</option>
                      <option value="5k-plus" className="bg-[#010611]">$5,000+</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-label flex items-center gap-2">
                      <Clock size={10} /> Timeline
                    </label>
                    <select
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all appearance-none text-white"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    >
                      <option value="" disabled className="bg-[#010611]">Select timeline</option>
                      <option value="asap" className="bg-[#010611]">ASAP</option>
                      <option value="1-3-months" className="bg-[#010611]">1–3 months</option>
                      <option value="3-6-months" className="bg-[#010611]">3–6 months</option>
                      <option value="exploring" className="bg-[#010611]">Just exploring</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-label flex items-center gap-2">
                    <Briefcase size={10} /> Project type
                  </label>
                  <select
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body outline-none focus:border-accent/50 focus:bg-accent/5 transition-all appearance-none text-white"
                    value={formData.project_type}
                    onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
                  >
                    <option value="" disabled className="bg-[#010611]">What are you looking for?</option>
                    <option value="one-time" className="bg-[#010611]">One-time build</option>
                    <option value="retainer" className="bg-[#010611]">Ongoing retainer</option>
                    <option value="not-sure" className="bg-[#010611]">Not sure yet</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-label flex items-center gap-2">
                    <MessageSquare size={10} /> Project Details
                  </label>
                  <textarea
                    required
                    placeholder="What do you want to automate? What tools are you using?"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-body min-h-[120px] outline-none focus:border-accent/50 focus:bg-accent/5 transition-all resize-none text-white placeholder:text-white/20"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <AnimatePresence>
                  {status.type && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-xl text-body font-medium flex items-center gap-3 ${
                        status.type === 'success' ? 'bg-ok/10 border border-ok/20 text-ok' : 'bg-err/10 border border-err/20 text-err'
                      }`}
                    >
                      {status.type === 'success' ? <Zap size={14} /> : <Activity size={14} />}
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading || status.type === 'success'}
                    className="w-full py-4 bg-accent text-[#010611] rounded-xl font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(100,128,255,0.3)]"
                  >
                    {loading && "SENDING..."}
                    {status.type === 'success' && "INQUIRY SENT ✓"}
                    {status.type === 'error' && "FAILED — RETRY"}
                    {(!loading && status.type !== 'success' && status.type !== 'error') && "SEND_INQUIRY"}
                    {!loading && status.type !== 'success' && <ArrowRight size={18} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: "", email: "", company: "", budget: "", timeline: "", project_type: "", message: "" });
                      setStatus({ type: null, message: "" });
                    }}
                    className="w-full py-3 bg-white/5 border border-white/10 text-white/40 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
                  >
                    RESET_FORM
                  </button>
                </div>
              </form>
            </div>
          </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5">
              <p className="text-label text-center leading-relaxed text-secondary">
                No spam. No unsolicited follow-ups.<br />Just a real reply about your project.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

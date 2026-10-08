import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ThumbsUp,
  Star,
  MessageSquare,
  Bug,
  Lightbulb,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import toast from 'react-hot-toast'

export function Feedback() {
  const [rating, setRating] = useState(5)
  const [feedbackType, setFeedbackType] = useState('feature')
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [featureRequests, setFeatureRequests] = useState([
    { id: 'f-1', title: 'Live audio speech recognition for Mock Interviews', votes: 42, upvoted: false },
    { id: 'f-2', title: 'Export Resume directly to Overleaf / LaTeX template', votes: 38, upvoted: true },
    { id: 'f-3', title: 'Automated LeetCode profile sync with Practice Score', votes: 29, upvoted: false },
    { id: 'f-4', title: 'Salary negotiation email generator with counter-offer formulas', votes: 54, upvoted: false },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setComment('')
      toast.success('Thank you! Your feedback has been received.')
    }, 600)
  }

  const toggleVote = (id) => {
    setFeatureRequests(
      featureRequests.map((f) =>
        f.id === id
          ? { ...f, votes: f.upvoted ? f.votes - 1 : f.votes + 1, upvoted: !f.upvoted }
          : f
      )
    )
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto text-slate-800 font-sans">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ThumbsUp className="w-7 h-7 text-emerald-500" />
            Community Feedback &amp; Feature Voting
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Help shape the AI Career Companion. Submit suggestions, rate your experience, or vote on roadmap features.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            Share Your Experience
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">How would you rate the platform?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-600 ml-2">
                  {rating === 5 ? '5.0 — Exceptional' : `${rating}.0 Stars`}
                </span>
              </div>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Feedback Category</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'feature', label: 'Feature Request', icon: Lightbulb },
                  { id: 'bug', label: 'Bug Report', icon: Bug },
                  { id: 'general', label: 'General Praise', icon: ThumbsUp },
                ].map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                        feedbackType === type.id
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Detailed Comments</label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you love or what would make this platform even better for your career journey?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>

        {/* Feature Request Voting Board */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Community Feature Roadmap
            </h2>
            <span className="text-xs text-slate-500">Click to Upvote</span>
          </div>

          <div className="space-y-3">
            {featureRequests.map((f) => (
              <div
                key={f.id}
                onClick={() => toggleVote(f.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                  f.upvoted
                    ? 'bg-indigo-50 border-indigo-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="text-xs text-slate-700 flex-1 leading-relaxed font-medium">
                  {f.title}
                </p>

                <button
                  type="button"
                  className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                    f.upvoted
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ▲ {f.votes}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default Feedback

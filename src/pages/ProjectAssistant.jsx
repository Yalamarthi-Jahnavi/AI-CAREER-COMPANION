import { motion, AnimatePresence } from 'framer-motion'
import { IntakeForm } from '../components/ProjectAssistant/IntakeForm'
import { SpecOutput } from '../components/ProjectAssistant/SpecOutput'
import { TechChat } from '../components/ProjectAssistant/TechChat'
import { useProjectAssistantStore } from '../store/useProjectAssistantStore'

export function ProjectAssistant() {
  const { step } = useProjectAssistantStore()

  return (
    <div className="page-container relative min-h-[calc(100vh-5rem)] pb-24 font-sans text-slate-800">
      <AnimatePresence mode="wait">
        {step === 'intake' ? (
          <motion.div key="intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IntakeForm />
          </motion.div>
        ) : (
          <motion.div key="blueprint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SpecOutput />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Technical AI Support Panel */}
      <TechChat />
    </div>
  )
}

export default ProjectAssistant

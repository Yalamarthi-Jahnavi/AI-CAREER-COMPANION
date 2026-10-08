import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePracticeStore } from '../store/usePracticeStore'
import { TestConfigScreen } from '../components/Practice/TestConfigScreen'
import { ActiveTestScreen } from '../components/Practice/ActiveTestScreen'
import { TestResultScreen } from '../components/Practice/TestResultScreen'

export function TechnologyPractice() {
  const location = useLocation()
  const { screen, setTech } = usePracticeStore()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const techQuery = params.get('tech')
    if (techQuery) {
      setTech(techQuery.toLowerCase())
    }
  }, [location.search, setTech])

  return (
    <div className="p-6 md:p-8 min-h-full">
      <AnimatePresence mode="wait">
        {screen === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TestConfigScreen />
          </motion.div>
        )}

        {screen === 'testing' && (
          <motion.div
            key="testing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveTestScreen />
          </motion.div>
        )}

        {screen === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TestResultScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

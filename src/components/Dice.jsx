import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const PIPS_MAP = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9]
}

export default function Dice({ value = 1, rolling = false }) {
  const [displayPip, setDisplayPip] = useState(value)

  useEffect(() => {
    if (rolling) {
      const timer = setInterval(() => {
        setDisplayPip(Math.floor(Math.random() * 6) + 1)
      }, 60)
      return () => clearInterval(timer)
    } else {
      setDisplayPip(value)
    }
  }, [rolling, value])

  const activePips = PIPS_MAP[displayPip] || [5]

  return (
    <div style={{ perspective: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* 实体正方形骰子 */}
      <motion.div
        style={{
          width: '110px',
          height: '110px',
          backgroundColor: '#1e1b4b',
          border: '3px solid #ec4899',
          borderRadius: '24px',
          boxShadow: '0 0 35px rgba(236, 72, 153, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.15)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        animate={
          rolling
            ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.12, 0.95, 1.08, 1], y: [0, -20, 5, -15, 0] }
            : { rotate: 0, scale: [1.2, 0.95, 1], y: 0 }
        }
        transition={
          rolling
            ? { duration: 0.5, repeat: Infinity, ease: 'linear' }
            : { duration: 0.3 }
        }
      >
        {/* 九宫格点位容器 */}
        <div
          style={{
            width: '80px',
            height: '80px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            placeItems: 'center'
          }}
        >
          {Array.from({ length: 9 }, (_, idx) => {
            const pipIndex = idx + 1
            const isActive = activePips.includes(pipIndex)

            if (!isActive) {
              return <div key={pipIndex} style={{ width: '16px', height: '16px' }} />
            }

            // 点数 1 渲染为粉红实心大圆点/红心
            if (displayPip === 1 && pipIndex === 5) {
              return (
                <div
                  key={pipIndex}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#f43f5e',
                    color: '#fff',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px #f43f5e'
                  }}
                >
                  ♥
                </div>
              )
            }

            return (
              <div
                key={pipIndex}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  backgroundColor: '#f43f5e',
                  boxShadow: '0 0 10px #f43f5e'
                }}
              />
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

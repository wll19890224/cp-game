import { motion } from 'framer-motion'
import { Bath, Sparkles, Heart, Flame } from 'lucide-react'
import { tGet } from '../utils/i18n.js'
import { Bilingual } from './Bilingual.jsx'

export default function BathCheckpointModal({ isOpen, onConfirm, t, tSecondary }) {
  if (!isOpen) return null

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal max-w-md w-full p-6 text-center space-y-5 border-2 border-cyan-400/80 bg-gradient-to-b from-slate-900 via-cyan-950 to-slate-950 shadow-[0_0_50px_rgba(34,211,238,0.3)] rounded-3xl"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <Bath size={36} />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 inline-block">
            <Bilingual
              k="bath_checkpoint_tag"
              fallback="Checkpoint 强制阻断"
              tPrimary={t}
              tSecondary={tSecondary}
              subClassName="text-[8px] opacity-80 block leading-none mt-0.5"
            />
          </span>
          <h2 className="text-2xl font-bold mt-2 text-cyan-100 font-serif">
            <Bilingual
              k="bath_title"
              fallback="🛁 三人共浴时间"
              tPrimary={t}
              tSecondary={tSecondary}
              subClassName="text-[11px] opacity-80 font-normal block leading-tight mt-1"
            />
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200/90 leading-relaxed space-y-3 text-left">
          <div className="flex items-start gap-2">
            <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{tGet(t, 'bath_desc_1', '恭喜踏上中转站！按照 3P 极乐规则，游戏强制暂停。')}</p>
              {tSecondary && tGet(tSecondary, 'bath_desc_1') !== tGet(t, 'bath_desc_1') && (
                <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{tGet(tSecondary, 'bath_desc_1')}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Flame size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{tGet(t, 'bath_desc_2', '请男方与两位女方共同进入浴室共浴，彻底放松身体并互擦身体。')}</p>
              {tSecondary && tGet(tSecondary, 'bath_desc_2') !== tGet(t, 'bath_desc_2') && (
                <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{tGet(tSecondary, 'bath_desc_2')}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Heart size={16} className="text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{tGet(t, 'bath_desc_3', '洗完后不穿任何衣服，全裸返场！即可解锁阶段二：赤裸前戏与深层侍候。')}</p>
              {tSecondary && tGet(tSecondary, 'bath_desc_3') !== tGet(t, 'bath_desc_3') && (
                <p className="text-[10px] opacity-80 mt-0.5 leading-snug">{tGet(tSecondary, 'bath_desc_3')}</p>
              )}
            </div>
          </div>
        </div>

        <button
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-[0_10px_25px_rgba(6,182,212,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
          onClick={onConfirm}
        >
          <Sparkles size={18} className="shrink-0" />
          <Bilingual
            k="bath_btn"
            fallback="洗完全裸返场 (解锁阶段二)"
            tPrimary={t}
            tSecondary={tSecondary}
            subClassName="text-[10px] opacity-85 font-normal block leading-tight mt-0.5"
          />
        </button>
      </motion.div>
    </motion.div>
  )
}

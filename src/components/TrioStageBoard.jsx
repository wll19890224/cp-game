import { motion } from 'framer-motion'
import { Sparkles, RotateCcw, Flame, Bath, Crown } from 'lucide-react'
import { tGet } from '../utils/i18n.js'

const getGridPosition = (index) => {
  const row = Math.floor(index / 6)
  const colInRow = index % 6
  const col = row % 2 === 0 ? colInRow : 5 - colInRow
  return { gridRow: row + 1, gridColumn: col + 1 }
}

const getCellMeta = (i, tPrimary, tSecondary) => {
  let key = 'cell_start'
  let fallback = '起点'
  let icon = '🚀'
  let category = 'start'

  if (i >= 1 && i <= 15) {
    key = 'cell_break_ice'
    fallback = '微醺破冰'
    icon = '🍷'
    category = 'phase1'
  } else if (i === 16) {
    key = 'cell_bath'
    fallback = '三人共浴'
    icon = '🛁'
    category = 'bath'
  } else if (i >= 17 && i <= 31) {
    key = 'cell_naked'
    fallback = '赤裸前戏'
    icon = '🔥'
    category = 'phase2'
  } else if (i === 32) {
    key = 'cell_climax'
    fallback = '极乐巅峰'
    icon = '👑'
    category = 'climax'
  }

  const primaryLabel = tGet(tPrimary, key, fallback)
  const secondaryLabel = tSecondary ? tGet(tSecondary, key, '') : ''
  const showSub = secondaryLabel && secondaryLabel !== primaryLabel

  return { primaryLabel, secondaryLabel: showSub ? secondaryLabel : '', icon, category }
}

const getPhaseBadges = (tPrimary, tSecondary) => {
  const buildInfo = (key, fallback, icon, colorClass) => {
    const primary = tGet(tPrimary, key, fallback)
    const secondary = tSecondary ? tGet(tSecondary, key, '') : ''
    const showSub = secondary && secondary !== primary
    return { primary, secondary: showSub ? secondary : '', icon, colorClass }
  }

  return {
    break_ice: buildInfo('phase_1_banner', '阶段一：微醺破冰 (1~15格)', Flame, 'bg-rose-900/60 text-rose-200 border-rose-500/40'),
    bath_checkpoint: buildInfo('phase_bath_banner', 'Checkpoint：三人共浴 (第16格强阻断)', Bath, 'bg-cyan-900/80 text-cyan-200 border-cyan-400 animate-pulse'),
    naked_foreplay: buildInfo('phase_2_banner', '阶段二：赤裸前戏 (17~31格)', Flame, 'bg-fuchsia-900/60 text-fuchsia-200 border-fuchsia-500/40'),
    climax: buildInfo('phase_climax_banner', '终点：极乐开战许可 (第32格)', Crown, 'bg-amber-900/80 text-amber-200 border-amber-400')
  }
}

export default function TrioStageBoard({
  players,
  activePlayers,
  positions,
  turn,
  dice,
  walking,
  gamePhase,
  roll,
  resetGame,
  t,
  tSecondary,
  stage1Deck = [],
  stage1Total = 0,
  stage2Deck = [],
  stage2Total = 0
}) {
  const current = activePlayers[turn] || activePlayers[0]
  const phaseBadges = getPhaseBadges(t, tSecondary)
  const phaseInfo = phaseBadges[gamePhase] || phaseBadges.break_ice
  const PhaseIcon = phaseInfo.icon

  const playerColor = (player) =>
    player?.color === 'blue' ? '#3b82f6' : player?.color === 'gold' ? '#f59e0b' : '#ec4899'

  const primaryRouteTag = tGet(t, 'trio_route_tag', '3P 专属极乐航线')
  const secondaryRouteTag = tSecondary ? tGet(tSecondary, 'trio_route_tag', '') : ''

  const stage1Done = stage1Total - (stage1Deck?.length || 0)
  const stage2Done = stage2Total - (stage2Deck?.length || 0)

  return (
    <div className="w-full max-w-[520px] mx-auto space-y-3">
      {/* 阶段指示 Banner 与任务进度 */}
      <div
        className={`flex items-center justify-between px-3.5 py-2 rounded-xl border backdrop-blur-md text-xs font-semibold ${phaseInfo.colorClass}`}
      >
        <div className="flex items-center gap-2 text-left">
          <PhaseIcon size={18} className="shrink-0" />
          <div className="flex flex-col">
            <span className="leading-tight">{phaseInfo.primary}</span>
            {phaseInfo.secondary && (
              <span className="text-[0.75em] opacity-80 font-normal leading-tight mt-0.5">
                {phaseInfo.secondary}
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0 flex flex-col items-end">
          <span className="text-[10px] font-bold text-pink-200 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
            {gamePhase === 'break_ice'
              ? `任务进度 ${stage1Done} / ${stage1Total}`
              : gamePhase === 'naked_foreplay'
              ? `任务进度 ${stage2Done} / ${stage2Total}`
              : primaryRouteTag}
          </span>
          {secondaryRouteTag && secondaryRouteTag !== primaryRouteTag && (
            <span className="text-[7.5px] opacity-75 leading-none mt-0.5">
              {secondaryRouteTag}
            </span>
          )}
        </div>
      </div>

      {/* 32格蛇形棋盘网格容器 */}
      <div className="trio-board-container">
        <div
          className="trio-board-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: '6px'
          }}
        >
          {Array.from({ length: 33 }, (_, i) => {
            const gridPos = getGridPosition(i)
            const meta = getCellMeta(i, t, tSecondary)
            const activeOnCell = activePlayers.filter(
              (p) => (positions[p.id] ?? 0) === i
            )

            const isStart = i === 0
            const isBath = i === 16
            const isFinish = i === 32
            const isSpecial = isStart || isBath || isFinish

            return (
              <div
                key={i}
                style={{
                  gridRow: gridPos.gridRow,
                  gridColumn: gridPos.gridColumn
                }}
                className={`trio-cell ${meta.category} relative flex flex-col justify-between p-1 rounded-xl transition-all`}
              >
                {/* 格子右上角阶段小图标 */}
                <div className="flex items-center justify-between w-full px-0.5 text-[10px] opacity-70">
                  <span className="font-mono text-[9px] text-zinc-400">#{i}</span>
                  <span>{meta.icon}</span>
                </div>

                {/* 正中主视觉：特殊关卡保留文字，普通跑道格子只突出放大数字 */}
                <div className="flex-1 flex flex-col items-center justify-center text-center my-0.5 min-h-0">
                  {isSpecial ? (
                    <div className="cell-title flex flex-col items-center justify-center">
                      <span className="block truncate text-[11px] font-bold text-white leading-tight">
                        {meta.primaryLabel}
                      </span>
                      {meta.secondaryLabel && (
                        <span className="sub-title text-[8px] opacity-80 block leading-tight scale-90">
                          {meta.secondaryLabel}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-base sm:text-lg font-extrabold font-mono text-white/90 tracking-wider">
                      {i}
                    </span>
                  )}
                </div>

                {/* 棋子停留渲染 */}
                <div className="cell-pawns flex items-center justify-center gap-0.5 min-h-[14px]">
                  {activeOnCell.map((p, idx) => (
                    <motion.i
                      layout
                      key={p.id}
                      className={`pawn pawn-${p.color} relative !inset-auto shadow-md`}
                      style={{
                        borderColor: playerColor(p),
                        backgroundColor: playerColor(p)
                      }}
                      title={`${p.name} (#${i})`}
                    >
                      <span className="text-[9px] font-bold">
                        {p.gender === 'male' ? '♂' : idx === 0 ? '♀A' : '♀B'}
                      </span>
                    </motion.i>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 中央控制台 (解耦排版，绝对无双语粘连) */}
      <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-neutral-900/80 backdrop-blur-lg">
        {/* 轮到玩家部分 */}
        <div className="text-left flex flex-col">
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
              {tGet(t, 'turn', '现在轮到')}
            </span>
            {tSecondary && tGet(tSecondary, 'turn') !== tGet(t, 'turn') && (
              <span style={{ fontSize: '8px', color: '#71717a', marginTop: '1px' }}>
                {tGet(tSecondary, 'turn')}
              </span>
            )}
          </div>
          <b className="text-sm text-pink-300 flex items-center gap-1.5 mt-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: playerColor(current) }}
            />
            {current?.name}
          </b>
        </div>

        {/* 掷骰子按钮部分 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(90deg, #f43f5e, #a855f7)',
              color: '#fff',
              fontWeight: 'bold',
              border: 0,
              cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(244,63,94,0.3)',
              opacity: walking || gamePhase === 'bath_checkpoint' ? 0.5 : 1
            }}
            onClick={roll}
            disabled={walking || gamePhase === 'bath_checkpoint'}
          >
            <Sparkles size={16} style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', lineHeight: 1.1 }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{tGet(t, 'roll', '掷骰子')}</span>
              {tSecondary && tGet(tSecondary, 'roll') !== tGet(t, 'roll') && (
                <span style={{ fontSize: '9px', fontWeight: 'normal', opacity: 0.85, marginTop: '2px' }}>
                  {tGet(tSecondary, 'roll')}
                </span>
              )}
            </div>
          </button>
          <span className="last-roll text-xs font-mono font-bold text-pink-400 bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
            🎲 {dice}
          </span>
        </div>
      </div>

      {/* 重置按钮 (独立上下解耦排版) */}
      <div className="flex justify-center">
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            background: 'transparent',
            border: 0,
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '6px 12px',
            marginTop: '12px'
          }}
          onClick={resetGame}
        >
          <RotateCcw size={14} style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', itemsCenter: 'center', lineHeight: 1.1 }}>
            <span style={{ fontSize: '12px' }}>{tGet(t, 'reset', '重新开始')}</span>
            {tSecondary && tGet(tSecondary, 'reset') !== tGet(t, 'reset') && (
              <span style={{ fontSize: '9px', opacity: 0.75, marginTop: '2px' }}>
                {tGet(tSecondary, 'reset')}
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}

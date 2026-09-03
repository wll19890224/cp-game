import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ChevronRight, Heart, History, Mars, Minus, Pause, Play, Plus, RotateCcw, Sparkles, Venus, X } from 'lucide-react'
import SettingsModal from './SettingsModal.jsx'
import TrioStageBoard from './components/TrioStageBoard.jsx'
import BathCheckpointModal from './components/BathCheckpointModal.jsx'
import PlaySetupModal from './components/PlaySetupModal.jsx'
import TaskWorkshopModal from './components/TaskWorkshopModal.jsx'
import Dice from './components/Dice.jsx'
import { Bilingual } from './components/Bilingual.jsx'
import { tGet } from './utils/i18n.js'
import { getActivePreset } from './utils/presetManager.js'
import zhCommon from './locales/zh/common.json'
import enCommon from './locales/en/common.json'
import jaCommon from './locales/ja/common.json'
import thCommon from './locales/th/common.json'

const common = { zh: zhCommon, en: enCommon, ja: jaCommon, th: thCommon }
const emptyItems = { EATABLE: [], DRINKABLE: [], ITEM: [] }
const _standardTemplate = () => ({
  version: '1.0',
  comment: '标准配置模板：text 支持纯字符串或 { zh, en, th } 多语言对象。',
  settings: { gameMode: 'trio', nicknames: { male_1: '男方', female_1: '女方A', female_2: '女方B' } },
  items: { item: ['眼罩', '领带', '羽毛'], drinkable: ['红酒', '冰水', '果汁'], eatable: ['巧克力', '冰块', '跳跳糖'] },
  tasks: {
    action: [
      { id: 'tpl-a1', level: 1, duration: 30, text: { zh: '主动方与受众方进行一段轻松的默契互动。', en: 'The active player and receiver complete a light teamwork interaction.', th: 'ฝ่ายรุกและฝ่ายรับทำกิจกรรมร่วมกันอย่างผ่อนคลาย' } }
    ],
    drinkable: [],
    eatable: [],
    item: [],
    trio: []
  }
})

const _downloadJson = (data, name) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = href
  a.download = name
  a.click()
  URL.revokeObjectURL(href)
}

const TASK_CATEGORIES = ['trio', 'action', 'drinkable', 'eatable', 'item']
const readCustomTasks = () =>
  Object.fromEntries(
    TASK_CATEGORIES.map((key) => {
      try {
        return [key, JSON.parse(localStorage.getItem(`cp_tasks_${key}`) || '[]')]
      } catch {
        return [key, []]
      }
    })
  )

const DEFAULT_PLAYERS = [
  { id: 'male_1', gender: 'male', nickname: '男方', color: 'blue', symbol: '♂', Icon: Mars, start: 0, lane: 0, hangar: 'male' },
  { id: 'female_1', gender: 'female', nickname: '女方A', color: 'pink', symbol: '♀', Icon: Venus, start: 26, lane: 1, hangar: 'female-a' },
  { id: 'female_2', gender: 'female', nickname: '女方B', color: 'gold', symbol: '♀', Icon: Venus, start: 39, lane: 2, hangar: 'female-b' }
]

const TRACK_COORDINATES = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14], [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7], [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0], [7, 0], [6, 0]
]

const HOME_LANES = [
  [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7]],
  [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7]],
  [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5]]
]

const readSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('cp_game_settings') || '{}')
  } catch {
    return {}
  }
}

const getTaskTextByLang = (task, targetLang, forceSecondary = false) => {
  const text = task?.text
  if (typeof text === 'string') return forceSecondary ? '' : text
  if (text && typeof text === 'object') {
    if (forceSecondary) return text[targetLang] || ''
    return text[targetLang] || text.zh || text.en || text.th || ''
  }
  return task?.[targetLang] ?? task?.[`desc_${targetLang}`] ?? task?.[`title_${targetLang}`] ?? ''
}

const playerColor = (player) => (player?.color === 'blue' ? '#3b82f6' : player?.color === 'gold' ? '#f59e0b' : '#ec4899')
const playerClass = (player) => `pawn-${player?.color || 'blue'}`
const shuffle = (items) => {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

async function loadActivePool(lang, gender, userItems) {
  const load = async (name) => {
    for (const candidate of [lang, 'en', 'zh']) {
      const res = await fetch(`/locales/${candidate}/${gender}/${name}.json`)
      if (res.ok) return res.json()
    }
    throw new Error(`Unable to load ${name}`)
  }
  const base = await load('action')
  const optional = [['EATABLE', 'eatable'], ['DRINKABLE', 'drinkable'], ['ITEM', 'item']]
  const extras = await Promise.all(optional.filter(([key]) => userItems[key]?.length).map(([, file]) => load(file)))
  return base.concat(...extras)
}

async function loadTrioPool(lang) {
  for (const candidate of [lang, 'en', 'zh']) {
    const res = await fetch(`/locales/${candidate}/trio.json`)
    if (res.ok) return res.json()
  }
  return []
}

const getTaskForPlayer = (cards, gender, level = 'all') => {
  const filtered = cards
    .filter((card) => {
      const actor = card.for_player ?? card.gender ?? card.role ?? card.actor
      return !actor || actor === gender || actor === 'self' || actor === 'trio'
    })
    .filter((card) => {
      if (level === 'all') return true
      if (Array.isArray(level)) return level.includes(card.level)
      return card.level === Number(level)
    })
  const pool = filtered.length ? filtered : cards
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null
}

const resolvePerspectiveText = (text = '', actor, receiver, players = []) => {
  const male = players.find((p) => p.id === 'male_1') || actor
  const female1 = players.find((p) => p.id === 'female_1') || receiver
  const female2 = players.find((p) => p.id === 'female_2') || receiver
  let out = text
    .replaceAll('{MALE}', male?.nickname || '男方')
    .replaceAll('{FEMALE_1}', female1?.nickname || '女方A')
    .replaceAll('{FEMALE_2}', female2?.nickname || '女方B')
    .replaceAll('{PLAYER_SELF}', actor?.nickname || '玩家')
    .replaceAll('{PLAYER_TARGET}', receiver?.nickname || '玩家')

  const masks = []
  out = out.replace(/男奴|女主|主人|奴隶/g, (x) => {
    masks.push(x)
    return `__ID_${masks.length - 1}__`
  })

  const actorTerms = actor?.gender === 'male' ? /(男方|男性|男|Male|male)/g : /(女方|女性|女|Female|female)/g
  const receiverTerms = actor?.gender === 'male' ? /(女方|女性|女|Female|female)/g : /(男方|男性|男|Male|male)/g
  out = out
    .replace(actorTerms, '__ACTOR__')
    .replace(receiverTerms, '__RECEIVER__')
    .replace(/\b(he|him|his)\b/gi, actor?.gender === 'male' ? '__ACTOR__' : '__RECEIVER__')
    .replace(/\b(she|her|hers)\b/gi, actor?.gender === 'female' ? '__ACTOR__' : '__RECEIVER__')
    .replaceAll('__ACTOR__', actor?.nickname || '玩家')
    .replaceAll('__RECEIVER__', receiver?.nickname || '玩家')

  return masks.reduce((v, x, i) => v.replaceAll(`__ID_${i}__`, x), out)
}

const highlightNames = (text, players) => {
  const names = players.map((p) => p.nickname).filter(Boolean).sort((a, b) => b.length - a.length)
  const token = names.length ? new RegExp(`(${names.map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`) : /$^/
  return text.split(token).map((part, i) => {
    const player = players.find((p) => p.nickname === part)
    return player ? (
      <mark key={i} className={`role-name ${playerClass(player)}`}>
        {part}
      </mark>
    ) : (
      part
    )
  })
}

const renderTemplate = (text = '', items = emptyItems, actor, receiver, players, tObj) => {
  const token = /\{(EATABLE|DRINKABLE|ITEM)\}/g
  const parts = []
  const resolved = resolvePerspectiveText(text, actor, receiver, players)
  let last = 0
  let match

  while ((match = token.exec(resolved))) {
    parts.push(...highlightNames(resolved.slice(last, match.index), players))
    const choices = items[match[1]] || []
    if (choices.length) {
      parts.push(
        <span key={match.index} className={`item-tag ${match[1].toLowerCase()}`}>
          {choices[Math.floor(Math.random() * choices.length)]}
        </span>
      )
    } else {
      const fallbackTag =
        match[1] === 'DRINKABLE'
          ? tGet(tObj, 'default_drink', '饮品')
          : match[1] === 'EATABLE'
          ? tGet(tObj, 'default_food', '食材')
          : tGet(tObj, 'default_item', '道具')
      parts.push(
        <span key={match.index} className={`item-tag ${match[1].toLowerCase()}`}>
          {fallbackTag}
        </span>
      )
    }
    last = token.lastIndex
  }
  parts.push(...highlightNames(resolved.slice(last), players))
  return parts
}

const spotFor = (progress, player) =>
  progress < TRACK_COORDINATES.length
    ? TRACK_COORDINATES[(progress + player.start) % TRACK_COORDINATES.length]
    : HOME_LANES[player.lane][progress - TRACK_COORDINATES.length]

export default function App() {
  const initial = readSettings()
  const [lang, setLang] = useState(initial.lang || 'zh')
  const [secondaryLang, setSecondaryLang] = useState(initial.secondaryLang || '')
  const [mode, setMode] = useState('board_3p')
  const [playerMode, setPlayerMode] = useState(initial.playerMode || 3)
  const [players, setPlayers] = useState(() =>
    DEFAULT_PLAYERS.map((p) => {
      const nickname = initial.players?.[p.id]?.nickname || initial.nicknames?.[p.gender] || p.nickname
      return { ...p, nickname, name: nickname }
    })
  )

  const [positions, setPositions] = useState({ male_1: 0, female_1: 0, female_2: 0 })
  const [turn, setTurn] = useState(0)
  const [dice, setDice] = useState(1)
  const [modal, setModal] = useState(null)
  const [diceModal, setDiceModal] = useState(null)
  const [walking, setWalking] = useState(false)

  // 弹窗状态管理：PlaySetupModal (开局准备) 与 TaskWorkshopModal (任务工坊)
  const [showPlaySetup, setShowPlaySetup] = useState(true)
  const [showWorkshop, setShowWorkshop] = useState(false)

  const [items, setItems] = useState(() => ({ ...emptyItems, ...initial.items }))
  const [customTasks, setCustomTasks] = useState(readCustomTasks)
  const [taskPools, setTaskPools] = useState({ male: [], female: [] })
  const [trioPool, setTrioPool] = useState([])
  const [secondaryTrioPool, setSecondaryTrioPool] = useState([])
  const [secondaryPools, setSecondaryPools] = useState({ male: [], female: [] })
  const [history, setHistory] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [flipped, setFlipped] = useState(false)

  const [gamePhase, setGamePhase] = useState('break_ice')
  const [showBathModal, setShowBathModal] = useState(false)

  // 阶段任务洗牌穷尽制队列状态
  const [stage1Deck, setStage1Deck] = useState([])
  const [stage2Deck, setStage2Deck] = useState([])
  const [stage1Total, setStage1Total] = useState(0)
  const [stage2Total, setStage2Total] = useState(0)
  const [completedTasks, setCompletedTasks] = useState([])

  const activePlayers = useMemo(
    () => (mode === 'board_3p' ? players.slice(0, 3) : players.slice(0, playerMode)),
    [players, playerMode, mode]
  )
  const current = activePlayers[turn] || activePlayers[0]
  const t = common[lang] || common.zh
  const tSecondary = secondaryLang && secondaryLang !== lang ? common[secondaryLang] || null : null

  // 初始化 / 洗牌阶段队列函数
  const init3PDecks = () => {
    const activePreset = getActivePreset()
    const presetTasks = activePreset?.tasks?.trio || []
    const poolToUse = presetTasks.length > 0 ? presetTasks : trioPool

    if (!poolToUse.length) return

    const s1 = poolToUse.filter((task) => task.level === 1)
    const s2 = poolToUse.filter((task) => task.level === 2 || task.level === 3)

    const finalS1 = s1.length ? s1 : poolToUse.slice(0, Math.max(1, Math.floor(poolToUse.length / 3)))
    const finalS2 = s2.length ? s2 : poolToUse.slice(Math.max(1, Math.floor(poolToUse.length / 3)))

    const shuffledS1 = shuffle(finalS1)
    const shuffledS2 = shuffle(finalS2)

    setStage1Deck(shuffledS1)
    setStage2Deck(shuffledS2)
    setStage1Total(shuffledS1.length)
    setStage2Total(shuffledS2.length)
    setCompletedTasks([])
  }

  useEffect(() => {
    localStorage.setItem(
      'cp_game_settings',
      JSON.stringify({
        lang,
        secondaryLang,
        playerMode,
        players: Object.fromEntries(players.map((p) => [p.id, { nickname: p.nickname }])),
        items
      })
    )
  }, [lang, secondaryLang, playerMode, players, items])

  useEffect(() => {
    TASK_CATEGORIES.forEach((key) => localStorage.setItem(`cp_tasks_${key}`, JSON.stringify(customTasks[key] || [])))
  }, [customTasks])

  useEffect(() => {
    let alive = true
    const extra = [...customTasks.action, ...customTasks.drinkable, ...customTasks.eatable, ...customTasks.item]
    Promise.all(['male', 'female'].map((g) => loadActivePool(lang, g, items))).then(([male, female]) => {
      if (alive) setTaskPools({ male: shuffle([...male, ...extra]), female: shuffle([...female, ...extra]) })
    })
    return () => {
      alive = false
    }
  }, [lang, items, customTasks])

  useEffect(() => {
    let alive = true
    loadTrioPool(lang).then((pool) => {
      if (alive) setTrioPool([...pool, ...customTasks.trio])
    })
    return () => {
      alive = false
    }
  }, [lang, customTasks.trio])

  useEffect(() => {
    if (mode === 'board_3p') {
      init3PDecks()
    }
  }, [mode, trioPool])

  useEffect(() => {
    let alive = true
    if (!secondaryLang || secondaryLang === lang) {
      setSecondaryTrioPool([])
      setSecondaryPools({ male: [], female: [] })
      return
    }
    loadTrioPool(secondaryLang).then((pool) => {
      if (alive) setSecondaryTrioPool(pool)
    })
    Promise.all(['male', 'female'].map((g) => loadActivePool(secondaryLang, g, items))).then(([male, female]) => {
      if (alive) setSecondaryPools({ male, female })
    })
    return () => {
      alive = false
    }
  }, [secondaryLang, lang, items])

  useEffect(() => setTurn((v) => v % activePlayers.length), [activePlayers.length])

  const nextTurn = () => setTurn((v) => (v + 1) % activePlayers.length)
  const updatePosition = (id, value) => setPositions((old) => ({ ...old, [id]: value }))

  const actorFor = (receiver) =>
    receiver.gender === 'female' ? players.find((p) => p.id === 'male_1') : activePlayers.find((p) => p.gender === 'female')

  // 为抽出的阶段卡片组装副语言文本
  const getCardWithSecondary = (card) => {
    let secondaryText = ''
    if (secondaryLang && secondaryLang !== lang) {
      if (typeof card.text === 'object') {
        secondaryText = card.text[secondaryLang] || ''
      } else {
        const matched = (secondaryTrioPool || []).find((c) => c.id === card.id)
        if (matched) {
          secondaryText = typeof matched.text === 'object' ? matched.text[secondaryLang] : matched.text || ''
        }
      }
    }

    return {
      ...card,
      isTrio: true,
      action: {
        [lang]: getTaskTextByLang(card, lang),
        ...(secondaryLang && secondaryText ? { [secondaryLang]: secondaryText } : {})
      },
      secondaryRawText: secondaryText
    }
  }

  // 1V1 卡牌抽取方法 (备用)
  const makeCard = (receiver) => {
    const activePreset = getActivePreset()
    const presetTasks = activePreset?.tasks || {}

    const is3P = mode === 'board_3p' || playerMode === 3

    const primaryTrioTasks = presetTasks.trio && presetTasks.trio.length > 0 ? presetTasks.trio : trioPool
    const useTrio = is3P && primaryTrioTasks.length > 0 && Math.random() < 0.65

    let levelFilter = filter
    if (mode === 'board_3p') {
      if (gamePhase === 'break_ice') {
        levelFilter = 1
      } else if (gamePhase === 'naked_foreplay') {
        levelFilter = [2, 3]
      }
    }

    const actorGender = actorFor(receiver)?.gender || 'female'

    const primarySoloTasks = presetTasks[actorGender] && presetTasks[actorGender].length > 0
      ? presetTasks[actorGender]
      : taskPools[actorGender]

    const primaryPool = useTrio ? primaryTrioTasks : primarySoloTasks

    const card = getTaskForPlayer(primaryPool, useTrio ? 'trio' : actorGender, levelFilter)

    if (!card) return null

    let secondaryText = ''
    if (secondaryLang && secondaryLang !== lang) {
      if (typeof card.text === 'object') {
        secondaryText = card.text[secondaryLang] || ''
      } else if (useTrio) {
        const matched = (secondaryTrioPool || []).find((c) => c.id === card.id)
        if (matched) {
          secondaryText = typeof matched.text === 'object' ? matched.text[secondaryLang] : matched.text || ''
        }
      } else {
        const matchedPool = secondaryPools[actorGender] || []
        const matched = matchedPool.find((c) => c.id === card.id)
        if (matched) {
          secondaryText = typeof matched.text === 'object' ? matched.text[secondaryLang] : matched.text || ''
        }
      }
    }

    return {
      ...card,
      isTrio: useTrio,
      action: {
        [lang]: getTaskTextByLang(card, lang),
        ...(secondaryLang && secondaryText ? { [secondaryLang]: secondaryText } : {})
      },
      secondaryRawText: secondaryText
    }
  }

  const walkTo = (target, player, done) => {
    setWalking(true)
    const timer = setInterval(() => {
      setPositions((old) => {
        const currentPos = old[player.id] ?? 0
        const next = currentPos < target ? currentPos + 1 : currentPos - 1
        if (next === target) {
          clearInterval(timer)
          setWalking(false)
          setTimeout(done, 180)
        }
        return { ...old, [player.id]: next }
      })
    }, 180)
  }

  const land = (position, receiver, chain = 0) => {
    if (mode === 'board_3p') {
      if (position >= 32) {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.65 } })
        setGamePhase('climax')
        setModal({
          isOpen: true,
          winnerId: receiver.id,
          rollerId: receiver.id,
          event: tGet(t, 'climax_win_event', '🎉 恭喜 {NAME} 率先达到极乐终点！\n获得【指定首个做爱体位与进入对象】的绝对主导许可权！').replace('{NAME}', receiver.name)
        })
        return
      }

      if (position === 16 && gamePhase === 'break_ice') {
        setGamePhase('bath_checkpoint')
        setShowBathModal(true)
        return
      }

      // 阶段任务洗牌穷尽抽卡制
      let rawCard = null
      if (gamePhase === 'break_ice') {
        if (stage1Deck.length > 0) {
          const [nextCard, ...remaining] = stage1Deck
          rawCard = nextCard
          setStage1Deck(remaining)
          setCompletedTasks((old) => [...old, nextCard.id])
        }
      } else if (gamePhase === 'naked_foreplay') {
        if (stage2Deck.length > 0) {
          const [nextCard, ...remaining] = stage2Deck
          rawCard = nextCard
          setStage2Deck(remaining)
          setCompletedTasks((old) => [...old, nextCard.id])
        }
      }

      if (!rawCard) {
        nextTurn()
        return
      }

      const card = getCardWithSecondary(rawCard)
      const actor = actorFor(receiver) || activePlayers[0]

      setModal({
        isOpen: true,
        rollerId: receiver.id,
        receiverId: receiver.id,
        actorId: actor.id,
        player: receiver,
        receiver,
        actor,
        card,
        onClose: () => {
          setHistory((old) => [
            ...old,
            {
              id: Date.now(),
              receiverId: receiver.id,
              actorId: actor.id,
              actor,
              receiver,
              dice,
              card,
              lang,
              items: structuredClone(items),
              timestamp: Date.now()
            }
          ])
          nextTurn()
        }
      })
      return
    }

    const trackCount = TRACK_COORDINATES.length
    const finishAt = trackCount + 4
    if (position === finishAt) {
      confetti({ particleCount: 140, spread: 70, origin: { y: 0.65 } })
      setModal({ isOpen: true, winnerId: receiver.id, rollerId: receiver.id })
      return
    }
    if (position >= trackCount) {
      nextTurn()
      return
    }
    const trackIndex = (position + receiver.start) % trackCount
    if (chain < 1 && trackIndex % 4 === receiver.lane) {
      const target = Math.min(position + 4, trackCount - 1)
      walkTo(target, receiver, () => land(target, receiver, 1))
      return
    }
    const card = makeCard(receiver)
    if (!card) {
      nextTurn()
      return
    }
    const actor = actorFor(receiver) || activePlayers[0]
    setModal({
      isOpen: true,
      rollerId: receiver.id,
      receiverId: receiver.id,
      actorId: actor.id,
      player: receiver,
      receiver,
      actor,
      card,
      onClose: () => {
        setHistory((old) => [
          ...old,
          {
            id: Date.now(),
            receiverId: receiver.id,
            actorId: actor.id,
            actor,
            receiver,
            dice,
            card,
            lang,
            items: structuredClone(items),
            timestamp: Date.now()
          }
        ])
        nextTurn()
      }
    })
  }

  // 点击查看历史任务详情回调
  const handleViewHistoryTask = (record) => {
    const recActor = record.actor || players.find((p) => p.id === record.actorId) || players[0]
    const recReceiver = record.receiver || players.find((p) => p.id === record.receiverId) || players[0]

    setModal({
      isOpen: true,
      rollerId: recReceiver.id,
      receiverId: recReceiver.id,
      actorId: recActor.id,
      player: recReceiver,
      receiver: recReceiver,
      actor: recActor,
      card: record.card,
      items: record.items || items,
      isHistoryView: true
    })
  }

  // 摇骰与步数裁决逻辑：阶段卡池状态拦截与保底进关
  const roll = () => {
    if (walking || modal || diceModal || !current) return

    setDiceModal({ phase: 'rolling', value: 1 })

    // 1200ms 摇骰过程
    setTimeout(() => {
      const value = Math.ceil(Math.random() * 6)
      setDice(value)
      setDiceModal({ phase: 'result', value })

      setTimeout(() => {
        setDiceModal(null)
        const currentPos = positions[current.id] ?? 0

        let target = currentPos + value
        if (mode === 'board_3p') {
          if (gamePhase === 'break_ice') {
            if (stage1Deck.length > 0) {
              // 阶段一任务未抽完：最多前进到 #15 格，绝对不许进入 #16
              target = Math.min(currentPos + value, 15)
            } else {
              // 阶段一任务已全数耗尽：下一次掷骰保底直接送达 #16 共浴关卡！
              target = 16
            }
          } else if (gamePhase === 'naked_foreplay') {
            if (stage2Deck.length > 0) {
              // 阶段二任务未抽完：最多前进到 #31 格，绝对不许进入 #32
              target = Math.min(currentPos + value, 31)
            } else {
              // 阶段二任务已全数耗尽：下一次掷骰保底直接送达 #32 极乐巅峰！
              target = 32
            }
          }
        } else {
          if (target > TRACK_COORDINATES.length + 4) {
            target = TRACK_COORDINATES.length + 4 - (target - (TRACK_COORDINATES.length + 4))
          }
        }

        walkTo(target, current, () => land(target, current))
      }, 700)
    }, 1200)
  }

  const handleConfirmBath = () => {
    setShowBathModal(false)
    setGamePhase('naked_foreplay')
    nextTurn()
  }

  const reset3PGame = () => {
    setPositions({ male_1: 0, female_1: 0, female_2: 0 })
    setTurn(0)
    setGamePhase('break_ice')
    setShowBathModal(false)
    init3PDecks()
  }

  const selectActor = (id) => setModal((old) => ({ ...old, actorId: id }))

  return (
    <main className="app-shell">
      <div className="aurora a1" />
      <div className="aurora a2" />
      <header>
        <div className="brand">
          <Heart fill="currentColor" size={19} />
          <div>
            <h1>{tGet(t, 'title', '情侣私密飞行棋')}</h1>
            <small>{tGet(t, 'sub', '只属于你们的冒险')}</small>
          </div>
        </div>
        <div className="tools">
          <button aria-label="Settings" onClick={() => setShowPlaySetup(true)}>
            ⚙
          </button>
          <button aria-label="History" onClick={() => setHistoryOpen(true)}>
            <History size={18} />
          </button>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="zh">中文</option>
            <option value="en">EN</option>
            <option value="ja">日本語</option>
            <option value="th">ไทย</option>
          </select>
          <select value={secondaryLang} onChange={(e) => setSecondaryLang(e.target.value)}>
            <option value="">{tGet(t, 'none', '无')}</option>
            <option value="zh">中文</option>
            <option value="en">EN</option>
            <option value="ja">日本語</option>
            <option value="th">ไทย</option>
          </select>
        </div>
      </header>

      {/* 3 种模式 Tab 切换（双语对照模式） */}
      <nav className="mode-switch three-modes">
        <button
          className={mode === 'board_3p' ? 'active' : ''}
          onClick={() => {
            setMode('board_3p')
            setPlayerMode(3)
          }}
        >
          <Bilingual
            k="mode_trio_stage"
            fallback="🔥 3P 极乐双阶段"
            tPrimary={t}
            tSecondary={tSecondary}
            subClassName="text-[8px] opacity-80 font-normal block leading-tight mt-0.5"
          />
        </button>
        <button
          className={mode === 'board' ? 'active' : ''}
          onClick={() => {
            setMode('board')
            setPositions({ male_1: -1, female_1: -1, female_2: -1 })
          }}
        >
          <Bilingual
            k="board"
            fallback="飞行棋冒险"
            tPrimary={t}
            tSecondary={tSecondary}
            subClassName="text-[8px] opacity-80 font-normal block leading-tight mt-0.5"
          />
        </button>
        <button className={mode === 'draw' ? 'active' : ''} onClick={() => setMode('draw')}>
          <Bilingual
            k="draw"
            fallback="纯抽卡"
            tPrimary={t}
            tSecondary={tSecondary}
            subClassName="text-[8px] opacity-80 font-normal block leading-tight mt-0.5"
          />
        </button>
      </nav>

      <AnimatePresence mode="wait">
        <motion.section key={mode} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="game">
          {mode === 'board_3p' ? (
            <TrioStageBoard
              players={players}
              activePlayers={activePlayers}
              positions={positions}
              turn={turn}
              dice={dice}
              walking={walking}
              gamePhase={gamePhase}
              roll={roll}
              resetGame={reset3PGame}
              t={t}
              tSecondary={tSecondary}
              stage1Deck={stage1Deck}
              stage1Total={stage1Total}
              stage2Deck={stage2Deck}
              stage2Total={stage2Total}
            />
          ) : mode === 'board' ? (
            <>
              <div className="board-frame">
                <div className="ludo-board">
                  {TRACK_COORDINATES.map((spot, i) => (
                    <div
                      key={i}
                      className={`space runway c${i % 4}`}
                      style={{ gridRow: spot[0] + 1, gridColumn: spot[1] + 1 }}
                    >
                      <span className="num">{i + 1}</span>
                      {activePlayers.map(
                        (p, index) =>
                          positions[p.id] >= 0 &&
                          positions[p.id] < TRACK_COORDINATES.length &&
                          spotFor(positions[p.id], p).join(',') === spot.join(',') && (
                            <motion.i
                              layout
                              key={p.id}
                              className={`pawn ${playerClass(p)}`}
                              style={{ transform: `translate(${(index % 2) * 5}px,${Math.floor(index / 2) * 5}px)` }}
                            >
                              ✈
                            </motion.i>
                          )
                      )}
                    </div>
                  ))}
                  <Hangar player={players[0]} active={activePlayers.some((p) => p.id === players[0].id)} waiting={positions.male_1 === -1} />
                  <Hangar player={players[1]} active={activePlayers.some((p) => p.id === players[1].id)} waiting={positions.female_1 === -1} />
                  <Hangar player={players[2]} active={activePlayers.some((p) => p.id === players[2].id)} waiting={positions.female_2 === -1} />
                  {HOME_LANES.map((lane, laneIndex) =>
                    lane.map((spot, i) => (
                      <div
                        key={`${laneIndex}-${i}`}
                        className={`home-cell home-${laneIndex}`}
                        style={{ gridRow: spot[0] + 1, gridColumn: spot[1] + 1 }}
                      >
                        {activePlayers
                          .filter((p) => p.lane === laneIndex && positions[p.id] === TRACK_COORDINATES.length + i)
                          .map((p) => (
                            <i key={p.id} className={`pawn ${playerClass(p)}`}>
                              ✈
                            </i>
                          ))}
                      </div>
                    ))
                  )}
                  <div className="center-control">
                    <small>
                      <Bilingual
                        k="turn"
                        fallback="现在轮到"
                        tPrimary={t}
                        tSecondary={tSecondary}
                        subClassName="text-[7.5px] opacity-75 leading-none block"
                      />
                    </small>
                    <b>{current?.name}</b>
                    <button className="primary roll" onClick={roll} disabled={walking}>
                      <Sparkles size={14} className="shrink-0" />
                      <Bilingual
                        k="roll"
                        fallback="掷骰子"
                        tPrimary={t}
                        tSecondary={tSecondary}
                        subClassName="text-[8px] opacity-90 block leading-none mt-0.5"
                      />
                    </button>
                    <span className="last-roll">🎲 {dice}</span>
                  </div>
                </div>
              </div>
              <button
                className="text-button"
                onClick={() => {
                  setPositions({ male_1: -1, female_1: -1, female_2: -1 })
                  setTurn(0)
                }}
              >
                <RotateCcw size={15} />
                <Bilingual
                  k="reset"
                  fallback="重新开始"
                  tPrimary={t}
                  tSecondary={tSecondary}
                  subClassName="text-[8px] opacity-75 block leading-none mt-0.5"
                />
              </button>
            </>
          ) : (
            <>
              <div className="level-tabs">
                {['all', 1, 2, 3].map((l) => (
                  <button key={l} className={filter === l ? 'selected' : ''} onClick={() => setFilter(l)}>
                    {l === 'all' ? tGet(t, 'all', '全部') : `${tGet(t, 'level', '等级')} ${l}`}
                  </button>
                ))}
              </div>
              <div className="card-stage">
                <motion.div className="draw-card" animate={{ rotateY: flipped ? 180 : 0 }}>
                  <div className="card-face card-back">
                    <Heart fill="currentColor" />
                    <span>
                      SECRET
                      <br />
                      QUEST
                    </span>
                  </div>
                  <div className="card-face card-front">
                    <span>✦</span>
                    <p>{modal?.card?.action?.[lang] || tGet(t, 'secret', '今晚的秘密行动')}</p>
                  </div>
                </motion.div>
              </div>
              <button
                className="primary"
                onClick={() => {
                  const card = makeCard(current)
                  if (card) {
                    const actor = actorFor(current)
                    setModal({ receiverId: current.id, actorId: actor.id, card })
                    setFlipped(true)
                  }
                }}
              >
                <Bilingual
                  k="action"
                  fallback="抽取行动卡"
                  tPrimary={t}
                  tSecondary={tSecondary}
                  subClassName="text-[9px] opacity-90 block leading-none mt-0.5"
                />
              </button>
            </>
          )}
        </motion.section>
      </AnimatePresence>

      <AnimatePresence>
        {/* 开局准备弹窗 */}
        {showPlaySetup && (
          <PlaySetupModal
            isOpen={showPlaySetup}
            onClose={() => setShowPlaySetup(false)}
            players={players}
            setPlayers={setPlayers}
            playerMode={playerMode}
            setPlayerMode={setPlayerMode}
            items={items}
            setItems={setItems}
            t={t}
            tSecondary={tSecondary}
            onStart={() => reset3PGame()}
          />
        )}

        {/* 任务工坊/预设深度设置弹窗 */}
        {showWorkshop && (
          <TaskWorkshopModal
            isOpen={showWorkshop}
            close={() => setShowWorkshop(false)}
            t={t}
            tSecondary={tSecondary}
            downloadJson={_downloadJson}
          />
        )}

        {diceModal && <DiceOverlay dice={diceModal} t={t} tSecondary={tSecondary} />}
        {modal && (
          <TaskModal
            modal={modal}
            setModal={setModal}
            players={players}
            activePlayers={activePlayers}
            items={items}
            lang={lang}
            secondaryLang={secondaryLang}
            secondaryPools={secondaryPools}
            secondaryTrioPool={secondaryTrioPool}
            t={t}
            tSecondary={tSecondary}
            selectActor={selectActor}
          />
        )}
        {showBathModal && <BathCheckpointModal isOpen={showBathModal} onConfirm={handleConfirmBath} t={t} tSecondary={tSecondary} />}
        {historyOpen && (
          <HistoryPanel
            entries={history}
            players={players}
            close={() => setHistoryOpen(false)}
            t={t}
            tSecondary={tSecondary}
            items={items}
            onSelectRecord={(record) => handleViewHistoryTask(record)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

function Hangar({ player, active, waiting }) {
  const styles =
    player.hangar === 'male'
      ? { gridColumn: '1/6', gridRow: '11/16' }
      : player.hangar === 'female-a'
      ? { gridColumn: '11/16', gridRow: '1/6' }
      : { gridColumn: '1/6', gridRow: '1/6' }
  return active ? (
    <div className={`hangar ${playerClass(player)}`} style={{ ...styles, borderColor: playerColor(player) }}>
      <span>{player.symbol}</span>
      <b>{player.name}</b>
      <small>START · 5 / 6</small>
      {waiting && <i className={`pawn ${playerClass(player)}`}>✈</i>}
    </div>
  ) : null
}

function DiceFace({ value }) {
  const pips =
    {
      1: [5],
      2: [1, 9],
      3: [1, 5, 9],
      4: [1, 3, 7, 9],
      5: [1, 3, 5, 7, 9],
      6: [1, 3, 4, 6, 7, 9]
    }[value] || []
  return (
    <div className="dice-pips">
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} className={pips.includes(i + 1) ? 'on' : ''} />
      ))}
    </div>
  )
}

function DiceOverlay({ dice, t, tSecondary }) {
  const isRolling = dice.phase === 'rolling'

  return (
    <motion.div className="overlay dice-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="dice-box flex flex-col items-center justify-center space-y-4">
        <div className="dice-stage">
          <Dice value={dice.value} rolling={isRolling} />
        </div>

        {/* 结算文案双行严格拆分 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '4px', marginTop: '16px' }}>
          {isRolling ? (
            <Bilingual
              k="dice_rolling"
              fallback="骰子摇动中…"
              tPrimary={t}
              tSecondary={tSecondary}
              className="text-sm sm:text-base font-bold text-pink-200 tracking-wider"
              subClassName="text-xs text-zinc-400 font-normal block leading-tight mt-1"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', display: 'block' }}>
                🎉 {tGet(t, 'rolled', '掷出了')} <strong style={{ color: '#f43f5e', fontSize: '20px', fontWeight: '900' }}>{dice.value}</strong> {tGet(t, 'points', '点！')}
              </span>
              {tSecondary && tGet(tSecondary, 'rolled') !== tGet(t, 'rolled') && (
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#a1a1aa', display: 'block', marginTop: '2px' }}>
                  🎉 {tGet(tSecondary, 'rolled')} {dice.value} {tGet(tSecondary, 'points')}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Countdown({ seconds }) {
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(false)
  useEffect(() => {
    if (!running || left <= 0) return
    const id = setInterval(() => setLeft((v) => v - 1), 1000)
    return () => clearInterval(id)
  }, [running, left])
  return (
    <div className="timer">
      <b>
        {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
      </b>
      <div>
        <button onClick={() => setLeft((v) => Math.max(0, v - 10))}>
          <Minus size={15} />
          10
        </button>
        <button className="timer-play" onClick={() => setRunning((v) => !v)}>
          {running ? <Pause /> : <Play />}
        </button>
        <button onClick={() => setLeft((v) => v + 10)}>
          <Plus size={15} />
          10
        </button>
      </div>
    </div>
  )
}

function TaskModal({
  modal,
  setModal,
  players,
  activePlayers,
  items,
  lang,
  secondaryLang,
  secondaryPools,
  secondaryTrioPool = [],
  t,
  tSecondary,
  selectActor
}) {
  if (!modal || modal.isOpen === false) return null
  const fallback = players[0] || { id: 'default', gender: 'male', nickname: '玩家', name: '玩家', symbol: '♂', color: 'blue' }
  const roller = players.find((p) => p.id === (modal.rollerId || modal.playerId)) || modal.player || fallback
  const receiver = players.find((p) => p.id === modal.receiverId) || modal.receiver || roller || fallback
  const actor = players.find((p) => p.id === modal.actorId) || modal.actor || players.find((p) => p.gender === 'female') || fallback
  const close = () => {
    setModal(null)
    if (!modal.isHistoryView) {
      modal.onClose?.()
    }
  }
  const actorChoices = (receiver?.gender || 'male') === 'male' ? activePlayers.filter((p) => p.gender === 'female') : []

  if (modal.winnerId) {
    const winner = players.find((p) => p.id === modal.winnerId) || fallback
    return (
      <motion.div className="overlay">
        <div className="modal">
          <div className="medal">♛</div>
          <h2>
            <Bilingual
              k="win"
              fallback={`${winner?.name || winner?.nickname || '玩家'} 获胜！`}
              tPrimary={t}
              tSecondary={tSecondary}
            />
          </h2>
          {modal.event && <p className="text-amber-300 text-sm mt-2 whitespace-pre-line font-bold">{modal.event}</p>}
          <button className="primary mt-4" onClick={close}>
            <Bilingual k="close" fallback="完成" tPrimary={t} tSecondary={tSecondary} />
          </button>
        </div>
      </motion.div>
    )
  }

  if (!modal.card && !modal.event) {
    console.warn('TaskModal opened without card data', modal)
    return null
  }

  const sourceCard = modal.card || {}
  const primaryContent = modal.event || modal.card?.action?.[lang] || getTaskTextByLang(sourceCard, lang) || ''

  let secondaryContent = ''
  if (secondaryLang && secondaryLang !== lang) {
    if (modal.card?.secondaryRawText) {
      secondaryContent = modal.card.secondaryRawText
    } else if (modal.card?.action?.[secondaryLang]) {
      secondaryContent = modal.card.action[secondaryLang]
    } else if (typeof sourceCard.text === 'object') {
      secondaryContent = sourceCard.text[secondaryLang] || ''
    } else {
      const secTrioMatch = (secondaryTrioPool || []).find((c) => c.id === sourceCard.id)
      if (secTrioMatch) {
        secondaryContent = typeof secTrioMatch.text === 'object' ? secTrioMatch.text[secondaryLang] : secTrioMatch.text || ''
      } else {
        const secActionMatch = [...(secondaryPools?.male || []), ...(secondaryPools?.female || [])].find((c) => c.id === sourceCard.id)
        if (secActionMatch) {
          secondaryContent = typeof secActionMatch.text === 'object' ? secActionMatch.text[secondaryLang] : secActionMatch.text || ''
        }
      }
    }
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal task-modal" initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <button className="close" onClick={close}>
          <X />
        </button>

        {/* 1. 顶部 Header 结构与层级优化（主大副小，独立 block 解耦，绝不粘连） */}
        <div className="turn-banner" style={{ borderColor: playerColor(receiver) }}>
          <div className="banner-title flex flex-col">
            <span className="font-bold text-white text-sm sm:text-base block">
              {modal.card?.isTrio
                ? tGet(t, 'card_trio_title', '✦ 三人协同极乐任务')
                : `${receiver?.symbol || ((receiver?.gender || 'male') === 'female' ? '♀' : '♂')} ${receiver?.name || receiver?.nickname || '玩家'} ${tGet(t, 'rolled', '摇中任务')}`}
            </span>
            {tSecondary && (
              <span className="text-[11px] text-zinc-400 font-normal mt-0.5 leading-tight block">
                {modal.card?.isTrio
                  ? tGet(tSecondary, 'card_trio_title')
                  : `${receiver?.name || ''} ${tGet(tSecondary, 'rolled', '')}`}
              </span>
            )}
          </div>

          <div className="banner-sub flex flex-col mt-1">
            <span className="text-xs text-zinc-300 block">
              {modal.card?.isTrio
                ? tGet(t, 'card_trio_sub', '三位玩家请共同完成以下分工')
                : `${actor?.name || '玩家'} ${tGet(t, 'card_solo_serve', '请服侍')} ${receiver?.name || '玩家'}`}
            </span>
            {tSecondary && (
              <span className="text-[10px] text-zinc-400 font-normal mt-0.5 leading-snug block">
                {modal.card?.isTrio
                  ? tGet(tSecondary, 'card_trio_sub')
                  : tGet(tSecondary, 'card_solo_sub', '{ACTOR} serve {RECEIVER}')
                      .replace('{ACTOR}', actor?.name || '')
                      .replace('{RECEIVER}', receiver?.name || '')}
              </span>
            )}
          </div>
        </div>

        {/* 2. Modal Kicker 指令 */}
        <div className="modal-kicker flex flex-col items-center my-1">
          <span className="text-xs font-bold text-pink-300">
            {tGet(t, 'card_cmd', '✦ 任务指令')}
          </span>
          {tSecondary && tGet(tSecondary, 'card_cmd') !== tGet(t, 'card_cmd') && (
            <span className="text-[9px] text-pink-400/80 font-normal mt-0.5">
              {tGet(tSecondary, 'card_cmd')}
            </span>
          )}
        </div>

        {/* 3. 核心任务指令双语对照呈现 */}
        <div className="space-y-2 my-3">
          <h2 className="!text-base sm:!text-lg font-medium leading-relaxed text-pink-100">
            {renderTemplate(primaryContent, modal.items || items, actor, receiver, players, t)}
          </h2>

          {secondaryContent && secondaryContent !== primaryContent && (
            <div className="p-2.5 sm:p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs sm:text-sm text-purple-200/90 leading-relaxed font-normal text-left shadow-inner">
              {renderTemplate(secondaryContent, modal.items || items, actor, receiver, players, tSecondary || t)}
            </div>
          )}
        </div>

        {!modal.isHistoryView && modal.card?.duration && <Countdown seconds={modal.card.duration} />}

        {actorChoices.length > 1 && !modal.card?.isTrio && !modal.isHistoryView && (
          <div className="actor-switch my-2">
            <small className="block mb-1 text-[11px] text-zinc-400">
              <Bilingual
                k="select_executor"
                fallback="选择执行者"
                tPrimary={t}
                tSecondary={tSecondary}
              />
            </small>
            <div className="flex justify-center gap-2">
              {actorChoices.map((p) => (
                <button key={p.id} className={p.id === actor?.id ? 'picked' : ''} onClick={() => selectActor(p.id)}>
                  {p.symbol} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. 底部 3 角色卡片 & 2 角色卡片排版瘦身 */}
        {modal.card?.isTrio ? (
          <div className="trio-roles">
            {activePlayers.map((p) => {
              const roleTitlePrimary =
                p.id === 'male_1'
                  ? tGet(t, 'role_male', '♂ 男方')
                  : p.id === 'female_1'
                  ? tGet(t, 'role_female_a', '♀ 女方 A')
                  : tGet(t, 'role_female_b', '♀ 女方 B')

              const tagPrimary = tGet(t, 'role_cooperate', '协同')
              const tagSecondary = tSecondary ? tGet(tSecondary, 'role_cooperate', '') : ''

              return (
                <div key={p.id} style={{ borderColor: playerColor(p) }}>
                  <small>{roleTitlePrimary}</small>
                  <b style={{ color: playerColor(p) }}>{p.name}</b>
                  <span className="role-tag">
                    <span>{tagPrimary}</span>
                    {tagSecondary && tagSecondary !== tagPrimary && (
                      <span className="ml-1 opacity-75 text-[8px]">{tagSecondary}</span>
                    )}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="task-roles">
            <div style={{ borderColor: playerColor(actor) }}>
              <small>{tGet(t, 'role_active', '✦ 主动方')}</small>
              <b style={{ color: playerColor(actor) }}>
                {actor?.symbol || ((actor?.gender || 'male') === 'female' ? '♀' : '♂')} {actor?.name || actor?.nickname || '玩家'}
              </b>
              <span className="role-tag">{tGet(t, 'role_do', '执行')}</span>
            </div>

            <div style={{ borderColor: playerColor(receiver) }}>
              <small>{tGet(t, 'role_receiver', '♡ 受众方')}</small>
              <b style={{ color: playerColor(receiver) }}>
                {receiver?.symbol || ((receiver?.gender || 'male') === 'female' ? '♀' : '♂')} {receiver?.name || receiver?.nickname || '玩家'}
              </b>
              <span className="role-tag">{tGet(t, 'role_enjoy', '享受')}</span>
            </div>
          </div>
        )}

        {/* 5. 底部完成按钮主副分离 */}
        <button className="primary w-full py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all mt-3" onClick={close}>
          <span className="text-sm font-bold tracking-wide">{tGet(t, 'close', '完成')}</span>
          {tSecondary && tGet(tSecondary, 'close') !== tGet(t, 'close') && (
            <span className="text-[10px] font-normal opacity-85 ml-1">{tGet(tSecondary, 'close')}</span>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}

function HistoryPanel({ entries, players, close, t, tSecondary, items, onSelectRecord }) {
  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="modal history-panel relative max-w-md w-full p-6 bg-zinc-900 border border-white/10 rounded-3xl text-left shadow-2xl space-y-4">
        <button className="close absolute top-4 right-4 text-zinc-400 hover:text-white p-2" onClick={close}>
          <X size={18} />
        </button>

        {/* 标题双语独立分行排版 */}
        <div className="flex flex-col items-center justify-center text-center mb-4 pb-2 border-b border-white/10">
          <span className="text-base font-bold text-white flex items-center gap-1.5">
            📜 <Bilingual k="history_title" fallback="游戏历史" tPrimary={t} />
          </span>
          {tSecondary && (
            <span className="text-xs text-zinc-400 mt-0.5">
              📜 <Bilingual k="history_title" fallback="ประวัติการเล่น" tPrimary={tSecondary} />
            </span>
          )}
        </div>

        {/* 历史记录列表 */}
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {entries.length ? (
            entries.slice().reverse().map((e) => {
              const receiver = players.find((p) => p.id === e.receiverId) || e.receiver || players[0]
              const actor = players.find((p) => p.id === e.actorId) || e.actor || players[0]

              const rawCardText =
                e.card?.action?.[tGet(t, 'lang', 'zh')] ||
                getTaskTextByLang(e.card, tGet(t, 'lang', 'zh')) ||
                (typeof e.card?.text === 'string' ? e.card.text : e.card?.text?.zh) ||
                ''

              const compiledContent = renderTemplate(
                rawCardText,
                e.items || items,
                actor,
                receiver,
                players,
                t
              )

              return (
                <button
                  key={e.id}
                  type="button"
                  className="w-full flex items-center justify-between p-3.5 mb-2.5 rounded-2xl border border-white/10 hover:border-pink-500/40 active:scale-[0.98] transition-all cursor-pointer text-left group"
                  style={{ backgroundColor: 'rgba(39, 39, 42, 0.75)', color: '#ffffff' }}
                  onClick={() => onSelectRecord(e)}
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0 pr-2">
                    {/* 顶栏双方昵称与骰子 */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
                      <span style={{ color: playerColor(actor) }}>{actor?.name || actor?.nickname || '玩家'}</span>
                      <span className="text-zinc-500">→</span>
                      <span style={{ color: playerColor(receiver) }}>{receiver?.name || receiver?.nickname || '玩家'}</span>
                      <span className="ml-2 text-pink-300 font-mono">🎲 {e.dice}</span>
                      <span className="ml-auto text-[10px] text-pink-400/80 font-mono">#{e.card?.id || 'quest'}</span>
                    </div>

                    {/* 解析完成的真实任务，带高亮名称与道具，无代码占位符 */}
                    <div className="text-xs text-zinc-300 mt-1 line-clamp-2 leading-relaxed opacity-90">
                      {compiledContent}
                    </div>
                  </div>

                  <span className="text-zinc-400 group-hover:text-pink-400 transition-colors text-base font-bold shrink-0 ml-2">›</span>
                </button>
              )
            })
          ) : (
            <p className="text-xs text-zinc-500 py-8 text-center">
              <Bilingual
                k="history_empty"
                fallback="尚无已完成的回合数据"
                tPrimary={t}
                tSecondary={tSecondary}
              />
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

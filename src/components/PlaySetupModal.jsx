import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Sparkles, Upload, X, Check } from 'lucide-react'
import { tGet } from '../utils/i18n.js'
import { Bilingual } from './Bilingual.jsx'
import {
  getPresetData,
  setActivePreset,
  importPreset
} from '../utils/presetManager.js'

const QUICK_BUBBLES = {
  DRINKABLE: ['红酒', '起泡酒', '冰水', '果汁'],
  EATABLE: ['冰块', '巧克力酱', '蜂蜜', '跳跳糖'],
  ITEM: ['眼罩', '丝巾', '领带', '羽毛', '跳蛋']
}

export default function PlaySetupModal({
  isOpen,
  onClose,
  players,
  setPlayers,
  playerMode,
  setPlayerMode,
  items,
  setItems,
  t,
  tSecondary,
  onStart
}) {
  if (!isOpen) return null

  const presetData = getPresetData()
  const [selectedPresetId, setSelectedPresetId] = useState(presetData.activePresetId)
  const [presetsList, setPresetsList] = useState(presetData.presets)
  const [drafts, setDrafts] = useState({ DRINKABLE: '', EATABLE: '', ITEM: '' })

  const lang = tGet(t, 'lang', 'zh')
  const secondaryLang = tSecondary ? tGet(tSecondary, 'lang', '') : ''

  const getPresetText = (fieldObj, targetLang) => {
    if (!fieldObj) return ''
    if (typeof fieldObj === 'string') return fieldObj
    return fieldObj[targetLang] || fieldObj.zh || fieldObj.en || fieldObj.th || ''
  }

  const handleNameChange = (id, nickname) => {
    setPlayers((old) =>
      old.map((p) => (p.id === id ? { ...p, nickname, name: nickname } : p))
    )
  }

  const toggleBubbleItem = (key, val) => {
    setItems((old) => {
      const currentList = old[key] || []
      if (currentList.includes(val)) {
        return { ...old, [key]: currentList.filter((item) => item !== val) }
      }
      return { ...old, [key]: [...currentList, val] }
    })
  }

  const handleAddDraft = (key) => {
    const val = drafts[key].trim()
    if (val) {
      setItems((old) => ({
        ...old,
        [key]: (old[key] || []).includes(val) ? old[key] : [...(old[key] || []), val]
      }))
      setDrafts((old) => ({ ...old, [key]: '' }))
    }
  }

  const handleRemoveItem = (key, val) => {
    setItems((old) => ({
      ...old,
      [key]: (old[key] || []).filter((item) => item !== val)
    }))
  }

  const handlePresetSelect = (id) => {
    setSelectedPresetId(id)
    const target = presetsList.find((p) => p.id === id)
    if (target?.mode === 'board_3p') {
      setPlayerMode(3)
    } else if (target?.mode === 'board') {
      setPlayerMode(2)
    }
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result || ''))
        const newPreset = importPreset(json)
        const updatedData = getPresetData()
        setPresetsList(updatedData.presets)
        setSelectedPresetId(newPreset.id)
      } catch {
        window.alert('主题包 JSON 格式无效')
      }
    }
    reader.readAsText(file)
  }

  const handleConfirmStart = () => {
    setActivePreset(selectedPresetId)
    if (onStart) onStart()
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(8px)',
        padding: '16px'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '85vh',
          overflowY: 'auto',
          backgroundColor: '#18181b',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '24px',
          color: '#fff'
        }}
      >
        {/* 绝对定位关闭按钮 */}
        <button
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 0,
            color: '#a1a1aa',
            cursor: 'pointer',
            padding: '4px'
          }}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* 顶部 Header（嵌套 Bilingual 居中） */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: '6px' }}>
          <Heart fill="currentColor" style={{ color: '#f472b6' }} size={24} />
          <Bilingual
            k="choose"
            fallback="开始前，请选择你们的角色"
            tPrimary={t}
            tSecondary={tSecondary}
            className="text-lg font-bold text-white"
            subClassName="text-xs text-zinc-400 font-normal mt-0.5"
          />
        </div>

        {/* 模块一：角色模式与昵称 */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#f9a8d4', textTransform: 'uppercase', margin: 0 }}>
            1. 模式与角色昵称
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '6px', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              type="button"
              style={{
                backgroundColor: playerMode === 2 ? 'rgba(219,39,119,0.3)' : 'transparent',
                color: playerMode === 2 ? '#fbcfe8' : '#a1a1aa',
                border: playerMode === 2 ? '1px solid #ec4899' : '1px solid transparent',
                borderRadius: '12px',
                padding: '8px',
                cursor: 'pointer'
              }}
              onClick={() => setPlayerMode(2)}
            >
              <Bilingual k="mode_duo" fallback="二人模式" tPrimary={t} tSecondary={tSecondary} />
            </button>

            <button
              type="button"
              style={{
                backgroundColor: playerMode === 3 ? 'rgba(219,39,119,0.3)' : 'transparent',
                color: playerMode === 3 ? '#fbcfe8' : '#a1a1aa',
                border: playerMode === 3 ? '1px solid #ec4899' : '1px solid transparent',
                borderRadius: '12px',
                padding: '8px',
                cursor: 'pointer'
              }}
              onClick={() => setPlayerMode(3)}
            >
              <Bilingual k="mode_trio" fallback="三人模式" tPrimary={t} tSecondary={tSecondary} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
            {players.slice(0, playerMode).map((p) => {
              const labelText =
                p.id === 'male_1'
                  ? tGet(t, 'role_male', '♂ 男方')
                  : p.id === 'female_1'
                  ? tGet(t, 'role_female_a', '♀ 女方 A')
                  : tGet(t, 'role_female_b', '♀ 女方 B')

              return (
                <div key={p.id} style={{ padding: '10px', borderRadius: '14px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#d4d4d8' }}>{labelText}</label>
                  <input
                    style={{
                      backgroundColor: '#000',
                      color: '#fff',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      fontSize: '13px',
                      width: '100%',
                      outline: 'none'
                    }}
                    value={p.nickname}
                    onChange={(e) => handleNameChange(p.id, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* 模块二：选择玩法主题包 */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          <div style={{ display: 'flex', itemsCenter: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#f9a8d4', textTransform: 'uppercase', margin: 0 }}>
              2. 选择玩法主题包 (Preset)
            </h3>
            <label style={{ fontSize: '11px', color: '#f472b6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Upload size={12} />
              <span>导入 JSON 主题包</span>
              <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportFile} />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {presetsList.map((preset) => {
              const isSelected = selectedPresetId === preset.id
              const primaryName = getPresetText(preset.name, lang)
              const secondaryName = secondaryLang && secondaryLang !== lang ? getPresetText(preset.name, secondaryLang) : ''

              const primaryDesc = getPresetText(preset.desc, lang)
              const secondaryDesc = secondaryLang && secondaryLang !== lang ? getPresetText(preset.desc, secondaryLang) : ''

              return (
                <div
                  key={preset.id}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    border: isSelected ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: isSelected ? 'rgba(131,24,67,0.3)' : 'rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{primaryName}</span>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          fontWeight: '600',
                          backgroundColor: preset.isBuiltin ? 'rgba(245,158,11,0.2)' : 'rgba(168,85,247,0.2)',
                          color: preset.isBuiltin ? '#fcd34d' : '#e9d5ff',
                          border: preset.isBuiltin ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(168,85,247,0.3)'
                        }}
                      >
                        {preset.isBuiltin ? '官方内置' : '自建套件'}
                      </span>
                    </div>

                    {secondaryName && secondaryName !== primaryName && (
                      <div style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px' }}>
                        {secondaryName}
                      </div>
                    )}

                    <p style={{ fontSize: '12px', color: '#d4d4d8', marginTop: '6px', margin: 0, lineHeight: 1.4 }}>{primaryDesc}</p>

                    {secondaryDesc && secondaryDesc !== primaryDesc && (
                      <p style={{ fontSize: '11px', color: '#a1a1aa', marginTop: '2px', margin: 0, lineHeight: 1.4 }}>
                        {secondaryDesc}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: isSelected ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.2)',
                      backgroundColor: isSelected ? '#ec4899' : 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && <Check size={12} style={{ color: '#fff' }} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 模块三：今晚即兴道具与快捷气泡 */}
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#f9a8d4', textTransform: 'uppercase', margin: 0 }}>
            3. 今晚即兴道具 (快捷勾选)
          </h3>

          {[
            ['DRINKABLE', tGet(t, 'drinkable', '饮品'), QUICK_BUBBLES.DRINKABLE],
            ['EATABLE', tGet(t, 'eatable', '食材'), QUICK_BUBBLES.EATABLE],
            ['ITEM', tGet(t, 'item', '道具'), QUICK_BUBBLES.ITEM]
          ].map(([key, label, bubbles]) => (
            <div key={key} style={{ padding: '12px', borderRadius: '16px', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e4e4e7' }}>{label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    style={{
                      backgroundColor: '#000',
                      color: '#fff',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      width: '120px',
                      outline: 'none'
                    }}
                    placeholder="自定义 + 回车"
                    value={drafts[key]}
                    onChange={(e) => setDrafts((old) => ({ ...old, [key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDraft(key)}
                  />
                  <button
                    type="button"
                    style={{ padding: '6px', borderRadius: '8px', backgroundColor: 'rgba(131,24,67,0.6)', border: '1px solid rgba(236,72,153,0.4)', color: '#fbcfe8', cursor: 'pointer' }}
                    onClick={() => handleAddDraft(key)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* 快捷气泡 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                {bubbles.map((item) => {
                  const active = (items[key] || []).includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        border: active ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.1)',
                        backgroundColor: active ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.04)',
                        color: active ? '#fbcfe8' : '#a1a1aa',
                        fontWeight: active ? 'bold' : 'normal',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleBubbleItem(key, item)}
                    >
                      {active ? '✓ ' : '+ '}{item}
                    </button>
                  )
                })}
              </div>

              {/* 已选标签显示 */}
              {(items[key] || []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  {items[key].map((value) => (
                    <span
                      key={value}
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'rgba(131,24,67,0.5)',
                        border: '1px solid rgba(236,72,153,0.4)',
                        color: '#fbcfe8',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {value}
                      <button type="button" style={{ background: 'transparent', border: 0, color: '#f472b6', cursor: 'pointer' }} onClick={() => handleRemoveItem(key, value)}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <button
          type="button"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '16px',
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#fff',
            background: 'linear-gradient(90deg, #ec4899, #f43f5e, #a855f7)',
            border: 0,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(236,72,153,0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            marginTop: '20px'
          }}
          onClick={handleConfirmStart}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={18} />
            <Bilingual k="start_game" fallback="🚀 开始冒险" tPrimary={t} tSecondary={tSecondary} />
          </div>
        </button>
      </div>
    </div>
  )
}

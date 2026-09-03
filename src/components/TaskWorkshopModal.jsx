import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Plus, Trash2, Download, Upload, X, Save } from 'lucide-react'
import { tGet } from '../utils/i18n.js'
import { Bilingual } from './Bilingual.jsx'
import {
  getPresetData,
  saveCustomPreset,
  deleteCustomPreset,
  exportPreset,
  importPreset,
  setActivePreset
} from '../utils/presetManager.js'

const TOKENS = ['{MALE}', '{FEMALE_1}', '{FEMALE_2}', '{ITEM}', '{DRINKABLE}', '{EATABLE}']

export default function TaskWorkshopModal({
  isOpen,
  close,
  t,
  tSecondary,
  downloadJson
}) {
  if (!isOpen) return null

  const data = getPresetData()
  const [presets, setPresets] = useState(data.presets)
  const [activeId, setActiveId] = useState(data.activePresetId)
  const [category, setCategory] = useState('trio')
  const [newPresetName, setNewPresetName] = useState('')

  const currentPreset = presets.find((p) => p.id === activeId) || presets[0]

  const categories = [
    ['trio', tGet(t, 'task_cat_trio', '三人协同/3P极乐')],
    ['action', tGet(t, 'task_cat_action', '动作卡')],
    ['drinkable', tGet(t, 'task_cat_drinkable', '饮品卡')],
    ['eatable', tGet(t, 'task_cat_eatable', '食品卡')],
    ['item', tGet(t, 'task_cat_item', '道具卡')]
  ]

  const handleSelectPreset = (id) => {
    setActiveId(id)
    setActivePreset(id)
  }

  const handleTaskTextChange = (idx, textVal) => {
    if (currentPreset.isBuiltin) return
    const updatedTasks = { ...currentPreset.tasks }
    const catList = [...(updatedTasks[category] || [])]
    if (catList[idx]) {
      catList[idx] = { ...catList[idx], text: textVal }
      updatedTasks[category] = catList
      const updatedPreset = { ...currentPreset, tasks: updatedTasks }
      saveCustomPreset(updatedPreset)
      setPresets(getPresetData().presets)
    }
  }

  const handleTaskLevelChange = (idx, levelVal) => {
    if (currentPreset.isBuiltin) return
    const updatedTasks = { ...currentPreset.tasks }
    const catList = [...(updatedTasks[category] || [])]
    if (catList[idx]) {
      catList[idx] = { ...catList[idx], level: Number(levelVal) }
      updatedTasks[category] = catList
      const updatedPreset = { ...currentPreset, tasks: updatedTasks }
      saveCustomPreset(updatedPreset)
      setPresets(getPresetData().presets)
    }
  }

  const handleAddTask = () => {
    if (currentPreset.isBuiltin) return
    const updatedTasks = { ...currentPreset.tasks }
    const catList = [...(updatedTasks[category] || [])]
    catList.push({
      id: `custom_${category}_${Date.now()}`,
      level: 1,
      duration: 30,
      text: ''
    })
    updatedTasks[category] = catList
    const updatedPreset = { ...currentPreset, tasks: updatedTasks }
    saveCustomPreset(updatedPreset)
    setPresets(getPresetData().presets)
  }

  const handleDeleteTask = (idx) => {
    if (currentPreset.isBuiltin) return
    const updatedTasks = { ...currentPreset.tasks }
    updatedTasks[category] = (updatedTasks[category] || []).filter((_, i) => i !== idx)
    const updatedPreset = { ...currentPreset, tasks: updatedTasks }
    saveCustomPreset(updatedPreset)
    setPresets(getPresetData().presets)
  }

  const handleSaveAsNew = () => {
    const nameStr = newPresetName.trim() || `自订游戏包 ${Date.now().toString().slice(-4)}`
    const newP = {
      id: `custom_${Date.now()}`,
      name: { zh: nameStr, en: nameStr, th: nameStr },
      desc: { zh: '使用者自建专套件', en: 'Custom User Preset', th: 'ชุดการตั้งค่าสร้างเอง' },
      mode: currentPreset.mode || 'board_3p',
      tasks: structuredClone(currentPreset.tasks)
    }
    saveCustomPreset(newP)
    const updatedData = getPresetData()
    setPresets(updatedData.presets)
    setActiveId(newP.id)
    setNewPresetName('')
  }

  const handleDeletePreset = (id) => {
    if (window.confirm('确定要删除该主题套件吗？')) {
      const updatedData = deleteCustomPreset(id)
      setPresets(updatedData.presets)
      setActiveId(updatedData.activePresetId)
    }
  }

  const handleExport = (id) => {
    exportPreset(id, downloadJson)
  }

  const handleImportFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const json = JSON.parse(String(reader.result || ''))
        const imported = importPreset(json)
        const updatedData = getPresetData()
        setPresets(updatedData.presets)
        setActiveId(imported.id)
      } catch {
        window.alert('主题包格式无效')
      }
    }
    reader.readAsText(file)
  }

  const activeCatTasks = currentPreset?.tasks?.[category] || []

  return (
    <motion.div
      className="overlay !z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="modal max-w-2xl w-full p-6 text-left space-y-5 border border-white/15 bg-neutral-900/95 shadow-2xl rounded-3xl backdrop-blur-2xl max-h-[88vh] overflow-y-auto"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Heart fill="currentColor" className="text-pink-400" size={20} />
            <h2 className="text-lg font-bold text-white font-serif">
              <Bilingual k="manage" fallback="任务工坊与预设中心" tPrimary={t} tSecondary={tSecondary} />
            </h2>
          </div>
          <button className="text-zinc-400 hover:text-white" onClick={close}>
            <X size={18} />
          </button>
        </div>

        {/* 预设套件选择及管理 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-pink-300">主题包选择</span>
            <label className="text-[11px] text-pink-400 hover:underline cursor-pointer flex items-center gap-1">
              <Upload size={12} />
              <span>导入 Preset JSON</span>
              <input type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const selected = p.id === activeId
              const pName = tGet(p.name, tGet(t, 'lang', 'zh'), p.name?.zh || p.name)
              return (
                <div
                  key={p.id}
                  className={`px-3 py-1.5 rounded-xl border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                    selected
                      ? 'border-pink-500 bg-pink-950/50 text-pink-200 font-bold'
                      : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                  onClick={() => handleSelectPreset(p.id)}
                >
                  <span>{pName}</span>
                  {p.isBuiltin && <span className="text-[8px] opacity-70">(内置)</span>}
                  {!p.isBuiltin && (
                    <button
                      className="hover:text-rose-400 ml-1"
                      title="删除此预设"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePreset(p.id)
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <input
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none flex-1"
              placeholder="另存为新自定义主题包名称…"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
            />
            <button
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1 shrink-0"
              onClick={handleSaveAsNew}
            >
              <Save size={13} />
              <span>另存新预设</span>
            </button>
            <button
              className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-zinc-200 text-xs font-bold flex items-center gap-1 shrink-0"
              onClick={() => handleExport(activeId)}
            >
              <Download size={13} />
              <span>导出单包</span>
            </button>
          </div>
        </div>

        {/* 任务分类 Tab */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap gap-1.5 border-b border-white/10 pb-2">
            {categories.map(([id, label]) => (
              <button
                key={id}
                className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                  category === id
                    ? 'border-pink-500 bg-pink-950/40 text-pink-200 font-bold'
                    : 'border-white/10 bg-white/5 text-zinc-400'
                }`}
                onClick={() => setCategory(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {currentPreset.isBuiltin && (
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90">
              💡 官方内置主题包为只读格式。如需修改，请点击上方「另存新预设」后再编辑！
            </div>
          )}

          {/* 任务列表 */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {activeCatTasks.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">暂无任务。</p>
            ) : (
              activeCatTasks.map((task, idx) => {
                const textVal =
                  typeof task.text === 'object'
                    ? task.text.zh || task.text.en || task.text.th || ''
                    : task.text || ''

                return (
                  <div
                    key={task.id || idx}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs"
                  >
                    <textarea
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none disabled:opacity-60"
                      rows={2}
                      value={textVal}
                      disabled={currentPreset.isBuiltin}
                      onChange={(e) => handleTaskTextChange(idx, e.target.value)}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <select
                          className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 text-xs text-white disabled:opacity-60"
                          value={task.level}
                          disabled={currentPreset.isBuiltin}
                          onChange={(e) => handleTaskLevelChange(idx, e.target.value)}
                        >
                          <option value={1}>Level 1 (阶段一微醺)</option>
                          <option value={2}>Level 2 (阶段二前戏)</option>
                          <option value={3}>Level 3 (阶段二深层)</option>
                        </select>
                      </div>

                      {!currentPreset.isBuiltin && (
                        <button
                          className="text-rose-400 hover:text-rose-300 text-xs"
                          onClick={() => handleDeleteTask(idx)}
                        >
                          删除
                        </button>
                      )}
                    </div>

                    {!currentPreset.isBuiltin && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {TOKENS.map((token) => (
                          <button
                            key={token}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-zinc-300"
                            onClick={() =>
                              handleTaskTextChange(idx, `${textVal}${token}`)
                            }
                          >
                            {token}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {!currentPreset.isBuiltin && (
            <button
              className="w-full py-2.5 rounded-xl bg-pink-950/50 border border-pink-500/40 text-pink-200 text-xs font-bold flex items-center justify-center gap-1"
              onClick={handleAddTask}
            >
              <Plus size={14} />
              <span>新增一条任务</span>
            </button>
          )}
        </div>

        <button className="text-button w-full text-xs text-zinc-400" onClick={close}>
          {tGet(t, 'close', '完成')}
        </button>
      </motion.div>
    </motion.div>
  )
}

import { useState } from 'react'
import { Heart, Plus, X } from 'lucide-react'
import { tGet } from './utils/i18n'

const TOKENS = ['{MALE}', '{FEMALE_1}', '{FEMALE_2}', '{ITEM}', '{DRINKABLE}', '{EATABLE}']

export default function SettingsModal({
  t,
  players,
  setPlayers,
  playerMode,
  setPlayerMode,
  items,
  setItems,
  customTasks,
  setCustomTasks,
  close,
  template,
  downloadJson
}) {
  const [tab, setTab] = useState('general')
  const [category, setCategory] = useState('trio')
  const [drafts, setDrafts] = useState({ EATABLE: '', DRINKABLE: '', ITEM: '' })
  const [backup, setBackup] = useState('')
  const [url, setUrl] = useState('')

  const categories = [
    ['trio', tGet(t, 'task_cat_trio', '三人协同/3P极乐')],
    ['action', tGet(t, 'task_cat_action', '动作卡')],
    ['drinkable', tGet(t, 'task_cat_drinkable', '饮品卡')],
    ['eatable', tGet(t, 'task_cat_eatable', '食品卡')],
    ['item', tGet(t, 'task_cat_item', '道具卡')]
  ]

  const setName = (id, nickname) =>
    setPlayers((old) =>
      old.map((player) => (player.id === id ? { ...player, nickname, name: nickname } : player))
    )

  const addItem = (key) => {
    const value = drafts[key].trim()
    if (value)
      setItems((old) => ({
        ...old,
        [key]: old[key].includes(value) ? old[key] : [...old[key], value]
      }))
    setDrafts((old) => ({ ...old, [key]: '' }))
  }

  const updateTask = (index, field, value) =>
    setCustomTasks((old) => ({
      ...old,
      [category]: old[category].map((task, i) =>
        i === index
          ? {
              ...task,
              [field]: field === 'level' || field === 'duration' ? Number(value) : value
            }
          : task
      )
    }))

  const addTask = () =>
    setCustomTasks((old) => ({
      ...old,
      [category]: [
        ...old[category],
        { id: `custom-${category}-${Date.now()}`, text: '', duration: 30, level: 1 }
      ]
    }))

  const removeTask = (index) =>
    setCustomTasks((old) => ({
      ...old,
      [category]: old[category].filter((_, i) => i !== index)
    }))

  const exportAll = () =>
    downloadJson(
      {
        version: '1.0',
        settings: {
          gameMode: playerMode === 3 ? 'trio' : 'duo',
          nicknames: Object.fromEntries(players.map((player) => [player.id, player.nickname]))
        },
        items: { item: items.ITEM, drinkable: items.DRINKABLE, eatable: items.EATABLE },
        tasks: customTasks
      },
      'cp-game-config.json'
    )

  const applyConfig = (config) => {
    if (!config || typeof config !== 'object') throw new Error('invalid')
    const names = config.settings?.nicknames || {}
    setPlayers((old) =>
      old.map((player) => ({
        ...player,
        nickname: names[player.id] ?? player.nickname,
        name: names[player.id] ?? player.name
      }))
    )
    const sourceItems = config.items || {}
    setItems({
      ITEM: sourceItems.item || sourceItems.ITEM || [],
      DRINKABLE: sourceItems.drinkable || sourceItems.DRINKABLE || [],
      EATABLE: sourceItems.eatable || sourceItems.EATABLE || []
    })
    setCustomTasks((old) => ({
      ...old,
      ...Object.fromEntries(
        categories.map(([key]) => [
          key,
          Array.isArray(config.tasks?.[key]) ? config.tasks[key] : old[key]
        ])
      )
    }))
  }

  const importText = () => {
    try {
      applyConfig(JSON.parse(backup))
      setBackup('')
    } catch {
      window.alert('配置 JSON 格式无效。')
    }
  }

  const importFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setBackup(String(reader.result || ''))
      try {
        applyConfig(JSON.parse(String(reader.result || '')))
      } catch {
        window.alert('配置 JSON 格式无效。')
      }
    }
    reader.readAsText(file)
  }

  const importUrl = async () => {
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error()
      applyConfig(await response.json())
    } catch {
      window.alert('链接导入失败，请确认 HTTPS 地址。')
    }
  }

  return (
    <div className="overlay">
      <div className="modal setup task-settings">
        <button className="close" onClick={close}>
          <X />
        </button>
        <Heart fill="currentColor" className="setup-heart" />
        <div className="setup-tabs">
          <button className={tab === 'general' ? 'picked' : ''} onClick={() => setTab('general')}>
            {tGet(t, 'tab_general', '基础与道具')}
          </button>
          <button className={tab === 'tasks' ? 'picked' : ''} onClick={() => setTab('tasks')}>
            {tGet(t, 'tab_tasks', '任务库管理')}
          </button>
          <button className={tab === 'backup' ? 'picked' : ''} onClick={() => setTab('backup')}>
            {tGet(t, 'tab_backup', '备份与导入导出')}
          </button>
        </div>

        {tab === 'general' && (
          <>
            <h2>{tGet(t, 'choose', '开始前，请选择你们的角色')}</h2>
            <div className="player-mode">
              <button className={playerMode === 2 ? 'picked' : ''} onClick={() => setPlayerMode(2)}>
                {tGet(t, 'mode_duo', '二人模式')}
              </button>
              <button className={playerMode === 3 ? 'picked' : ''} onClick={() => setPlayerMode(3)}>
                {tGet(t, 'mode_trio', '三人模式')}
              </button>
            </div>
            <div className="nickname-setup">
              {players.slice(0, playerMode).map((player) => (
                <label key={player.id}>
                  {player.symbol} {tGet(t, 'nickname', '昵称')}
                  <input
                    value={player.nickname}
                    onChange={(event) => setName(player.id, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className="item-setup">
              <small>{tGet(t, 'itemSetup', '可选道具')}</small>
              {Object.keys(items).map((key) => (
                <div className="tag-field" key={key}>
                  <label>{tGet(t, key.toLowerCase(), key)}</label>
                  <input
                    value={drafts[key]}
                    onChange={(event) =>
                      setDrafts((old) => ({ ...old, [key]: event.target.value }))
                    }
                  />
                  <button onClick={() => addItem(key)}>
                    <Plus size={14} />
                  </button>
                  <div className="chosen-tags">
                    {items[key].map((value) => (
                      <button
                        key={value}
                        onClick={() =>
                          setItems((old) => ({
                            ...old,
                            [key]: old[key].filter((item) => item !== value)
                          }))
                        }
                      >
                        {value} ×
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'tasks' && (
          <>
            <h2>{tGet(t, 'tab_tasks', '任务库管理')}</h2>
            <div className="task-category-tabs">
              {categories.map(([id, label]) => (
                <button
                  key={id}
                  className={category === id ? 'picked' : ''}
                  onClick={() => setCategory(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="custom-task-list">
              {customTasks[category].map((task, index) => (
                <div className="custom-task" key={task.id || index}>
                  <textarea
                    value={
                      typeof task.text === 'object'
                        ? task.text.zh || task.text.en || task.text.th || ''
                        : task.text || ''
                    }
                    onChange={(event) => updateTask(index, 'text', event.target.value)}
                  />
                  <div>
                    <select
                      value={task.level}
                      onChange={(event) => updateTask(index, 'level', event.target.value)}
                    >
                      <option value={1}>{tGet(t, 'level_1_tag', 'Level 1 (阶段一微醺)')}</option>
                      <option value={2}>{tGet(t, 'level_2_tag', 'Level 2 (阶段二前戏)')}</option>
                      <option value={3}>{tGet(t, 'level_3_tag', 'Level 3 (阶段二深层)')}</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={task.duration}
                      onChange={(event) => updateTask(index, 'duration', event.target.value)}
                    />
                    <button onClick={() => removeTask(index)}>
                      {tGet(t, 'delete', '删除')}
                    </button>
                  </div>
                  <div className="token-row">
                    {TOKENS.map((token) => (
                      <button
                        key={token}
                        onClick={() =>
                          updateTask(
                            index,
                            'text',
                            `${typeof task.text === 'string' ? task.text : ''}${token}`
                          )
                        }
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="primary" onClick={addTask}>
              {tGet(t, 'add_task', '+ 新增一条任务')}
            </button>
          </>
        )}

        {tab === 'backup' && (
          <>
            <div className="template-guide-card">
              <h2>{tGet(t, 'tpl_title', '标准配置模板与 3P 规范')}</h2>
              <p>{tGet(t, 'tpl_desc', '下载包含 3P 协同、微醺破冰与深层前戏配置的完整 JSON 模板。')}</p>
              <button
                className="primary"
                onClick={() => downloadJson(template, 'cp_game_template.json')}
              >
                {tGet(t, 'download_tpl', '📄 下载标准配置模板 (.json)')}
              </button>
            </div>
            <h2>{tGet(t, 'tab_backup', '备份与导入导出')}</h2>
            <button className="primary" onClick={exportAll}>
              {tGet(t, 'backup_export', '全量导出配置')}
            </button>
            <label className="file-import">
              {tGet(t, 'file_import', '本地 JSON 文件')}
              <input type="file" accept="application/json" onChange={importFile} />
            </label>
            <div className="link-import">
              <input
                value={url}
                placeholder="HTTPS JSON 链接"
                onChange={(event) => setUrl(event.target.value)}
              />
              <button onClick={importUrl}>{tGet(t, 'link_import', '链接导入')}</button>
            </div>
            <textarea
              className="json-import"
              value={backup}
              onChange={(event) => setBackup(event.target.value)}
              placeholder="粘贴完整配置 JSON"
            />
            <button className="import-button" onClick={importText}>
              {tGet(t, 'import_btn', '导入粘贴配置')}
            </button>
          </>
        )}

        <button className="text-button" onClick={close}>
          {tGet(t, 'ready', '开始冒险')}
        </button>
      </div>
    </div>
  )
}

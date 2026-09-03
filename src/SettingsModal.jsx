import { useState } from 'react'
import { Heart, Plus, X } from 'lucide-react'

const CATEGORIES = [['trio','三人协同'],['action','动作卡'],['drinkable','饮品卡'],['eatable','食品卡'],['item','道具卡']]
const TOKENS = ['{MALE}','{FEMALE_1}','{FEMALE_2}','{ITEM}','{DRINKABLE}','{EATABLE}']

export default function SettingsModal({ t, players, setPlayers, playerMode, setPlayerMode, items, setItems, customTasks, setCustomTasks, close, template, downloadJson }) {
  const [tab, setTab] = useState('general')
  const [category, setCategory] = useState('trio')
  const [drafts, setDrafts] = useState({ EATABLE:'', DRINKABLE:'', ITEM:'' })
  const [backup, setBackup] = useState('')
  const [url, setUrl] = useState('')
  const setName = (id, nickname) => setPlayers(old => old.map(player => player.id === id ? { ...player, nickname, name:nickname } : player))
  const addItem = key => {
    const value = drafts[key].trim()
    if (value) setItems(old => ({ ...old, [key]: old[key].includes(value) ? old[key] : [...old[key], value] }))
    setDrafts(old => ({ ...old, [key]: '' }))
  }
  const updateTask = (index, field, value) => setCustomTasks(old => ({ ...old, [category]: old[category].map((task, i) => i === index ? { ...task, [field]: field === 'level' || field === 'duration' ? Number(value) : value } : task) }))
  const addTask = () => setCustomTasks(old => ({ ...old, [category]: [...old[category], { id:`custom-${category}-${Date.now()}`, text:'', duration:30, level:1 }] }))
  const removeTask = index => setCustomTasks(old => ({ ...old, [category]: old[category].filter((_, i) => i !== index) }))
  const exportAll = () => downloadJson({ version:'1.0', settings:{ gameMode:playerMode===3?'trio':'duo', nicknames:Object.fromEntries(players.map(player => [player.id, player.nickname])) }, items:{ item:items.ITEM, drinkable:items.DRINKABLE, eatable:items.EATABLE }, tasks:customTasks }, 'cp-game-config.json')
  const applyConfig = config => {
    if (!config || typeof config !== 'object') throw new Error('invalid')
    const names = config.settings?.nicknames || {}
    setPlayers(old => old.map(player => ({ ...player, nickname:names[player.id] ?? player.nickname, name:names[player.id] ?? player.name })))
    const sourceItems = config.items || {}
    setItems({ ITEM:sourceItems.item || [], DRINKABLE:sourceItems.drinkable || [], EATABLE:sourceItems.eatable || [] })
    setCustomTasks(old => ({ ...old, ...Object.fromEntries(CATEGORIES.map(([key]) => [key, Array.isArray(config.tasks?.[key]) ? config.tasks[key] : old[key]])) }))
  }
  const importText = () => { try { applyConfig(JSON.parse(backup)); setBackup('') } catch { window.alert('配置 JSON 格式无效。') } }
  const importFile = event => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { setBackup(String(reader.result || '')); try { applyConfig(JSON.parse(String(reader.result || ''))) } catch { window.alert('配置 JSON 格式无效。') } }; reader.readAsText(file) }
  const importUrl = async () => { try { const response = await fetch(url); if (!response.ok) throw new Error(); applyConfig(await response.json()) } catch { window.alert('链接导入失败，请确认 HTTPS 地址。') } }
  return <div className="overlay"><div className="modal setup task-settings"><button className="close" onClick={close}><X /></button><Heart fill="currentColor" className="setup-heart" />
    <div className="setup-tabs"><button className={tab==='general'?'picked':''} onClick={() => setTab('general')}>基础与道具</button><button className={tab==='tasks'?'picked':''} onClick={() => setTab('tasks')}>任务库管理</button><button className={tab==='backup'?'picked':''} onClick={() => setTab('backup')}>备份与导入导出</button></div>
    {tab === 'general' && <><h2>{t.choose}</h2><div className="player-mode"><button className={playerMode===2?'picked':''} onClick={() => setPlayerMode(2)}>二人模式</button><button className={playerMode===3?'picked':''} onClick={() => setPlayerMode(3)}>三人模式</button></div><div className="nickname-setup">{players.slice(0,playerMode).map(player => <label key={player.id}>{player.symbol} 昵称<input value={player.nickname} onChange={event => setName(player.id,event.target.value)} /></label>)}</div><div className="item-setup"><small>{t.itemSetup}</small>{Object.keys(items).map(key => <div className="tag-field" key={key}><label>{t[key.toLowerCase()]}</label><input value={drafts[key]} onChange={event => setDrafts(old => ({...old,[key]:event.target.value}))} /><button onClick={() => addItem(key)}><Plus size={14}/></button><div className="chosen-tags">{items[key].map(value => <button key={value} onClick={() => setItems(old => ({...old,[key]:old[key].filter(item => item !== value)}))}>{value} ×</button>)}</div></div>)}</div></>}
    {tab === 'tasks' && <><h2>任务库管理</h2><div className="task-category-tabs">{CATEGORIES.map(([id,label]) => <button key={id} className={category===id?'picked':''} onClick={() => setCategory(id)}>{label}</button>)}</div><div className="custom-task-list">{customTasks[category].map((task,index) => <div className="custom-task" key={task.id || index}><textarea value={typeof task.text === 'object' ? task.text.zh || task.text.en || task.text.th || '' : task.text || ''} onChange={event => updateTask(index,'text',event.target.value)} /><div><select value={task.level} onChange={event => updateTask(index,'level',event.target.value)}>{[1,2,3].map(level => <option key={level} value={level}>Level {level}</option>)}</select><input type="number" min="0" value={task.duration} onChange={event => updateTask(index,'duration',event.target.value)} /><button onClick={() => removeTask(index)}>删除</button></div><div className="token-row">{TOKENS.map(token => <button key={token} onClick={() => updateTask(index,'text',`${typeof task.text === 'string' ? task.text : ''}${token}`)}>{token}</button>)}</div></div>)}</div><button className="primary" onClick={addTask}>+ 新增一条任务</button></>}
    {tab === 'backup' && <><div className="template-guide-card"><h2>标准配置模板与编写规范</h2><p>下载包含中 / 英 / 泰多语言示例的完整 JSON 模板，可直接修改后重新导入。</p><button className="primary" onClick={() => downloadJson(template,'cp_game_template.json')}>📄 下载标准配置模板 (.json)</button><div className="template-help"><b>角色</b> {TOKENS.slice(0,3).join(' ')}<br/><b>道具</b> {TOKENS.slice(3).join(' ')}<br/><b>多语言</b> text 支持字符串或 {'{ zh, en, th }'} 对象</div></div><h2>备份与导入导出</h2><button className="primary" onClick={exportAll}>全量导出配置</button><label className="file-import">本地 JSON 文件<input type="file" accept="application/json" onChange={importFile}/></label><div className="link-import"><input value={url} placeholder="HTTPS JSON 链接" onChange={event => setUrl(event.target.value)} /><button onClick={importUrl}>链接导入</button></div><textarea className="json-import" value={backup} onChange={event => setBackup(event.target.value)} placeholder="粘贴完整配置 JSON" /><button className="import-button" onClick={importText}>导入粘贴配置</button></>}
    <button className="text-button" onClick={close}>{t.ready}</button>
  </div></div>
}

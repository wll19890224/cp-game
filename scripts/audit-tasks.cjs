const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '../public/locales')
const categories = ['action', 'eatable', 'drinkable', 'item']
const identityPattern = /男奴|女主|主人|奴隶/g
const opposite = gender => gender === 'male' ? 'female' : 'male'
const roleName = gender => gender === 'male' ? '男方' : '女方'

function resolvePerspectiveText(text = '', playerGender) {
  const self = roleName(playerGender)
  const target = roleName(opposite(playerGender))
  const identities = []
  let output = text.replace(identityPattern, term => {
    identities.push(term)
    return `__IDENTITY_${identities.length - 1}__`
  })
  const selfTerms = playerGender === 'male' ? /(男方|男性|男|Male|male)/g : /(女方|女性|女|Female|female)/g
  const targetTerms = playerGender === 'male' ? /(女方|女性|女|Female|female)/g : /(男方|男性|男|Male|male)/g
  output = output.replace(selfTerms, '__SELF__').replace(targetTerms, '__TARGET__')
  output = output
    .replace(/\b(he|him|his)\b/gi, playerGender === 'male' ? '__SELF__' : '__TARGET__')
    .replace(/\b(she|her|hers)\b/gi, playerGender === 'female' ? '__SELF__' : '__TARGET__')
    .replaceAll('__SELF__', self)
    .replaceAll('__TARGET__', target)
  return identities.reduce((value, identity, index) => value.replaceAll(`__IDENTITY_${index}__`, identity), output)
}

function auditCard(card, sourceGender, language, category) {
  const rendered = Object.fromEntries(['male', 'female'].map(gender => [gender, resolvePerspectiveText(card.text, gender)]))
  const issues = []
  const expected = resolvePerspectiveText(card.text, sourceGender)
  const hasRoleMarker = /(男方|女性|男性|女方|\bMale\b|\bFemale\b)/i.test(card.text)
  if (hasRoleMarker && !expected.includes(roleName(sourceGender))) issues.push('执行者未能解析为当前玩家')
  for (const [gender, text] of Object.entries(rendered)) {
    if (/\b(Male|Female|he|him|his|she|her|hers)\b/i.test(text)) issues.push(`${gender} 视角存在未替换的英文性别词`)
    const originalIdentity = (card.text.match(identityPattern) || []).join('|')
    const renderedIdentity = (text.match(identityPattern) || []).join('|')
    if (originalIdentity !== renderedIdentity) issues.push(`${gender} 视角修改了受保护身份词`)
  }
  return { id: card.id, language, category, sourceGender, passed: issues.length === 0, issues, rendered }
}

const results = []
for (const language of fs.readdirSync(root)) {
  for (const sourceGender of ['male', 'female']) {
    for (const category of categories) {
      const file = path.join(root, language, sourceGender, `${category}.json`)
      if (!fs.existsSync(file)) continue
      for (const card of JSON.parse(fs.readFileSync(file, 'utf8'))) results.push(auditCard(card, sourceGender, language, category))
    }
  }
}

const failures = results.filter(result => !result.passed)
const report = { generatedAt: new Date().toISOString(), total: results.length, passed: results.length - failures.length, failed: failures.length, failures }
fs.writeFileSync(path.join(__dirname, 'task-audit-report.json'), JSON.stringify(report, null, 2))
console.table([{ total: report.total, passed: report.passed, failed: report.failed }])
if (failures.length) console.table(failures.map(item => ({ id: item.id, language: item.language, category: item.category, issue: item.issues.join('; ') })))
process.exitCode = failures.length ? 1 : 0

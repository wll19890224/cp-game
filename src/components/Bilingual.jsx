import { tGet } from '../utils/i18n.js'

export function Bilingual({
  k,
  fallback = '',
  tPrimary,
  tSecondary,
  className = '',
  subClassName = 'text-[0.72em] opacity-75 font-normal block leading-tight mt-0.5'
}) {
  const primaryText = tGet(tPrimary, k, fallback)
  const secondaryText = tSecondary ? tGet(tSecondary, k, '') : ''

  const primaryTrimmed = String(primaryText || '').trim()
  const secondaryTrimmed = String(secondaryText || '').trim()

  const showSub = Boolean(
    secondaryTrimmed && secondaryTrimmed !== primaryTrimmed
  )

  return (
    <span className={`inline-flex flex-col items-center justify-center text-center leading-tight ${className}`}>
      <span className="block">{primaryTrimmed}</span>
      {showSub && <span className={`${subClassName}`}>{secondaryTrimmed}</span>}
    </span>
  )
}

export default Bilingual

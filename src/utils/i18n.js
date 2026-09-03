import zhCommon from '../locales/zh/common.json'

export const tGet = (tObj, key, fallback = '') => tObj?.[key] ?? zhCommon[key] ?? fallback

export const getBilingualString = (tPrimary, tSecondary, key, fallback = '', separator = ' / ') => {
  const primaryText = tGet(tPrimary, key, fallback)
  const secondaryText = tSecondary ? tGet(tSecondary, key, '') : ''
  if (secondaryText && secondaryText !== primaryText) {
    return `${primaryText}${separator}${secondaryText}`
  }
  return primaryText
}

export const utcDate = (date) => {
  const split = date.split('-')

  if (split.length !== 3) return null

  const year = parseInt(split[0])
  const month = parseInt(split[1]) - 1
  const day = parseInt(split[2])

  return new Date(Date.UTC(year, month, day))
}

export const utcNow = () => {
  const now = new Date()
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
}

export const stringDate = (date) => {
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`
}

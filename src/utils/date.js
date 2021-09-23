export const convertFromUTC = (date) => {
  const split = date.split('-')

  if (split.length !== 3) return null

  const year = parseInt(split[0])
  const month = parseInt(split[1]) - 1
  const day = parseInt(split[2])

  return new Date(Date.UTC(year, month, day))
}

export const convertDateToUTCString = (date) => {
  const newDate = new Date(date)
  return `${newDate.getUTCFullYear()}-${
    newDate.getUTCMonth() + 1
  }-${newDate.getUTCDate()}`
}

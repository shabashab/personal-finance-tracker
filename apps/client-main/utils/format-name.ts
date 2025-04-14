export const formatName = (name: string) => {
  if (!name) return ' '

  const nameWithUpperCase = `${name.charAt(0).toUpperCase()}${name.slice(1)}`

  const splitedName = nameWithUpperCase.split('_')
  return splitedName.join(' ')
}

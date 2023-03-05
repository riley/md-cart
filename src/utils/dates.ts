export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const shortDate = (date: Date) => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const shortDate = (d: Date) => {
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

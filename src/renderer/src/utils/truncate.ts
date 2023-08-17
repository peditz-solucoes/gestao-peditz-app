export function truncateText(text: string, limit: number, simbol: string = '...') {
  if (text.length <= limit) {
    return text
  } else {
    return text.substring(0, limit) + simbol
  }
}

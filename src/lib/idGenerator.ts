// Generate stable IDs for client-server consistency
export function generateStableId(input: string): string {
  // Simple hash function for stable ID generation
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

export function generateResumeId(fileName: string, content: string): string {
  const combined = `${fileName}_${content.substring(0, 100)}`
  return `resume_${generateStableId(combined)}`
}

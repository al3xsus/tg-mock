export function formatChatId(rawInput: string): string {
  return rawInput.trim().replace(/[^\d-]/g, '');
}
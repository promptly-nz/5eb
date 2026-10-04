import { blip } from './audio.svelte'

export const toast = $state({ open: false, head: '', body: '' })

let timer: ReturnType<typeof setTimeout>

export function showToast(head: string, body: string) {
  toast.head = head
  toast.body = body
  toast.open = true
  blip(1200, 0.08)
  setTimeout(() => blip(900, 0.08), 110)
  clearTimeout(timer)
  timer = setTimeout(() => (toast.open = false), 6500)
}

export function dismissToast() {
  toast.open = false
}

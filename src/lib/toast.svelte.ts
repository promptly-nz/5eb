import { blip } from './audio.svelte'

export interface ToastAction { label: string; run: () => void }

export const toast = $state<{ open: boolean; head: string; body: string; action?: ToastAction }>({ open: false, head: '', body: '' })

let timer: ReturnType<typeof setTimeout>

/** `action` adds a button next to OK, e.g. to jump somewhere on the page. */
export function showToast(head: string, body: string, action?: ToastAction) {
  toast.head = head
  toast.body = body
  toast.action = action
  toast.open = true
  blip(1200, 0.08)
  setTimeout(() => blip(900, 0.08), 110)
  clearTimeout(timer)
  timer = setTimeout(() => (toast.open = false), 6500)
}

export function dismissToast() {
  toast.open = false
}

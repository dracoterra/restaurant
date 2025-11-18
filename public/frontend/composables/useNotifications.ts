import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

/**
 * Composable para notificaciones toast
 * Sistema de notificaciones global
 */
export function useNotifications() {
  const notifications = ref<Notification[]>([])

  const add = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }

    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    return id
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    return add({ type: 'success', message, duration })
  }

  const error = (message: string, duration?: number) => {
    return add({ type: 'error', message, duration: duration || 7000 })
  }

  const warning = (message: string, duration?: number) => {
    return add({ type: 'warning', message, duration })
  }

  const info = (message: string, duration?: number) => {
    return add({ type: 'info', message, duration })
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    warning,
    info,
    clear
  }
}


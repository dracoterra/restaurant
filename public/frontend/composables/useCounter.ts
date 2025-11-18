import { ref, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Composable para contadores animados
 * Reemplaza jquery.counterup
 */
export function useCounter(
  target: number,
  duration: number = 2000,
  element?: HTMLElement | null
) {
  const count = ref(0)
  const isAnimating = ref(false)

  const animate = (from: number, to: number, duration: number) => {
    if (isAnimating.value) return
    
    isAnimating.value = true
    const startTime = performance.now()
    const difference = to - from

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      count.value = Math.floor(from + difference * easeOut)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        count.value = to
        isAnimating.value = false
      }
    }

    requestAnimationFrame(step)
  }

  // Si hay un elemento, observar cuando entra en viewport
  if (element && process.client) {
    const { stop } = useIntersectionObserver(
      element,
      ([{ isIntersecting }]) => {
        if (isIntersecting && !isAnimating.value) {
          animate(0, target, duration)
          stop()
        }
      },
      {
        threshold: 0.5
      }
    )
  } else {
    // Si no hay elemento, animar inmediatamente
    if (process.client) {
      animate(0, target, duration)
    }
  }

  return {
    count,
    isAnimating
  }
}


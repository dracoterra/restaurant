import { onMounted, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

/**
 * Composable para animaciones usando Intersection Observer
 * Reemplaza WOW.js y jQuery waypoints
 */
export function useAnimations() {
  const animateOnScroll = (element: HTMLElement, animationClass: string = 'wow fadeInUp') => {
    const { stop } = useIntersectionObserver(
      element,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          element.classList.add(animationClass)
          stop()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    )
  }

  const initAnimations = () => {
    if (process.client) {
      const elements = document.querySelectorAll('[data-animate]')
      elements.forEach((el) => {
        const animationClass = (el as HTMLElement).dataset.animate || 'wow fadeInUp'
        animateOnScroll(el as HTMLElement, animationClass)
      })
    }
  }

  return {
    animateOnScroll,
    initAnimations
  }
}


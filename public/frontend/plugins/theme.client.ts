export default defineNuxtPlugin({
  name: 'theme',
  enforce: 'post',
  async setup() {
    if (process.client) {
      // Esperar a que los scripts estén cargados (con timeout máximo)
      await new Promise<void>((resolve) => {
        let attempts = 0
        const maxAttempts = 50 // 5 segundos máximo
        
        const checkScripts = () => {
          attempts++
          if (
            typeof window !== 'undefined' &&
            (window as any).jQuery
          ) {
            resolve()
          } else if (attempts >= maxAttempts) {
            // Continuar aunque jQuery no esté disponible
            resolve()
          } else {
            setTimeout(checkScripts, 100)
          }
        }
        checkScripts()
      })

      // Inicializar scripts del tema después de que la página esté lista
      const initThemeScripts = () => {
        if (typeof window === 'undefined') return
        
        const $ = (window as any).jQuery
        if (!$) return

        // WOW.js para animaciones
        if ((window as any).WOW) {
          try {
            new (window as any).WOW().init()
          } catch (e) {
            console.warn('Error inicializando WOW.js:', e)
          }
        }

        // Inicializar SlickNav para menú móvil
        if ($.fn.slicknav) {
          setTimeout(() => {
            const menu = document.getElementById('menu')
            if (menu && !menu.classList.contains('slicknav-processed')) {
              try {
                $('#menu').slicknav({
                  label: '',
                  prependTo: '.responsive-menu'
                })
              } catch (e) {
                console.warn('Error inicializando SlickNav:', e)
              }
            }
          }, 500)
        }

        // Inicializar contadores
        if ($.fn.counterUp) {
          setTimeout(() => {
            try {
              $('.counter').counterUp({
                delay: 6,
                time: 3000
              })
            } catch (e) {
              console.warn('Error inicializando counterUp:', e)
            }
          }, 1000)
        }

        // Inicializar parallaxie
        if ($.fn.parallaxie) {
          setTimeout(() => {
            try {
              const $parallaxie = $('.parallaxie')
              if ($parallaxie.length && window.innerWidth > 991) {
                $parallaxie.parallaxie({
                  speed: 0.55,
                  offset: 0
                })
              }
            } catch (e) {
              console.warn('Error inicializando parallaxie:', e)
            }
          }, 500)
        }

        // Inicializar magnific popup para videos
        if ($.fn.magnificPopup) {
          setTimeout(() => {
            try {
              $('.popup-video').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,
                fixedContentPos: true
              })
            } catch (e) {
              console.warn('Error inicializando magnificPopup:', e)
            }
          }, 500)
        }
      }

      // Inicializar cuando el DOM esté listo
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeScripts)
      } else {
        initThemeScripts()
      }

      // También inicializar cuando la ventana cargue completamente
      window.addEventListener('load', initThemeScripts)
    }
  }
})


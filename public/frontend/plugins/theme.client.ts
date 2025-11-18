export default defineNuxtPlugin({
  name: 'theme',
  enforce: 'post',
  async setup() {
    if (process.client) {
      // Esperar a que los scripts estén cargados
      await new Promise<void>((resolve) => {
        const checkScripts = () => {
          if (
            typeof window !== 'undefined' &&
            (window as any).jQuery &&
            (window as any).WOW &&
            (window as any).Swiper
          ) {
            resolve()
          } else {
            setTimeout(checkScripts, 100)
          }
        }
        checkScripts()
      })

      // Inicializar scripts del tema
      if (typeof window !== 'undefined') {
        const $ = (window as any).jQuery

        // WOW.js para animaciones
        if ((window as any).WOW) {
          new (window as any).WOW().init()
        }

        // Inicializar SlickNav para menú móvil
        if ($ && $.fn.slicknav) {
          setTimeout(() => {
            const menu = document.getElementById('menu')
            if (menu && !menu.classList.contains('slicknav-processed')) {
              $('#menu').slicknav({
                label: '',
                prependTo: '.responsive-menu'
              })
            }
          }, 500)
        }

        // Inicializar contadores
        if ($ && $.fn.counterUp) {
          setTimeout(() => {
            $('.counter').counterUp({
              delay: 6,
              time: 3000
            })
          }, 1000)
        }

        // Inicializar parallaxie
        if ($ && $.fn.parallaxie) {
          setTimeout(() => {
            const $parallaxie = $('.parallaxie')
            if ($parallaxie.length && window.innerWidth > 991) {
              $parallaxie.parallaxie({
                speed: 0.55,
                offset: 0
              })
            }
          }, 500)
        }

        // Inicializar magnific popup para videos
        if ($ && $.fn.magnificPopup) {
          setTimeout(() => {
            $('.popup-video').magnificPopup({
              type: 'iframe',
              mainClass: 'mfp-fade',
              removalDelay: 160,
              preloader: false,
              fixedContentPos: true
            })
          }, 500)
        }
      }
    }
  }
})


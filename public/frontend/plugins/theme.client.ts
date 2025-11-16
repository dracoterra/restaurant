export default defineNuxtPlugin(() => {
  if (process.client) {
    // Cargar scripts del tema cuando esté disponible
    // Los scripts se cargarán desde public/js/
    return {
      provide: {
        initTheme: () => {
          // Inicializar scripts del tema
          if (typeof window !== 'undefined') {
            // WOW.js para animaciones
            if ((window as any).WOW) {
              new (window as any).WOW().init()
            }

            // Inicializar otros scripts del tema
            // Los scripts se cargarán desde el app.html o como módulos
          }
        }
      }
    }
  }
})


/**
 * Composable para debugging de campos ACF
 * Proporciona herramientas profesionales para verificar la llegada de datos ACF
 */

export interface AcfDebugInfo {
  hasAcf: boolean
  acfKeys: string[]
  sections: Record<string, any>
  missingFields: string[]
  fieldCount: number
  isEmpty: boolean
}

export function useAcfDebug() {
  /**
   * Analizar campos ACF de una página
   */
  const analyzeAcf = (page: any, expectedSections: string[] = []): AcfDebugInfo => {
    const info: AcfDebugInfo = {
      hasAcf: false,
      acfKeys: [],
      sections: {},
      missingFields: [],
      fieldCount: 0,
      isEmpty: true
    }

    if (!page) {
      return info
    }

    // Verificar si existe ACF
    if (!page.acf || typeof page.acf !== 'object') {
      info.missingFields.push('acf (objeto completo)')
      return info
    }

    info.hasAcf = true
    info.acfKeys = Object.keys(page.acf)

    // Analizar cada sección
    for (const sectionKey of expectedSections) {
      if (page.acf[sectionKey]) {
        info.sections[sectionKey] = {
          exists: true,
          keys: Object.keys(page.acf[sectionKey]),
          isEmpty: Object.keys(page.acf[sectionKey]).length === 0,
          sample: getSampleData(page.acf[sectionKey])
        }
      } else {
        info.sections[sectionKey] = {
          exists: false,
          keys: [],
          isEmpty: true,
          sample: null
        }
        info.missingFields.push(`acf.${sectionKey}`)
      }
    }

    // Contar campos totales
    info.fieldCount = countFields(page.acf)
    info.isEmpty = info.fieldCount === 0

    return info
  }

  /**
   * Contar campos en un objeto recursivamente
   */
  const countFields = (obj: any, depth: number = 0): number => {
    if (depth > 5) return 0 // Prevenir loops infinitos
    
    if (obj === null || obj === undefined) return 0
    if (typeof obj !== 'object') return 1
    if (Array.isArray(obj)) {
      return obj.reduce((sum, item) => sum + countFields(item, depth + 1), 0)
    }

    return Object.values(obj).reduce((sum, value) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return sum + countFields(value, depth + 1)
      }
      return sum + (value !== null && value !== undefined ? 1 : 0)
    }, 0)
  }

  /**
   * Obtener muestra de datos (primeros valores)
   */
  const getSampleData = (obj: any, maxDepth: number = 2, currentDepth: number = 0): any => {
    if (currentDepth >= maxDepth) return '[max depth]'
    if (obj === null || obj === undefined) return null
    if (typeof obj !== 'object') return obj
    if (Array.isArray(obj)) {
      return obj.slice(0, 2).map(item => getSampleData(item, maxDepth, currentDepth + 1))
    }

    const sample: any = {}
    const keys = Object.keys(obj).slice(0, 5) // Primeros 5 campos
    for (const key of keys) {
      const value = obj[key]
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sample[key] = getSampleData(value, maxDepth, currentDepth + 1)
      } else if (Array.isArray(value)) {
        sample[key] = `[Array(${value.length})]`
      } else {
        sample[key] = value
      }
    }
    return sample
  }

  /**
   * Generar reporte de debugging
   */
  const generateReport = (page: any, pageType: 'home' | 'about' | 'contact' | 'services' = 'home'): string => {
    const expectedSections = {
      home: ['homePageSections'],
      about: ['aboutPageSections'],
      contact: ['contactPageSections'],
      services: ['servicesPageSections']
    }

    const sections = expectedSections[pageType] || []
    const info = analyzeAcf(page, sections)

    let report = `\n=== ACF DEBUG REPORT ===\n`
    report += `Page Type: ${pageType}\n`
    report += `Page Slug: ${page?.slug || 'N/A'}\n`
    report += `Page ID: ${page?.id || 'N/A'}\n`
    report += `\n--- ACF Status ---\n`
    report += `Has ACF: ${info.hasAcf ? '✅ YES' : '❌ NO'}\n`
    report += `ACF Keys: ${info.acfKeys.length > 0 ? info.acfKeys.join(', ') : 'None'}\n`
    report += `Field Count: ${info.fieldCount}\n`
    report += `Is Empty: ${info.isEmpty ? '⚠️ YES' : '✅ NO'}\n`

    if (sections.length > 0) {
      report += `\n--- Sections Analysis ---\n`
      for (const section of sections) {
        const sectionInfo = info.sections[section]
        report += `\n${section}:\n`
        report += `  Exists: ${sectionInfo.exists ? '✅ YES' : '❌ NO'}\n`
        if (sectionInfo.exists) {
          report += `  Keys: ${sectionInfo.keys.length > 0 ? sectionInfo.keys.join(', ') : 'None'}\n`
          report += `  Field Count: ${sectionInfo.keys.length}\n`
          if (sectionInfo.sample) {
            report += `  Sample Data: ${JSON.stringify(sectionInfo.sample, null, 2)}\n`
          }
        }
      }
    }

    if (info.missingFields.length > 0) {
      report += `\n--- Missing Fields ---\n`
      info.missingFields.forEach(field => {
        report += `  ❌ ${field}\n`
      })
    }

    report += `\n=== END REPORT ===\n`

    return report
  }

  /**
   * Log en consola con formato
   */
  const logAcfData = (page: any, pageType: 'home' | 'about' | 'contact' | 'services' | 'menu' = 'home') => {
    if (process.client) {
      const report = generateReport(page, pageType)
      console.group(`🔍 ACF Debug - ${pageType.toUpperCase()}`)
      // Solo loggear en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(report)
        console.log('Full Page Data:', page)
        console.log('ACF Data:', page?.acf)
      }
      console.groupEnd()
    }
  }

  /**
   * Verificar campos específicos
   */
  const checkFields = (page: any, fields: string[]): Record<string, boolean> => {
    const results: Record<string, boolean> = {}
    
    for (const fieldPath of fields) {
      const value = getNestedValue(page, fieldPath)
      results[fieldPath] = value !== null && value !== undefined && value !== ''
    }
    
    return results
  }

  /**
   * Obtener valor anidado de un objeto
   */
  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null
    }, obj)
  }

  return {
    analyzeAcf,
    generateReport,
    logAcfData,
    checkFields,
    getNestedValue
  }
}


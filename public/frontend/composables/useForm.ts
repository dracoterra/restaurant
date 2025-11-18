import { ref, reactive } from 'vue'
import { useApi } from './useApi'

export interface FormField {
  value: string
  error?: string
  required?: boolean
  validator?: (value: string) => string | null
}

export interface UseFormOptions {
  endpoint?: string
  method?: 'POST' | 'PUT' | 'PATCH'
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  validateOnSubmit?: boolean
}

/**
 * Composable reutilizable para formularios
 * Elimina código duplicado entre formularios
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  options: UseFormOptions = {}
) {
  const form = reactive<T>({ ...initialValues } as T)
  const errors = reactive<Partial<Record<keyof T, string>>>({})
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const submitMessage = ref('')

  const validateField = (field: keyof T, value: any): string | null => {
    const fieldConfig = (initialValues as any)[field]
    if (fieldConfig?.required && (!value || value.trim() === '')) {
      return 'Este campo es requerido'
    }
    if (fieldConfig?.validator) {
      return fieldConfig.validator(value)
    }
    return null
  }

  const validate = (): boolean => {
    let isValid = true
    Object.keys(form).forEach((key) => {
      const error = validateField(key as keyof T, form[key as keyof T])
      if (error) {
        errors[key as keyof T] = error
        isValid = false
      } else {
        delete errors[key as keyof T]
      }
    })
    return isValid
  }

  const reset = () => {
    Object.keys(initialValues).forEach((key) => {
      form[key as keyof T] = initialValues[key]
    })
    Object.keys(errors).forEach((key) => {
      delete errors[key as keyof T]
    })
    submitSuccess.value = false
    submitMessage.value = ''
  }

  const submit = async (customData?: Partial<T>) => {
    if (options.validateOnSubmit !== false && !validate()) {
      return false
    }

    isSubmitting.value = true
    submitMessage.value = ''
    submitSuccess.value = false

    try {
      const api = useApi()
      const dataToSend = customData || form

      let response
      if (options.endpoint) {
        if (options.method === 'PUT') {
          response = await api.put(options.endpoint, dataToSend)
        } else if (options.method === 'PATCH') {
          response = await api.post(options.endpoint, dataToSend) // FeathersJS usa POST para PATCH
        } else {
          response = await api.post(options.endpoint, dataToSend)
        }
      } else {
        // Si no hay endpoint, solo simular éxito (para desarrollo)
        response = { data: dataToSend }
      }

      submitSuccess.value = true
      submitMessage.value = 'Enviado exitosamente'
      
      if (options.onSuccess) {
        options.onSuccess(response.data)
      }

      return true
    } catch (error: any) {
      submitSuccess.value = false
      submitMessage.value = error.message || 'Error al enviar el formulario'
      
      if (options.onError) {
        options.onError(error)
      }

      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    submitSuccess,
    submitMessage,
    validate,
    reset,
    submit
  }
}


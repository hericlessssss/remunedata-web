import { watch } from 'vue'
import { useRoute } from 'vue-router'

export function useSeo(title: string, description?: string) {
  const baseTitle = 'RemuneData'
  const fullTitle = `${title} | ${baseTitle}`

  document.title = fullTitle

  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)
  }
}

// Alternativa: Hook que observa a rota (se preferir centralizar)
export function useAutoSeo() {
  const route = useRoute()

  watch(
    () => route.path,
    () => {
      const titleMap: Record<string, string> = {
        '/dashboard': 'Dashboard Analítico',
        '/remuneration': 'Consulta de Remunerações',
        '/executions': 'Histórico de Sincronização',
      }

      const title = titleMap[route.path] || 'Portal da Transparência'
      document.title = `${title} | RemuneData`
    },
    { immediate: true }
  )
}

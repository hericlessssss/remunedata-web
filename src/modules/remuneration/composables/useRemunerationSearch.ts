import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { RemunerationService, type SearchFilters } from '../services/remuneration.service'

export function useRemunerationSearch() {
  const route = useRoute()
  const router = useRouter()

  const filters = ref<SearchFilters>({
    nome: (route.query.nome as string) || '',
    cpf: (route.query.cpf as string) || '',
    ano: route.query.ano ? Number(route.query.ano) : 2025,
    mes: (route.query.mes as string) || '01',
    cargo: (route.query.cargo as string) || '',
    orgao: (route.query.orgao as string) || '',
    page: route.query.page ? Number(route.query.page) : 1,
    size: route.query.size ? Number(route.query.size) : 25,
  })

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['remuneration', 'search', filters],
    queryFn: () => RemunerationService.search(filters.value),
    placeholderData: (previousData) => previousData,
  })

  // Sincroniza filtros com a URL
  watch(
    filters,
    (newFilters) => {
      const query = { ...newFilters } as any
      // Remover campos vazios da URL
      Object.keys(query).forEach((key) => {
        if (!query[key]) delete query[key]
      })

      router.push({ query })
    },
    { deep: true },
  )

  const setPage = (page: number) => {
    filters.value.page = page
  }

  const clearFilters = () => {
    filters.value = {
      nome: '',
      cpf: '',
      ano: 2025,
      mes: '01',
      cargo: '',
      orgao: '',
      page: 1,
      size: 25,
    }
  }

  return {
    filters,
    data,
    isLoading,
    isError,
    error,
    setPage,
    clearFilters,
    refetch,
  }
}

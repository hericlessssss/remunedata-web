import { ref, watch } from 'vue'
import { useRoute, useRouter, type LocationQueryRaw } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { RemunerationService, type SearchFilters } from '../services/remuneration.service'

export function useRemunerationSearch() {
  const route = useRoute()
  const router = useRouter()

  const appliedFilters = ref<SearchFilters>({
    nome: (route.query.nome as string) || '',
    cpf: (route.query.cpf as string) || '',
    ano: route.query.ano ? Number(route.query.ano) : 2025,
    mes: (route.query.mes as string) || '01',
    cargo: (route.query.cargo as string) || '',
    orgao: (route.query.orgao as string) || '',
    page: route.query.page ? Number(route.query.page) : 1,
    size: route.query.size ? Number(route.query.size) : 25,
    ordering: (route.query.ordering as string) || '',
  })

  // Filtros locais para Edição (Vinculados aos inputs)
  const localFilters = ref<SearchFilters>({ ...appliedFilters.value })

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['remuneration', 'search', appliedFilters],
    queryFn: () => RemunerationService.search(appliedFilters.value),
    placeholderData: (previousData) => previousData,
  })

  // Sincroniza filtros ATIVOS com a URL
  watch(
    appliedFilters,
    (newFilters) => {
      const query = { ...newFilters } as LocationQueryRaw
      // Remover campos vazios da URL
      Object.keys(query).forEach((key) => {
        if (!query[key]) delete query[key]
      })

      router.push({ query })
    },
    { deep: true },
  )

  const applySearch = () => {
    appliedFilters.value = { 
      ...localFilters.value,
      page: 1 // Reinicia a página ao pesquisar
    }
  }

  const setOrdering = (key: string) => {
    let newOrdering = key
    
    // Toggle logic: key -> -key -> ""
    if (appliedFilters.value.ordering === key) {
      newOrdering = `-${key}`
    } else if (appliedFilters.value.ordering === `-${key}`) {
      newOrdering = ''
    }

    appliedFilters.value.ordering = newOrdering
    localFilters.value.ordering = newOrdering
    appliedFilters.value.page = 1 // Reset pagination
  }

  const setPage = (page: number) => {
    appliedFilters.value.page = page
    localFilters.value.page = page
  }

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      nome: '',
      cpf: '',
      ano: 2025,
      mes: '01',
      cargo: '',
      orgao: '',
      page: 1,
      size: 25,
      ordering: '',
    }
    localFilters.value = { ...defaultFilters }
    appliedFilters.value = { ...defaultFilters }
  }

  return {
    filters: localFilters, // O componente usa localFilters para binding
    appliedFilters,        // Para exportação e estados de controle
    data,
    isLoading,
    isFetching,
    isError,
    error,
    setPage,
    setOrdering,
    applySearch,
    clearFilters,
    refetch,
  }
}

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTable from './BaseTable.vue'

describe('BaseTable', () => {
  const headers = [
    { label: 'Nome', key: 'name' },
    { label: 'Idade', key: 'age' },
  ]
  const items = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ]

  it('renders headers correctly', () => {
    const wrapper = mount(BaseTable, {
      props: { headers, items, isLoading: false },
    })
    const ths = wrapper.findAll('th')
    expect(ths).toHaveLength(2)
    expect(ths[0].text()).toBe('Nome')
    expect(ths[1].text()).toBe('Idade')
  })

  it('renders items correctly', () => {
    const wrapper = mount(BaseTable, {
      props: { headers, items, isLoading: false },
    })
    const trs = wrapper.findAll('tbody tr')
    expect(trs).toHaveLength(2)
    expect(trs[0].text()).toContain('Alice')
    expect(trs[1].text()).toContain('Bob')
  })

  it('shows loading state', () => {
    const wrapper = mount(BaseTable, {
      props: { headers, items: [], isLoading: true },
    })
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('shows empty state when no items', () => {
    const wrapper = mount(BaseTable, {
      props: { headers, items: [], isLoading: false },
    })
    expect(wrapper.text()).toContain('Nenhum registro encontrado')
  })

  it('emits row-click when a row is clicked', async () => {
    const wrapper = mount(BaseTable, {
      props: { headers, items, isLoading: false },
    })
    await wrapper.find('tbody tr').trigger('click')
    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')?.[0]).toEqual([items[0]])
  })
})

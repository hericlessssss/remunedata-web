import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseCard from './BaseCard.vue'

describe('BaseCard', () => {
  it('renders title and value', () => {
    const title = 'Total Servidores'
    const value = '25.402'
    const wrapper = mount(BaseCard, {
      props: { title, value },
    })
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(value)
  })

  it('renders footer slot', () => {
    const wrapper = mount(BaseCard, {
      props: { title: 'Test', value: '123' },
      slots: {
        footer: '<span id="footer-item">Details</span>',
      },
    })
    expect(wrapper.find('#footer-item').exists()).toBe(true)
  })
})

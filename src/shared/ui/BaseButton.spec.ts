import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me',
      },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('applies primary styles by default', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.classes()).toContain('bg-slate-800')
  })
})

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import App from './App.vue'

describe('App Smoke Test', () => {
  it('should render the application title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('RemuneData')
  })
})

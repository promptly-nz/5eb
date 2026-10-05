import { mount } from 'svelte'
import '@fontsource/anton/latin-400.css'
import '@fontsource/permanent-marker/latin-400.css'
import '@fontsource/vt323/latin-400.css'
import '@fontsource/archivo-narrow/latin-500.css'
import '@fontsource/archivo-narrow/latin-700.css'
import './app.css'
import App from './App.svelte'

export default mount(App, { target: document.getElementById('app')! })

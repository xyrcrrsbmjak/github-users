import SearchPage from './scripts/search.js'
import { html } from './scripts/slowpoke.js'

import './style.css'

const app = html`<div class="container" id="app">${SearchPage}</div>`

document.body.appendChild(app)

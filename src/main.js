import SearchPage from './scripts/search.js'
import FavouritesPage from './scripts/favourites.js'
import UserPage from './scripts/user.js'
import { html } from './scripts/slowpoke.js'

import './style.css'

let page = null

switch (window.location.pathname.replace('/', '')) {
  case '':
    page = SearchPage
    break
  case 'favourites':
    page = FavouritesPage
    break
  default:
    page = UserPage
    break
}

const app = html`
  <div class="container" id="app">
    <header class="header">
      <ul>
        <li><a href="/">Search</a></li>
        <li><a href="/favourites">Favourites</a></li>
      </ul>
    </header>
    ${page}
  </div>
`

document.body.appendChild(app)

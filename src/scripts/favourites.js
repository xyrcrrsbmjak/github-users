import { storage } from './ls.js'
import { Component } from './slowpoke.js'
import renderUsers from './users.js'

class FavouritesPage extends Component {
  render() {
    this.html`
      <div>
        <h1>Favourites</h1>
        <ol class="users-list"></ol>
      </div>
    `

    renderUsers.call(this, storage.favourites)
  }
}

export default FavouritesPage

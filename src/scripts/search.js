import { storage, initItem, addListener, setItem } from './ls.js'
import { html, Component } from './slowpoke.js'
import { getUsers } from './requests.js'

class Paginator extends Component {
  render() {
    const { page } = storage.search

    const disabledLeft = page - 1 >= 1
    const disabledRight = page + 1 <= Math.ceil(storage.search.totalCount / storage.search.perPage)

    this.html`
      <div>
        <div>total count: ${storage.search.totalCount}</div>
        <button ${disabledLeft ? '' : 'disabled'} id="paginator-left">Tuda</button>
        <div id="paginator">${storage.search.page}</div>
        <button ${disabledRight ? '' : 'disabled'} id="paginator-right">Suda</button>
      </div>
    `

    this.component.querySelector('#paginator-left').addEventListener('click', (event) => {
      const previousPage = page - 1

      setItem('search', { ...storage.search, page: previousPage, items: [], status: 'pending' })
      getUsers(previousPage)
      this.update()
    })

    this.component.querySelector('#paginator-right').addEventListener('click', (event) => {
      const nextPage = page + 1

      setItem('search', { ...storage.search, page: nextPage, items: [], status: 'pending' })
      getUsers(nextPage)
      this.update()
    })
  }
}

class SearchResults extends Component {
  constructor(parent) {
    super(parent)

    addListener('search', () => this.update())
    addListener('favourites', () => this.update())
  }

  render() {
    const isUsersEmpty = storage.search.items.length

    this.html`
      <div>
        <div>
          ${isUsersEmpty ? Paginator : ''}
        </div>
        <ol class="search-list">
          ${isUsersEmpty ? '' : 'there s no users'}
        </ol>
      </div>
    `

    storage.search.items.forEach((item) => {
      const username = item.login

      const user = html`
        <li id="${username}">
          <a href="/${username}">${username}</a>
          <button class="${storage.favourites.includes(username) ? 'favourite' : ''}">Add to favourites</button>
        </li>
      `

      user.querySelector('button').addEventListener('click', (event) => {
        if (storage.favourites.includes(username)) {
          const index = storage.favourites.indexOf(username)

          if (index > -1) {
            storage.favourites.splice(index, 1)
          }

          setItem('favourites', storage.favourites)
        } else {
          storage.favourites.push(username)

          setItem('favourites', storage.favourites)
        }

        event.target.classList.toggle('favourite')
      })

      this.component.querySelector('ol').appendChild(user)
    })
  }
}

class SearchPage extends Component {
  constructor(parent) {
    super(parent)

    this.sortOptions = ['Followers', 'Repositories', 'Joined']
    this.orderOptions = ['DESC', 'ASC']

    initItem('search', {
      username: '',
      sort: this.sortOptions[0],
      order: this.orderOptions[0],
      perPage: 4,
      page: 1,
      totalCount: 0,
      items: [],
      status: 'none',
    })

    initItem('favourites', [])
  }

  render() {
    this.html`
      <section class="search" role="search">
        <form id="search-form" action="#" method="get">
          <fieldset>
            <legend>Search for GitHub users:</legend>
            <label for="search-input">
              <input
                type="search"
                name="username"
                id="search-input"
                placeholder="Search..."
                maxlength="39"
                value="${storage.search.username}"
              />
            </label>
            <label for="search-sort">
              Sort by:
              <select name="sort" id="search-sort">
                ${this.sortOptions.reduce(
                  (result, last) =>
                    result.concat(
                      `<option value="${last.toLowerCase()}" ${
                        last === storage.search.sort ? 'selected' : ''
                      }>${last}</option>`
                    ),
                  ''
                )}
              </select>
            </label>
            <label for="search-order">
              Order by:
              <select name="order" id="search-order">
                ${this.orderOptions.reduce(
                  (result, last) =>
                    result.concat(
                      `<option value="${last.toLowerCase()}" ${
                        last === storage.search.order ? 'selected' : ''
                      }>${last}</option>`
                    ),
                  ''
                )}
              </select>
            </label>
            <label for="search-per-page">
              Per page
              <input type="number" name="perPage" id="search-per-page" min="1", max="100" value="${
                storage.search.perPage
              }" max="100" />
            </label>
          </fieldset>
        </form>
        ${SearchResults}
      </section>
    `

    this.component.querySelector('#search-form').addEventListener('submit', (event) => {
      event.preventDefault()
    })

    this.component.querySelectorAll('[name]').forEach((element) =>
      element.addEventListener('change', (event) => {
        const { name, value } = event.target

        setItem('search', { ...storage.search, items: [], [name]: value, status: 'pending' })

        let timeout = 0

        if (name === 'username') {
          timeout = 1500
        }

        setTimeout(() => getUsers(1), timeout)
      })
    )
  }
}

export default SearchPage

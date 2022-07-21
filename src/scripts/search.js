import { storage, initItem, addListener, setItem } from './ls.js'
import { html, Component } from './slowpoke.js'
import { getUsers } from './requests.js'
import renderUsers from './users.js'

class Paginator extends Component {
  render() {
    const { page } = storage.search

    const disabledLeft = page - 1 >= 1
    const disabledRight = page + 1 <= Math.ceil(storage.search.totalCount / storage.search.perPage)

    this.html`
      <div class="paginator">
        <button class="paginator__btn paginator__btn--left" ${disabledLeft ? '' : 'disabled'}>Tuda</button>
        <div id="paginator">${storage.search.page}</div>
        <button class="paginator__btn paginator__btn--right" ${disabledRight ? '' : 'disabled'}>Suda</button>
      </div>
    `

    this.component.querySelector('.paginator__btn--left').addEventListener('click', () => {
      const previousPage = page - 1

      setItem('search', { ...storage.search, page: previousPage, items: [], status: 'pending' })
      getUsers(previousPage)
      this.update()
    })

    this.component.querySelector('.paginator__btn--right').addEventListener('click', () => {
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
    const requestStatus = storage.search.status

    let message = ''

    switch (requestStatus) {
      case 'pending':
        message = '<li class="user--center lds-dual-ring"></li>'
        break
      case 'empty':
        message = '<li class="user--center">There\'s no users</li>'
        break
      case 'error':
        message = '<li class="user--center">Something went wrong</li>'
        break
      default:
        break
    }

    this.html`
      <div>
        <h1>About ${storage.search.totalCount} results</h1>
        <ol class="users-list">
          ${message}
        </ol>
        ${requestStatus === 'some' ? Paginator : ''}
      </div>
    `

    renderUsers.call(this, storage.search.items)
  }
}

class SearchPage extends Component {
  render() {
    this.html`
      <section class="search" role="search">
        <form class="form" id="search-form" action="#" method="get">
          <fieldset class="fieldset">
            <legend>Search for GitHub users</legend>
            <label for="search-input">
              <span>Username</span>
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
              <span>Sort</span>
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
              <span>Order</span>
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
              <span>Per page</span>
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

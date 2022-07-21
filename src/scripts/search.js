import { storage, initItem, addListener, setItem } from './ls.js'
import { html, Component } from './slowpoke.js'
import { getUsers } from './requests.js'

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
        <ol class="search-list">
          ${message}
        </ol>
        ${requestStatus === 'some' ? Paginator : ''}
      </div>
    `

    storage.search.items.forEach((item) => {
      const { login } = item
      const findFavourite = (user) => user.login === login
      let isFavourite = Boolean(storage.favourites.find(findFavourite))

      const user = html`
        <li class="user" id="${login}">
          <img class="user__avatar" src="${item.avatar_url}" alt="${login}'s avatar" width="111" height="111" />
          <div class="user__info">
            <h2>${login}</h2>
            <a class="user__gtg" href="https://github.com/${login}" target="_blank">link to github</a>
          </div>
          <div class="user__controlls">
            <button class="user__favourite ${isFavourite ? 'user__favourite--active' : ''}">
              <svg
                class="user__favourite-icon"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </button>
            <a class="user__show-repositories" href="/${login}">Show repositories</a>
          </div>
        </li>
      `

      user.querySelector('.user__favourite').addEventListener('click', (event) => {
        if (isFavourite) {
          const index = storage.favourites.findIndex(findFavourite)

          if (index > -1) {
            storage.favourites.splice(index, 1)
          }
        } else {
          storage.favourites.push(item)
        }

        isFavourite = !isFavourite
        event.target.classList.toggle('user__favourite--active')

        setItem('favourites', storage.favourites)
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

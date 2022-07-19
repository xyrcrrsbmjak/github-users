import { storage, initStorage, setItem } from './ls.js'
import { html } from './html.js'
import { request } from './request.js'

class SearchPage {
  constructor(parent) {
    const sortOptions = ['Created', 'Username']
    const orderOptions = ['ASC', 'DESC']

    initStorage('search', {
      username: '',
      sort: sortOptions[0],
      order: orderOptions[0],
      perPage: 4,
      items: [],
      status: 'none',
    })

    initStorage('favourites', '[]')

    this.element = parent.appendChild(html`
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
                ${sortOptions.reduce(
                  (result, last) =>
                    result.concat(
                      `<option value="${last}" ${last === storage.search.sort ? 'selected' : ''}>${last}</option>`
                    ),
                  ''
                )}
              </select>
            </label>
            <label for="search-order">
              Order by:
              <select name="order" id="search-order">
                ${orderOptions.reduce(
                  (result, last) =>
                    result.concat(
                      `<option value="${last}" ${last === storage.search.order ? 'selected' : ''}>${last}</option>`
                    ),
                  ''
                )}
              </select>
            </label>
            <label for="search-per-page">
              Per page
              <input type="number" name="perPage" id="search-per-page" value="${storage.search.perPage}" max="100" />
            </label>
          </fieldset>
        </form>
        <div id="search-results"></div>
      </section>
    `)

    this.element.querySelector('#search-form').addEventListener('submit', (event) => {
      event.preventDefault()
    })

    this.element.querySelectorAll('[name]').forEach((element) =>
      element.addEventListener('input', (event) => {
        const { name, value } = event.target

        setItem('search', { ...storage.search, [name]: value, status: 'pending' })

        this.update()

        let timeout = 0

        if (name === 'username') {
          timeout = 1500
        }

        setTimeout(async () => {
          try {
            const response = await request(
              `https://api.github.com/search/users?q=${storage.search.username} in:username`
            )

            if (!response.ok) {
              throw new Error(response.statusText)
            }

            const body = await response.json()

            setItem('search', { ...storage.search, status: 'some', items: body.items })
          } catch (error) {
            setItem('search', { ...storage.search, status: 'error' })
          }

          this.update()
        }, timeout)
      })
    )
  }

  update() {
    const status = storage.search.status
    const results = this.element.querySelector('#search-results')
    const body = status === 'some' ? html`<ol class="search-list"></ol>` : html`<div class="search-message"></div>`

    switch (status) {
      case 'none':
        body.textContent = "There's no users"
        break
      case 'pending':
        body.textContent = 'Pending'
        break
      case 'error':
        body.textContent = 'Something went wrong'
        break
      default:
        storage.search.items.forEach((item) => {
          const username = item.login

          const user = html`
            <li id="${username}">
              <a href="/${username}">${username}</a>
              <button>Add to favourites</button>
            </li>
          `

          user.querySelector('button').addEventListener('click', (event) => {
            console.log(event.target.parentNode.id)
          })

          body.appendChild(user)
        })
    }

    results.replaceChildren(body)
  }
}

export { SearchPage }

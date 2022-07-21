import { html } from './slowpoke.js'
import { storage, setItem } from './ls.js'

function renderUsers(items) {
  items.forEach((item) => {
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

export default renderUsers

import { getUser } from './requests.js'
import { Component, html } from './slowpoke.js'

class UserPage extends Component {
  async render() {
    const [user, repos] = await getUser(window.location.pathname.replace('/', ''))

    this.html`
      <div>
        <h1>UserPage ${user.login}</h1>
        <ol class="repo-list"></ol>
      </div>
    `

    repos.forEach((repo) => {
      const li = html`
        <li id="${repo.name}">
          <span>${repo.name}</span>
          <a href="https://github.com/${user.login}/${repo.name}" target="_blank">Go to GitHub</a>
        </li>
      `

      this.component.querySelector('ol').appendChild(li)
    })
  }
}

export default UserPage

import { storage, setItem } from './ls.js'

function request(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${import.meta.env.VITE_GITHUB_PAT} `,
    },
  })
}

async function getUsers(params) {
  setItem('search', { ...storage.search, items: [], ...params, status: 'pending' })

  try {
    const { page } = params.page
    const { perPage, sort, order, username } = storage.search

    const response = await request(
      `https://api.github.com/search/users?page=${page}&per_page=${perPage}&sort=${sort}&order=${order}&q=${username} in:username`
    )

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const body = await response.json()

    setItem('search', {
      ...storage.search,
      status: body.total_count ? 'some' : 'empty',
      items: body.items,
      totalCount: body.total_count,
    })
  } catch (error) {
    setItem('search', { ...storage.search, status: 'error' })
  }
}

async function getUser(username) {
  try {
    const responseUser = await request(`https://api.github.com/users/${username}`)
    const responseRepos = await request(`https://api.github.com/users/${username}/repos`)

    if (!responseUser.ok) {
      throw new Error(responseUser.statusText)
    }

    if (!responseRepos.ok) {
      throw new Error(responseRepos.statusText)
    }

    const bodyUser = await responseUser.json()
    const bodyRepos = await responseRepos.json()

    return [bodyUser, bodyRepos]
  } catch (error) {
    return error
  }
}

export { request, getUsers, getUser }

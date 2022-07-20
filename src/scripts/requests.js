import { storage, setItem } from './ls.js'

function request(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${import.meta.env.VITE_GITHUB_PAT} `,
    },
  })
}

async function getUsers(page) {
  try {
    const response = await request(
      `https://api.github.com/search/users?page=${page}&per_page=${storage.search.perPage}&sort=${storage.search.sort}&order=${storage.search.order}&q=${storage.search.username} in:username`
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
      page,
    })
  } catch (error) {
    setItem('search', { ...storage.search, page, status: 'error' })
  }
}

export { request, getUsers }

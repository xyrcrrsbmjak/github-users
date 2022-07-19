function request(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `token ${import.meta.env.VITE_GITHUB_PAT} `,
    },
  })
}

export { request }

const ID_LENGTH = 12

function makeId(length) {
  let result = ''

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

function html(elements, ...expressions) {
  let resultHtml = ''

  expressions.forEach((value, i) => {
    resultHtml += `${elements[i]}${value}`
  })

  resultHtml += elements[elements.length - 1]

  const template = document.createElement('template')

  template.innerHTML = resultHtml.trim()

  // firstElementChild provides DOM IntelliSense for IDE
  return template.content.firstElementChild
}

class Component {
  constructor(parent) {
    this.parent = parent
  }

  html(elements, ...expressions) {
    let resultHtml = ''
    const components = {}

    expressions.forEach((value, i) => {
      if (value instanceof Function) {
        const id = makeId(ID_LENGTH)

        components[id] = value

        resultHtml += `${elements[i]}<div sid="${id}" />`
      } else {
        resultHtml += `${elements[i]}${value}`
      }
    })

    // eslint-disable-next-line
    resultHtml += elements[elements.length - 1]

    const template = document.createElement('template')

    template.innerHTML = resultHtml.trim()

    this.component = this.parent.appendChild(template.content.firstElementChild)

    for (const [key, CP] of Object.entries(components)) {
      new CP(this.component.querySelector(`[sid="${key}"]`)).mount()
    }
  }

  update() {
    this.component.remove()

    this.render()
  }

  mount() {
    this.render()

    return this.component
  }
}

export { html, Component }

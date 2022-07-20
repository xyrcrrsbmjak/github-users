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

  let template = document.createElement('template')

  template.innerHTML = resultHtml.trim()

  template = template.content.firstElementChild

  for (const [key, CP] of Object.entries(components)) {
    new CP(template.querySelector(`[sid="${key}"]`)).mount()
  }

  return template
}

class Component {
  constructor(componentParent) {
    this.componentParent = componentParent
  }

  html(elements, ...expressions) {
    const template = html(elements, ...expressions)

    this.component = this.componentParent.appendChild(template)
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

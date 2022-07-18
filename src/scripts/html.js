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

export { html }

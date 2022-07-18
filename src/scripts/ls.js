class LocalStorage {
  constructor() {
    this.storage = {}

    for (const [key, value] of Object.entries(localStorage)) {
      this.storage[key] = JSON.parse(value)
    }

    this.setItem = this.setItem.bind(this)
  }

  setItem(name, state) {
    this.storage[name] = state

    localStorage.setItem(name, JSON.stringify(state))
  }
}

const { storage, setItem } = new LocalStorage()

export { storage, setItem }

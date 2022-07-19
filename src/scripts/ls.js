class LocalStorage {
  constructor() {
    this.storage = {}

    for (const [key, value] of Object.entries(localStorage)) {
      this.storage[key] = JSON.parse(value)
    }

    this.initStorage = this.initStorage.bind(this)
    this.setItem = this.setItem.bind(this)
  }

  initStorage(name, initial, clear = false) {
    if (clear) {
      localStorage.removeItem(name)
    }

    const isInStorage = localStorage.getItem(name)

    if (!isInStorage) {
      this.storage[name] = initial

      localStorage.setItem(name, initial)
    }
  }

  setItem(name, state) {
    this.storage[name] = state

    localStorage.setItem(name, JSON.stringify(state))
  }
}

const { storage, initStorage, setItem } = new LocalStorage()

export { storage, initStorage, setItem }

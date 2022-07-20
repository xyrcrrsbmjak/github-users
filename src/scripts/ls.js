class LocalStorage {
  constructor() {
    this.storage = {}
    this.listeners = {}

    for (const [key, value] of Object.entries(localStorage)) {
      this.storage[key] = JSON.parse(value)
      this.listeners[key] = []
    }

    this.initStorage = this.initStorage.bind(this)
    this.setItem = this.setItem.bind(this)
    this.addListener = this.addListener.bind(this)
  }

  initStorage(name, initial, clear = false) {
    if (clear) {
      localStorage.removeItem(name)
    }

    const isInStorage = localStorage.getItem(name)

    if (!isInStorage) {
      this.storage[name] = initial
      this.listeners[name] = []

      localStorage.setItem(name, initial)
    }
  }

  addListener(name, func) {
    this.listeners[name].push(func)
  }

  setItem(name, state) {
    this.storage[name] = state

    localStorage.setItem(name, JSON.stringify(state))

    for (const key of Object.keys(this.listeners)) {
      for (const func of this.listeners[key]) {
        func()
      }
    }
  }
}

const { storage, initStorage, addListener, setItem } = new LocalStorage()

export { storage, initStorage, addListener, setItem }

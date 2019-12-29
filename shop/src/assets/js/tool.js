export default {
  session: {
    get (key) {
      if (key) {
        const item = window.sessionStorage.getItem(key)
        if (item) {
          return JSON.parse(item)
        }
      }
    },
    set (key, value) {
      if (key && value) {
        const item = JSON.stringify(value)
        window.sessionStorage.setItem(key, item)
      }
    },
    del (key) {
      if (key) {
        window.sessionStorage.removeItem(key)
      }
    },
    delAll () {
      window.sessionStorage.clear()
    }
  },
  local: {
    get (key) {
      if (key) {
        const item = window.localStorage.getItem(key)
        if (item) {
          return JSON.parse(item)
        }
      }
    },
    set (key, value) {
      if (key && value) {
        const item = JSON.stringify(value)
        window.localStorage.setItem(key, item)
      }
    },
    del (key) {
      if (key) {
        window.localStorage.removeItem(key)
      }
    },
    delAll () {
      window.localStorage.clear()
    }
  }
}

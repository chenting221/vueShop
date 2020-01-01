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
  },
  // 深拷贝
  deepCopy (param) {
    const deepCopyInternal = obj => {
      const objType = Object.prototype.toString.call(obj)
      if (objType === '[object Object]') {
        const result = Object.create(null)
        const keys = Object.keys(obj)
        keys.forEach((item) => {
          const type = Object.prototype.toString.call(obj[item])
          if (type === '[object Object]' || type === '[object Array]') {
            result[item] = deepCopyInternal(obj[item])
          } else {
            result[item] = obj[item]
          }
        })
        return result
      } else if (objType === '[object Array]') {
        const result = []
        obj.forEach((item) => {
          const type = Object.prototype.toString.call(item)
          if (type === '[object Object]' || type === '[object Array]') {
            result.push(deepCopyInternal(item))
          } else {
            result.push(item)
          }
        })
        return result
      }
    }

    const types = Object.prototype.toString.call(param)
    if (types !== '[object Object]' && types !== '[object Array]') return param
    else return deepCopyInternal(param)
  }
}

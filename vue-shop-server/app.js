const express = require('express')
const compression = require('compression')
const app = express()

// 一定要把这一行代码写到静态资源托管之前, 否则不会生效
app.use(compression())
// 托管静态目录
app.use(express.static('./dist'))

app.listen(8888, () => {
  console.log('server running at http://127.0.0.1')
})
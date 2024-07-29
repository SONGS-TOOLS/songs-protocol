
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./mufi-ui-components.cjs.production.min.js')
} else {
  module.exports = require('./mufi-ui-components.cjs.development.js')
}

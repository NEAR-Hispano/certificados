const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './storage/img')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + Date.now() + '.'+ file.mimetype.split('/')[file.mimetype.split('/').length -1])
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload
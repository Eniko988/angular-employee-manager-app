const mongoose = require('mongoose')

const dataSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String
})

module.exports = mongoose.model('EmployeeData', dataSchema)

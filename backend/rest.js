const express = require('express')
const bodyParser = require('body-parser')
const EmployeeDataModel = require('./data-schema')
const mongoose = require('mongoose')
const UserModel = require('./user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()
const uri =
  'mongodb+srv://enikoszebenyi:y3c88y7aMhQfYh9@cluster0.tj7hhcy.mongodb.net/datadb?retryWrites=true&w=majority'

mongoose
  .connect(uri)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(() => {
    console.log('Error connecting to MongoDB')
  })

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  next()
})

app.delete('/remove-data/:id', (req, res) => {
  EmployeeDataModel.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      message: 'Post deleted'
    })
  })
})

app.put('/update-data/:id', (req, res) => {
  const updatedData = new EmployeeDataModel({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone
  })
  EmployeeDataModel.updateOne({ _id: req.body.id }, updatedData).then(() => {
    res.status(200).json({
      message: 'Updated completed'
    })
  })
})

app.post(
  '/add-data',
  (req, res, next) => {
    try {
      const token = req.headers.authorization
      jwt.verify(token, 'secret_string')
      next()
    } catch (err) {
      res.status(401).json({
        message: 'Error with Authentication token'
      })
    }
  },
  (req, res) => {
    const employeeData = new EmployeeDataModel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone
    })
    employeeData.save()
    res.status(200).json({
      message: 'Post submitted'
    })
  }
)

app.get('/employee-data', (req, res, next) => {
  EmployeeDataModel.find()
    .then(data => {
      res.json({ employees: data })
    })
    .catch(() => {
      console.log('Error fetching data')
    })
})

app.post('/sign-up', (req, res) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const userModel = new UserModel({
      username: req.body.username,
      password: hash
    })

    userModel
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created',
          result: result
        })
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
  })
})

app.post('/login', (req, res) => {
  let userFound

  UserModel.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'User not found'
        })
      }
      userFound = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          messsage: 'Password is incorrect'
        })
      }

      const token = jwt.sign(
        { username: userFound.username, userId: userFound._id },
        'secret_string'
      )
      return res.status(200).json({
        token: token
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Error with authentication'
      })
    })
})

module.exports = app

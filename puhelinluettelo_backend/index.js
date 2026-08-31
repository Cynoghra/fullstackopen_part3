require('dotenv').config() // 3.13
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') // 3.13
const app = express()
const PORT = process.env.PORT || 3001 //renderiä varten 3.10

app.use(express.json())
app.use(express.static('dist')) // 3.10 tehtävä
app.use(cors())

morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }

  // palautetaan tyhjä merkkijono, jos pyyntö ei ole POST
  return ''
})

//app.use(morgan('tiny')) poistettu käytöstä tehtävää 3.8 varten
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ei tarvita enää, koska tietokanta on käytössä
/*const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]*/

// 3.2 tehtävä, poistettu käytöstä 3.18
/*const info = () => {
  const date = new Date()
  return Person.countDocuments({}).then(count => {
    return `Phonebook has info for ${count} people <br><br>${date}`
  })
}*/

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`Phonebook has info for ${count} people <br><br>${new Date()}`)
    })
    .catch(error => next(error))
})

// 3.3 tehtävä, 3.18 tehtävässä muutettu
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// 3.4 tehtävä, 3.15 muutettu
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// 3.5 ja 3.6 tehtävä, muutoksia tietokannan lisäämisen jälkeen
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.status(201).json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then(updatedPerson => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// 3.16 tehtävä
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// 3.16 tehtävä
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
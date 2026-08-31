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

// 3.2 tehtävä
const info = () => {
  const date = new Date()
  return Person.countDocuments({}).then(count => {
    return `Phonebook has info for ${count} people <br><br>${date}`
  })
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)
  })
})

app.get('/info', (request, response) => {
  response.send(info())
})

// 3.3 tehtävä
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// 3.4 tehtävä
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const personIndex = persons.findIndex(person => person.id === id)

    if (personIndex !== -1) {
    persons.splice(personIndex, 1)
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

// 3.5 ja 3.6 tehtävä, muutoksia tietokannan lisäämisen jälkeen
app.post('/api/persons', (request, response) => {
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
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
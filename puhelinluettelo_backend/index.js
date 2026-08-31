const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

const persons = [
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
]

// 3.2 tehtävä
const info = () => {
  const date = new Date()
  return `Phonebook has info for ${persons.length} people <br><br>${date}`
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
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

// 3.5 ja 3.6 tehtävä
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.some(person => person.name === name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const id = Math.floor(Math.random() * 1000000).toString()
  const newPerson = { id, name, number }
  persons.push(newPerson)
  response.status(201).json(newPerson)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
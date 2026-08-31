import { useState, useEffect } from 'react'
import Filter from './components/Filter'
// ei tarvitse Personia tuoda tänne, koska Display hoitaa sen
import Display from './components/Display'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  // Testi aineisto, joka sisältää muutaman henkilön nimen ja puhelinnumeron
  // 2.11 muutettu axios hakuun
  // 2.12-2.15 tehty. Synkronointi palvelimelle. Palvelut lisätty services kansioon.
  const [persons, setPersons] = useState([])

  // 2.16
  const [notificationMessage, setNotificationMessage] = useState(null)

  // 2.17
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  // Tilat uuden henkilön nimen ja puhelinnumeron tallentamiseen sekä suodattimen hallintaan
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    const personObject = {
      name: newName,
      number: newNumber
    }

    // Tarkistetaan, onko nimi jo listassa, jos on, kysytään käyttäjältä, haluaako hän korvata vanhan numeron uudella
    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmReplace) {
        const changedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personService
          .update(existingPerson.id, changedPerson)
          .then(response => {
            setPersons(
              persons.map(person =>
                person.id !== existingPerson.id
                  ? person
                  : response.data
              )
            )

            setNotificationMessage(`Updated ${newName}'s number`)

            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)

            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )

            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)

            // päivitetään näkymä poistamalla henkilö, joka on jo poistettu palvelimelta
            setPersons(
              persons.filter(person => person.id !== existingPerson.id)
            )
          })
      }
    } else {
      personService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))

          setNotificationMessage(`Added ${newName}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)

          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          setErrorMessage(`Failed to add ${newName}`)

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))

          setNotificationMessage(`Deleted ${name}`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${name} has already been removed from server`
          )

          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)

          // päivitetään näkymä poistamalla henkilö, joka on jo poistettu palvelimelta
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Suodatetaan henkilöt filterin perusteella
  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={notificationMessage}
        type="notification"
      />

      <Notification
        message={errorMessage}
        type="error"
      />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Display persons={personsToShow} removePerson={removePerson} />
    </div>
  )

}

export default App
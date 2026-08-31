import Person from './Person'

const Display = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <Person
          key={person.id}
          person={person}
          removePerson={removePerson}
        />
      ))}
    </div>
  )
}

export default Display
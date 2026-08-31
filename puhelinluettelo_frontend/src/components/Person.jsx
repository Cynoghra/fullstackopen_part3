const Person = ({ person, removePerson }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id, person.name)}>
        delete
      </button>
    </div>
  )
}

export default Person
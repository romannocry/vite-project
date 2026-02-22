import { useState } from "react"
import { Button } from "reactstrap"
import Row from "./Row"

export default function ListOfRows() {

  const initialRows = [{
    id: 1,
    name: "Row 1"
  }, {
    id: 2,
    name: "Row 2"
  }, {
    id: 3,
    name: "Row 3"    
  }]


  const [editingIds, setEditingIds] = useState<number[]>([])
  const [editedRows, setEditedRows] = useState<Record<number, string>>({})

  function handleEdit(id: number) {
    setEditingIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    )
  }

  function handleChange(id: number, value: string) {
    setEditedRows(prev => ({
      ...prev,
      [id]: value
    }))
  }

  async function handleSaveAll() {
    const rowsToSave = Object.entries(editedRows).map(([id, name]) => ({
      id: Number(id),
      name
    }))

    console.log("Saving rows:", rowsToSave)

    // pretend API call
    //await new Promise(res => setTimeout(res, 1000))

    // reset after save
    setEditedRows({})
    setEditingIds([])
  }

  return (
    <div>
      <Button
        color="success"
        onClick={handleSaveAll}
        disabled={Object.keys(editedRows).length === 0}
      >
        Save All
      </Button>

      {initialRows.map(row => (
        <Row
          key={row.id}
          id={row.id}
          name={row.name}
          isEditing={editingIds.includes(row.id)}
          editedValue={editedRows[row.id]}
          onEdit={handleEdit}
          onChange={handleChange}
        />
      ))}
    </div>
  )
}
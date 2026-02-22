import { Button, Input, InputGroup } from "reactstrap"

interface RowProps {
  id: number
  name: string
  isEditing: boolean
  editedValue?: string
  onEdit: (id: number) => void
  onChange: (id: number, value: string) => void
}

export default function Row({
  id,
  name,
  isEditing,
  editedValue,
  onEdit,
  onChange
}: RowProps) {

  const displayValue = editedValue ?? name

  return (
    <div style={{ border: "2px solid red", padding: "10px", margin: "10px 0" }}>
      <InputGroup>
        <Button color="primary" onClick={() => onEdit(id)}>
          {isEditing ? "Cancel" : "Edit"}
        </Button>

        <Button
          color="secondary"
          onClick={() => console.log(`Delete row ${id}`)}
        >
          Delete
        </Button>

        <Input
          value={displayValue}
          disabled={!isEditing}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </InputGroup>
    </div>
  )
}
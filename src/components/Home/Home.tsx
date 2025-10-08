import { useEffect, useState } from 'react';
import { Button, Container, Modal, ModalBody, Input, Row, Col } from 'reactstrap';
import List from './List';
import { Element } from './types/element';

const elementsList = [
    { id: 1, name: "Element 1", role: "admin", created_at: "2023-10-01", updated_at: "2023-10-10", nominated: ["John1"], step_validated: false, step_email_sent: true, step_rsvp: "pending", step_booked: false },
    { id: 2, name: "Element 2", role: "user", created_at: "2023-09-15", updated_at: "2023-10-05", nominated: [], step_validated: true, validated_by: "admin", validated_at: "2023-10-06", step_email_sent: false, step_rsvp: "accepted", step_booked: true },
    { id: 3, name: "Element 3", role: "user", created_at: "2023-08-20", updated_at: "2023-09-25", nominated: ["John2", "John3"], step_validated: false, step_email_sent: false, step_rsvp: "declined", step_booked: false },
    { id: 4, name: "Element 4", role: "admin", created_at: "2023-07-30", updated_at: "2023-08-15", nominated: ["John4"], step_validated: true, validated_by: "superadmin", validated_at: "2023-08-16", step_email_sent: true, step_rsvp: "accepted", step_booked: true },
    { id: 5, name: "Element 5", role: "user", created_at: "2023-06-10", updated_at: "2023-07-01", nominated: [], step_validated: false, step_email_sent: false, step_rsvp: "pending", step_booked: false },
];

function Home() {
  const [elements, setElements] = useState<Element[]>([]);
  //const [FilteredElements, setFilteredElements] = useState<Element[]>(elements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newElementName, setNewElementName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  useEffect(() => {
    setElements(elementsList);
  }, []);

  const filtered = elements.filter(el =>
    Object.values(el).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newElementName.trim()) return;

  if (mode === "add") {
    const newElement = {
      id: elements.length + 1,
      name: newElementName,
      role: "user",
    };
    setElements([...elements, newElement]);
  } else if (mode === "edit" && selectedElement) {
    setElements(elements.map(el =>
      el.id === selectedElement.id ? { ...el, name: newElementName } : el
    ));
  }

  // reset
  setNewElementName("");
  setSelectedElement(null);
  setIsModalOpen(false);
};

    const handleCreate = () => {
        setMode("add");
        // open a modal to edit the element details
        setIsModalOpen(true);
    }

    const handleEdit = (id: number) => {
        const el = elements.find(e => e.id === id);
        if (!el) return;
        setSelectedElement(el);
        setNewElementName(el.name);
        setMode("edit");
        setIsModalOpen(true);
    };


const getRandomNominee = () => {
  const randomNum = Math.floor(Math.random() * 5) + 1; // 1-5
  return `John${randomNum}`;
};

  const handleNomination = (id: number) => {
    console.log("Nominating element with id:", id);
    // create a new entry in the nominated db table - we keep only the last timestamp
  const randomName = getRandomNominee();

  setElements(prevElements =>
    prevElements.map(el => {
      if (el.id === id) {
        // check if the name is already in the nominated array
        const existing = el.nominated || [];
        if (existing.includes(randomName)) {
          return el; // do nothing if already nominated
        }
        return { ...el, nominated: [...existing, randomName] };
      }
      return el;
    })
  );
};


    const handleApproval = (id: number) => {
        console.log("Approving element with id:", id);
        // update the element in the db table
        setElements(prevElements =>
            prevElements.map(el =>
                el.id === id ? { ...el, step_validated: true, validated_by: 'roman', validated_at: '02/02/02' } : el
            )
        );
        //Store in approval table with timestamp
    }


  return (
    <Container>
    Params: {searchTerm} - {mode}
      <h1>Home Component</h1>
      <Row>
        <Col md={6}>
          <Input
            type="text"
            placeholder="Search elements..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6} className="d-flex justify-content-end align-items-center">
        <Button color="primary" onClick={handleCreate}>
            Add New Element
        </Button>
        </Col>

      </Row>


      <hr />
      <List elements={filtered} onNominate={handleNomination} onEdit={handleEdit} onApprove={handleApproval}/>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalBody>
          <h2>{mode == "add" ? 'Add New Element':'Edit Element'}</h2>
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Element name"
              value={newElementName}
              onChange={(e) => setNewElementName(e.target.value)}
            />
            <Button color="success" type="submit" className="mt-2">
              Submit
            </Button>
          </form>
        </ModalBody>
      </Modal>
    </Container>
  );
}

export default Home;

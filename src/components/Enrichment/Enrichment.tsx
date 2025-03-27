import { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input } from "reactstrap";

const API1 = "https://api.example.com/data";
const API2 = "https://api.example.com/enrich";
const LAMBDA_API__BASE_URI = import.meta.env.VITE_LAMBDA_API_BASE_URI
const LAMBDA_APP_DATABASE_NAME = import.meta.env.VITE_LAMBDA_APP_DATABASE_NAME

const enrichment_fields: Record<string, string> = { content: "", title: "" };

interface DataItem {
  id: number;
  content: string;
  title: string;
}

function Enrichment() {
  const [data, setData] = useState<DataItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [enrichment, setEnrichment] = useState<Record<string, string>>(enrichment_fields);

  useEffect(() => {
    fetch(LAMBDA_API__BASE_URI + LAMBDA_APP_DATABASE_NAME+'/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU"      
        },
    })
      .then((response) => response.json())
      .then((data: DataItem[]) => setData(data));
  }, []);

  const openModal = (item: DataItem) => {
    setSelectedItem(item);
    setEnrichment({ ...enrichment_fields });
    setModalOpen(true);
  };

  const handleEnrichmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnrichment({ ...enrichment, [e.target.name]: e.target.value });
  };

  const submitEnrichment = async () => {
    if (!selectedItem) return;
    //console.log(JSON.stringify({ id: selectedItem.id, ...enrichment }))
    await fetch(LAMBDA_API__BASE_URI + LAMBDA_APP_DATABASE_NAME+'/create', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...enrichment })
    });
    setModalOpen(false);
  };

  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.content}</td>
              <td>
                <Button color="primary" onClick={() => openModal(item)}>Enrich</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>Enrich Data</ModalHeader>
        <ModalBody>
          {Object.entries(enrichment).map(([key, value], index) => (
            <Input
              key={`${key}-${index}`}
              name={key}
              value={value}
              onChange={handleEnrichmentChange}
              placeholder={`Enter ${key}`}
              className="mb-2"
            />
          ))}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={submitEnrichment}>Submit Enrichment</Button>{" "}
          <Button color="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}


export default Enrichment;

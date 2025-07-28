import { useEffect, useState } from 'react'
import styles from './Counter.module.css'; // Import the CSS Module
import { useParams } from "react-router-dom";
import { AgGridReact } from 'ag-grid-react';
import ModalWrapper from './ModalWrapper'
import ItemForm from './InputForm'; // Assuming you have a form component for creating/editing items
import type { FormData } from './interfaces'; // Import the FormData type
// Import the necessary styles for ag-Grid
import type { CustomCellRendererProps } from 'ag-grid-react';
import { ActionsCellRenderer } from './ActionsCellRenderer';

function Counter() {
 const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FormData | undefined>(undefined); // undefined means "create"
  const [rowData, setRowData] = useState<any[]>([]); // Replace 'any' with your actual data type


  useEffect(() => {
    // Fetch initial data here, for example:
    // fetch('/api/items')
    //   .then(response => response.json())
    //   .then(data => setRowData(data));
    // For demonstration, we'll use a static array
    setRowData([
      { title: 'Item 1', description: 'Description 1', price: 10, quantity: 100 },
      { title: 'Item 2', description: 'Description 2', price: 20, quantity: 200 },
      { title: 'Item 3', description: 'Description 3', price: 30, quantity: 300 }
    ]);
  }, []);


  const openCreateModal = () => {
    console.log("openCreateModal");
    // Reset the editing item to undefined for creating a new item
    setEditingItem(undefined);
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleFormSubmit = (data: any) => {
    if (editingItem) {
      // update logic
    } else {
      // create logic
    }
    setModalOpen(false);
  }

const columnDefs = [
  { field: "actions", cellRenderer: ActionsCellRenderer, width: 150 },
  { headerName: "Title", field: "title" },
  { headerName: "Description", field: "description" },
  { headerName: "Price", field: "price" },

];
  return (
    <>
    <div>
      <button onClick={openCreateModal}>Create</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs} context={{ openEditModal }}/>
      </div>
      <ModalWrapper
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Item" : "Create Item"}
      >
        <ItemForm initialData={editingItem} onSubmit={handleFormSubmit} mode={editingItem ? "edit" : "create"}/>
      </ModalWrapper>




      
      </div>
    </>
  )
}

export default Counter
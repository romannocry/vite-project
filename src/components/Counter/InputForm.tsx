import React, { useState } from "react";
import { FormData } from "./interfaces";
import { Form } from "reactstrap";

interface ItemFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  mode: "create" | "edit";
}

export default function ItemForm({ initialData = {title:'',description:'',quantity:0,price:0}, onSubmit, mode }: ItemFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={formData.title || ""}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border p-2 rounded"
        disabled={mode === "edit"} // optional: disable editing title

      />
        <input
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
        />        
        <input
        name="price"
        type="number"
        value={formData.price || ""}           
        onChange={handleChange}
        placeholder="Price"    
        className="w-full border p-2 rounded"
        />
        <input
        name="quantity"
        type="number"
        value={formData.quantity || ""}
        onChange={handleChange}
        placeholder="Quantity"
        className="w-full border p-2 rounded"
        />    
      {/* Add more fields as needed */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}

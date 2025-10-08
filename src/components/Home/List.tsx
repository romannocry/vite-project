import { Element } from "./types/element";
import { Table } from "reactstrap";

interface ListProps {
  elements: Element[];
  onNominate?: (id: number) => void;
  onEdit?: (id: number) => void;
  onApprove?: (id: number) => void;
}

export default function List({ elements, onNominate, onEdit, onApprove }: ListProps) {
    return (
        <div>
            <h2>List Component</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Actions</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Nominated</th>
                        <th>Validated</th>
                        <th>Validated info</th>
                        <th>Email Sent</th>
                        <th>RSVP</th>
                        <th>Booked</th>
                    </tr>
                </thead>
                <tbody>
                    {elements.map((element) => (
                        <tr key={element.id}>
                         <td>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onEdit && onEdit(element.id)}>
                                Edit
                            </button>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onNominate && onNominate(element.id)}>
                                {element.nominated?.includes("John1") ? "Nominated" : "Nominate"}
                            </button>
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => onApprove && onApprove(element.id)}>
                                {element.step_validated ? "Deny" : "Approve"}
                            </button>
                        </td>
                        <td>{element.id}</td>
                        <td>{element.name}</td>
                        <td>{element.role}</td>
                        <td>{element.nominated}</td>
                        <td>{element.step_validated ? "✅" : "❌"}</td>
                        <td>{element.validated_by ? `${element.validated_by} at ${element.validated_at}` : "N/A"}</td>
                        <td>{element.step_email_sent ? "✅" : "❌"}</td>
                        <td>{element.step_rsvp || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
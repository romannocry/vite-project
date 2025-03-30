import { useState, useEffect, useMemo } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Container } from "reactstrap";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeAlpine} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-alpine-dark.css"; // Dark Theme
import { colorSchemeDark } from 'ag-grid-community';
import { ClientSideRowModelModule } from "ag-grid-community"; // Required for basic functionality
import { MdEdit } from "react-icons/md";


const LAMBDA_API__BASE_URI = import.meta.env.VITE_LAMBDA_API_BASE_URI
const LAMBDA_APP_DATABASE_NAME = import.meta.env.VITE_LAMBDA_APP_DATABASE_NAME
const myTheme = themeAlpine.withPart(colorSchemeDark);

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

//using this variable to define which fields should be enriched
const enrichment_fields: Record<string, string> = { captain: "", business: "", linked_deal: ""};

//extra feature to create dropdown fields if necessary
const dropdownFields: Record<string, string[]> = {
    business: ["Finance", "Technology", "Healthcare", "Retail"],
    linked_deal: ["M&A", "IPO", "Debt Issuance"],
};

interface DataItem {
    id: string;
    content: string;
    title: string;
    action?: string; // Optional field, but it won’t hold actual data
    //enrichment?: string;//Record<string, any>; // Optional field, but it won’t hold actual data
    enrichment: Record<string, any> // Optional field, but it won’t hold actual data
}

function Enrichment() {
    const [data, setData] = useState<DataItem[]>([]);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DataItem>();
    const [enrichment, setEnrichment] = useState<Record<string, string>>(enrichment_fields);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch(LAMBDA_API__BASE_URI + LAMBDA_APP_DATABASE_NAME + '/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU"
            },
        })
            .then((response) => response.json())
            .then((initial_data: DataItem[]) => {
                //console.log(data)
                //setData(data);        // Store original data
                //setFilteredData(data); // Initialize AG Grid with full dataset

                fetch(LAMBDA_API__BASE_URI + 'tests' + '/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTc2ODA1MTIsInN1YiI6Ijg2YjM4NTUwLWJlMzMtNGQxYS1hZGQ5LTJjYTk2OGE2YzMyZiJ9.u1VqhlfAZN7Ymz7EMS7N9hnwyKYw38EC9eZVchbVAXU"
                    },
                })
                    .then((response) => response.json())
                    .then((enrichment_data) => {
                        //console.log(enrichment_data)
                        //console.log(initial_data)
                        
                        //Sort the enrichment data to take only the latest value (like this we keep historical) 
                        enrichment_data.sort((a: { created_at: string | number | Date; }, b: { created_at: string | number | Date; }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

                        // Perform a left join
                        const joinedData = initial_data.map(item => {
                            // Find matching enrichment data based on the `id` and `post_id`
                            const enrichment = enrichment_data.find((enrich: { post_id: string; }) => enrich.post_id === item.id);
                        
                            // If a match is found, add enrichment data to the item
                            if (enrichment) {
                            return {
                                ...item,
                                enrichment: enrichment.enrichment
                                //enrichment: JSON.stringify(enrichment.enrichment)
                            };
                            } else {
                            // If no match, return item as is
                            return {
                                ...item,
                                enrichment: {}
                                //enrichment: JSON.stringify(enrichment.enrichment)
                            };                            }
                        });
                        console.log(joinedData)
                        setData(joinedData);        // Store original data
                        setFilteredData(joinedData); // Initialize AG Grid with full dataset
                    });

            })
    }, []);




    const handleFilterChange = (searchValue: string) => {
        setSearchTerm(searchValue);
        console.log(searchValue)
        const lowercasedValue = searchValue.toLowerCase();

        const filtered = data.filter((item) => {
            return Object.entries(item).some(([key, value]) => {
                if (value === null || value === undefined) return false;
        
                // Convert enrichment object to a string for searching
                if (key === "enrichment" && typeof value === "object") {
                    return Object.values(value)
                        .join(" ") // Convert all enrichment values to a string
                        .toLowerCase()
                        .includes(lowercasedValue);
                }
        
                // Normal string-based filtering for other fields
                return value.toString().toLowerCase().includes(lowercasedValue);
            });
        });

        setFilteredData(filtered);
    };

    const openModal = (item: DataItem) => {
        setSelectedItem(item);
        setEnrichment({ ...enrichment_fields });
        setModalOpen(true);
    };

    const handleEnrichmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        setSelectedItem((prev) => {
            if (!prev) return prev; // Ensure prev exists
    
            return {
                ...prev,
                enrichment: {
                    ...prev.enrichment, // Keep other enrichment values
                    [name]: value, // Update only the changed key
                },
            };
        });
        console.log(selectedItem);
    };


    const submitEnrichment = async () => {
        if (!selectedItem) return;

        // Keep only the id and enrichment of the selectedItem > we don't need every fields
        const enrichedSelectedItem = {
            post_id: selectedItem.id,
            //enrichment: JSON.stringify(enrichment)
            enrichment: selectedItem.enrichment
        };
        console.log(enrichedSelectedItem)
        
        const updatedData = data.map((item) =>
            item.id === selectedItem.id ? selectedItem : item // Replace the matching item
        )
        setData(updatedData)

        const updatedDataFiltered = filteredData.map((item) =>
            item.id === selectedItem.id ? selectedItem : item // Replace the matching item
        )
        setFilteredData(updatedDataFiltered);

        await fetch(LAMBDA_API__BASE_URI + 'tests' + '/create', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enrichedSelectedItem)
        });

        setModalOpen(false);
    };

    //
    const defaultColDef = {
        filter: true, // Enables filtering for all columns
    };
    
 

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<DataItem>[]>([
        {
            headerName: "Action",
            field: "action",
            cellRenderer: (params: { data: DataItem; }) => {
                return (
                    <Button
                        style={{
                            backgroundColor: "white", // Matches Alpine Dark
                            color: "#3A4D63",
                            border: "1px solid #3A4D63",
                            padding: "0px 5px",
                            borderRadius: "0px",
                            cursor: "pointer",
                            transition: "0.2s",
                        }}
                        color="primary" onClick={() => openModal(params.data)}>
                        <MdEdit />Enrichment
                    </Button>
                );
            },
            width: 150,
            sortable: false,
            filter: false,
        },
        { field: "id", filter: "agTextColumnFilter" },
        { field: "content", filter: "agTextColumnFilter" },
        { field: "title", filter: "agTextColumnFilter" },
        {
            headerName: "Enrichment",
            field: "enrichment",
            valueGetter: (params) => JSON.stringify(params.data?.enrichment), // Convert the enrichment object to a JSON string
            sortable: true,
            filter: "agTextColumnFilter",
        },
    ]);

    //
    return (
        <>

            {/* Search Bar */}
            <Input
                type="text"
                placeholder="Search..."
                name="searchInput"
                value={searchTerm}
                onChange={(e) => handleFilterChange(e.target.value)}
                style={{
                    marginBottom: "10px",
                    maxWidth: "300px",
                    padding: "8px",
                }}
            />


            <div style={{ height: "65vh", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ flexGrow: 1, overflowY: "auto" }}>
                    <AgGridReact
                        theme={myTheme}
                        pagination={true}
                        paginationPageSize={100}
                        rowData={filteredData}
                        enableCellTextSelection={true} // Allows selecting cell text for copy-pasting
                        defaultColDef={{ editable: true , resizable: true}} // Allows editing before copy-pasting
                        columnDefs={colDefs}
                        suppressHorizontalScroll={false} // Ensures smooth scrolling
                        suppressMovableColumns={true} // Prevents column drag
                        rowHeight={35} // Minimum reasonable height
                        headerHeight={25} // Compact header
                        // sideBar={{
                        //     toolPanels: [
                        //         {
                        //             id: "columns",
                        //             labelDefault: "Columns",
                        //             labelKey: "columns",
                        //             iconKey: "columns",
                        //             toolPanel: "agColumnsToolPanel",
                        //             toolPanelParams: {
                        //                 suppressRowGroups: true,
                        //                 suppressValues: true,
                        //                 suppressPivots: true,
                        //             },
                        //         },
                        //     ],
                        // }}
                    />
                </div>
            </div>

            <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
                <ModalHeader toggle={() => setModalOpen(false)}>Enrich Data</ModalHeader>
                <ModalBody>

                    {Object.entries(enrichment).map(([key, value], index) => (
                        <div key={`${key}-${index}`} className="mb-2">
                            {dropdownFields[key] ? (
                                // Dropdown for predefined fields
                                <select
                                    name={key}
                                    value={selectedItem?.enrichment[key] || ""}
                                    onChange={handleEnrichmentChange}
                                    className="form-control"
                                >
                                    <option value="">Select {key}</option>
                                    {dropdownFields[key].map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            ) : (
                                // Text input for other fields
                                <Input
                                    name={key}
                                    value={selectedItem?.enrichment[key] || ""}
                                    onChange={handleEnrichmentChange}
                                    placeholder={`Enter ${key}`}
                                    className="form-control"
                                />
                            )}
                        </div>
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

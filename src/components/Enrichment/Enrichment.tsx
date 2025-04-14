import { useState, useEffect, useMemo, useRef, useCallback} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Input, Container, InputGroup } from "reactstrap";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeAlpine, themeQuartz} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-alpine-dark.css"; // Dark Theme
import { colorSchemeDark } from 'ag-grid-community';
import { ClientSideRowModelModule } from "ag-grid-community"; // Required for basic functionality
import { MdEdit } from "react-icons/md";
import styles from './InventoryExample.module.css'; // Import the CSS Module
import { fetchData } from "../Shared/Api";
const LAMBDA_API__BASE_URI = import.meta.env.VITE_LAMBDA_API_BASE_URI

//const myTheme = themeAlpine.withPart(colorSchemeDark);
const myTheme = themeQuartz

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
    const gridRef = useRef<AgGridReact>(null);
    const [colDefs, setColDefs] = useState<ColDef<DataItem>[]>([])
    const [loading, setLoading] = useState(true);


  // Generate dynamic enrichment columns
  const generateEnrichmentColumns = () => {
    // Convert them into AG Grid column definitions
    const enrichmentCols: ColDef<DataItem>[] = Object.keys(enrichment_fields).map((key) => ({
        field: `enrichment.${key}`,
        headerName: `${key}`,
        valueGetter: (params) => params.data?.enrichment?.[key],
    }));
    return enrichmentCols

  };

  // Create column definitions for AG Grid
  const createColumnDefs = (enrichmentCols: any[]) => [


    
    { headerCheckboxSelection: true, checkboxSelection: true, width: 30 },
    {
      headerName: "Action",
      field: "action",
      cellRenderer: (params: { data: DataItem }) => (
        <Button onClick={() => openModal(params.data)} style={actionButtonStyle}>
          <MdEdit /> Enrichment
        </Button>
      ),
      width: 150,
      sortable: false,
      filter: false,
    },
    { field: "id", filter: "agTextColumnFilter", width: 100 },
    { field: "title", filter: "agTextColumnFilter" },
    ...enrichmentCols,
  ];
  
    useEffect(() => {


    // Fetch initial data
    fetchData().then(([initialData, enrichmentData]) => {
        console.log(initialData)
        const enrichedData = mergeData(initialData, enrichmentData);
        setData(enrichedData);
        setFilteredData(enrichedData);
        // Create dynamic enrichment columns
        const enrichmentCols = generateEnrichmentColumns();
        setColDefs(createColumnDefs(enrichmentCols));
      });
    setLoading(false)

    }, []);
 
    const gridOptions = {
        overlayLoadingTemplate: `
        <div class-"ag-overlay-loading-center">
            <div class="spinner"></div>
            <span>Loading...</span>
        </div>
        `,
        overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No rows to show</span>',
    }

  // Merge initial data with enrichment data
  const mergeData = (initialData: DataItem[], enrichmentData: any[]) => {
    enrichmentData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return initialData.map((item) => {
      const enrichment = enrichmentData.find((enrich) => enrich.post_id === item.id);
      return {
        ...item,
        enrichment: enrichment ? enrichment.enrichment : {},
      };
    });
  };

  const actionButtonStyle = {
    backgroundColor: "white",
    color: "#3A4D63",
    border: "1px solid #3A4D63",
    padding: "0px 5px",
    borderRadius: "0px",
    cursor: "pointer",
    transition: "0.2s",
  };

    const handleDownload = () => {
        gridRef.current!.api.exportDataAsCsv({
          onlySelected: false,       // set to true if you want only selected rows
          allColumns: false,         // set to true if you want all columns (even hidden ones)
          fileName: 'filtered-data.csv',
        });
      };
    

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
    


    const [activeTab, setActiveTab] = useState("all");
    const statuses = {
        all: "All",
        'this is a roman': "test",
        'this is a test': "On Hold",
        outOfStock: "Out of Stock",
      };

      const handleTabClick = useCallback((status: string) => {
        setActiveTab(status);

        gridRef
          .current!.api.setColumnFilterModel(
            "title",
            {
                "filterType": "text",
                "type": "equals",
                "filter": status === "all" ? null :[status]
            }
            
          )
          .then(() => gridRef.current!.api.onFilterChanged());
      }, []);

 
    //
    return (
        <>


        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <InputGroup style={{width:350}}>
            <Input
            type="text"
            value={searchTerm}
            onChange={(e) => handleFilterChange(e.target.value)}
            />
            <Button onClick={() => gridRef.current!.api.exportDataAsCsv({ onlySelected: false })}>
            Download Filtered Data
            </Button>
        </InputGroup>

        <div className={styles.tabs} style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(statuses).map(([key, displayValue]) => (
            <button
                key={key}
                className={`${styles.tabButton} ${activeTab === key ? styles.active : ""}`}
                onClick={() => handleTabClick(key)}
            >
                {displayValue}
            </button>
            ))}
        </div>
        </div>



            <div style={{ height: "65vh", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <AgGridReact
                theme={myTheme}
                gridOptions={gridOptions}
                ref={gridRef}
                pagination={true}
                rowSelection={"single"}
                paginationPageSize={100}
                rowData={filteredData}
                defaultColDef={{ editable: true, resizable: true }}
                columnDefs={colDefs}
                suppressHorizontalScroll={false}
                suppressMovableColumns={true}
                rowHeight={35}
                headerHeight={25}
                loadingOverlayComponent={loading ? 'agOverlayLoading': null}
                />
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
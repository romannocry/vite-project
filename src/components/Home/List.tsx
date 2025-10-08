import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// register all community modules so AG Grid can render (fixes runtime error #272)
ModuleRegistry.registerModules([AllCommunityModule] as any);
import { Element } from "./types/element";
import { FiEdit, FiUserPlus, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

interface ListProps {
    elements: Element[];
    onNominate?: (id: number) => void;
    onEdit?: (id: number) => void;
    onApprove?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function List({ elements, onNominate, onEdit, onApprove, onDelete }: ListProps) {
    const rowData = elements;
    console.log("List received rows:", rowData?.length, rowData);

    // useCallback so the renderer reference changes when handlers change
    const ActionCell = React.useCallback((props: any) => {
        const id = props.data?.id;
        const validated = !!props.data?.step_validated;
        const iconBtnStyle: React.CSSProperties = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            padding: 0,
            margin: 0,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
        };

        const iconWrapStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center' };

        return (
            <div style={iconWrapStyle}>
                {onEdit && (
                    <button type="button" title="Edit" aria-label="Edit" style={iconBtnStyle} onClick={(e) => { e.stopPropagation(); console.log('ActionCell: Edit clicked', id); setTimeout(() => onEdit(id), 0); }}>
                        <FiEdit size={16} color="#0d6efd" />
                    </button>
                )}
                {onNominate && (
                    <button type="button" title="Nominate" aria-label="Nominate" style={iconBtnStyle} onClick={(e) => { e.stopPropagation(); console.log('ActionCell: Nominate clicked', id); setTimeout(() => onNominate(id), 0); }}>
                        <FiUserPlus size={16} color="#6c757d" />
                    </button>
                )}
                {onApprove && (
                    <button type="button" title={validated ? 'Deny' : 'Approve'} aria-label={validated ? 'Deny' : 'Approve'} style={iconBtnStyle} onClick={(e) => { e.stopPropagation(); console.log('ActionCell: Approve/Deny clicked', id); setTimeout(() => onApprove(id), 0); }}>
                        {validated ? <FiX size={16} color="#dc3545" /> : <FiCheck size={16} color="#198754" />}
                    </button>
                )}
                {/*{onDelete && (
                    <button type="button" title="Delete" aria-label="Delete" style={iconBtnStyle} onClick={(e) => { e.stopPropagation(); console.log('ActionCell: Delete clicked', id); setTimeout(() => onDelete && onDelete(id), 0); }}>
                        <FiTrash2 size={16} color="#dc3545" />
                    </button>
                )}*/}
            </div>
        );
    }, [onEdit, onNominate, onApprove, onDelete]);

        // keep column defs loosely typed to avoid nested typing issues with ag-grid props
        // include ActionCell in the dependency list so column defs are recreated when handlers change
        const columnDefs = useMemo<any[]>(
            () => [
                { field: "id", headerName: "ID", width: 90, cellClass: 'ag-center-cell' },
                { field: "name", headerName: "Name", width: 100, cellStyle: { display: "flex", alignItems: "center" } },
                { field: "role", headerName: "Role", width: 120, cellClass: 'ag-center-cell', cellStyle: { display: "flex", alignItems: "center" } },
                {
                    headerName: "Nominated",
                    valueGetter: (params: any) => (params.data?.nominated ? params.data.nominated.join(', ') : ''),
                    minWidth: 160,
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "Validated",
                    valueGetter: (params: any) => (params.data?.step_validated ? '✅' : '❌'),
                    width: 110,
                    cellClass: 'ag-center-cell',
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "Validated info",
                    valueGetter: (params: any) => (params.data?.validated_by ? `${params.data.validated_by} at ${params.data.validated_at}` : 'N/A'),
                    minWidth: 180,
                    hide: true,
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "Email Sent",
                    valueGetter: (params: any) => (params.data?.step_email_sent ? '✅' : '❌'),
                    width: 110,
                    cellClass: 'ag-center-cell',
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "RSVP",
                    field: 'step_rsvp',
                    width: 120,
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "Booked",
                    valueGetter: (params: any) => (params.data?.step_booked ? '✅' : '❌'),
                    width: 110,
                    cellClass: 'ag-center-cell',
                    cellStyle: { display: "flex", alignItems: "center" }
                },
                {
                    headerName: "Actions",
                    // use the React component directly as the renderer
                    cellRenderer: ActionCell,
                    cellClass: 'ag-center-cell p-2',
                    width: 100,
                    suppressMenu: true,
                    sortable: false,
                    filter: false,
                    pinned: 'left',
                },
            ],
            [ActionCell]
        );

        const defaultColDef = useMemo(() => ({ sortable: true, filter: true, resizable: true }), []);

    const onGridReady = (params: any) => {
        // attempt to autosize columns to fit their content
        try {
            const allColumnIds = params.columnApi.getAllColumns().map((c: any) => c.getColId());
            params.columnApi.autoSizeColumns(allColumnIds);
        } catch (e) {
            // ignore
        }
    };

    return (
        <div>
            <h2>List Compsonent</h2>
            <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
            
                                {/* cast props to any to avoid strict AgGrid typings in this quick integration */}
                                        <AgGridReact
                                            {...({ rowData, columnDefs, defaultColDef, rowSelection: "single", rowHeight:40, onGridReady, pagination:true,paginationSize:50 } as any)}
                                        />
            </div>
        </div>
    );
}
import { useState, useEffect, useMemo } from 'react';
import { dataset, initialSelectivity } from './data';

// AG GRID
import {
    AllCommunityModule,
    ModuleRegistry,
    ClientSideRowModelModule,
} from 'ag-grid-community';
import type {
    GridOptions,
    ColDef,
    CellClassParams,
    ValueFormatterFunc,
} from 'ag-grid-community';
import { themeQuartz, colorSchemeDark, iconSetMaterial } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';

// Register modules
ModuleRegistry.registerModules([
    AllCommunityModule,
    ClientSideRowModelModule,
]);

// Cell renderers
import { StatusCellRenderer } from './cell-renderers/StatusCellRenderer';
import { ActionsCellRenderer } from './cell-renderers/ActionsCellRenderer';
//import styles from './StrategyTable.module.css'; // Import the CSS Module
import './StrategyTable.module.css'

const myTheme = themeQuartz

const gridOptions: GridOptions = {
    theme: myTheme,
    sideBar: true,
    overlayLoadingTemplate: `
    <div class-"ag-overlay-loading-center">
        <div class="spinner"></div>
        <span>Loading...</span>
    </div>
    `,
    overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No rows to show</span>',
}

// Status map for formatting
const statuses = {
    all: 'All',
    active: 'Active',
    paused: 'On Hold',
    outOfStock: 'Out of Stock',
};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
    statuses[value as keyof typeof statuses] ?? '';

function StrategyTable() {
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const theme = useMemo(() => myTheme, []);

    // Unique names (Alice, Bob, etc.)
    const uniqueNames = Array.from(
        new Set(initialSelectivity.map((s) => s.name))
    );

    // Create selection map
    const selectionMap: { [clientId: string]: { [name: string]: boolean } } = {};
    initialSelectivity.forEach(({ id, name }) => {
        if (!selectionMap[id]) selectionMap[id] = {};
        selectionMap[id][name] = true;
    });

    // Transform row data
    const rowData = dataset.map((client) => {
        const row: any = { id: client.id, name: client.name };
        uniqueNames.forEach((name) => {
            if (selectionMap[client.id]?.[name]) {
                row[name] = 'active';
            }
        });
        return row;
    });

    // Column definitions
    useEffect(() => {
        const columns: ColDef[] = [
            //{ field: 'id', headerName: 'ID' },
            { field: 'name', headerName: 'Client Name' },
            { field: 'name', headerName: 'Bernstein Captain' },
            { field: 'name', headerName: 'Intensity' },
            { field: "actions", cellRenderer: ActionsCellRenderer, width: 100 },

            ...uniqueNames.map((name) => ({
                field: name,
                headerName: name,
                width: 100,
                cellRenderer: StatusCellRenderer,
                filter: true,
                filterParams: {
                    valueFormatter: statusFormatter,
                },
                headerClass: 'header-status',
                cellStyle: (params: CellClassParams) => ({
                    backgroundColor: params.value === 'active' ? '#84ca8130' : '',
                }),
            })),
        ];
        setColDefs(columns);
    }, []);

    return (
        <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
            <AgGridReact
                //theme={myTheme}
                gridOptions={gridOptions}
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                rowSelection="single"
                paginationPageSize={100}
                defaultColDef={{ resizable: true }}
                suppressHorizontalScroll={false}
                suppressMovableColumns={true}
                rowHeight={45}
                headerHeight={25}
            />
        </div>
    );
}

export default StrategyTable;


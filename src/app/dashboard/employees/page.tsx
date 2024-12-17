'use client';

import React, { useRef, useState } from "react";
import type { ColDef, GridApi, GridReadyEvent, IGetRowsParams, ValueGetterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface RowData {
    _id: string,
    username: string;
    m_nr: string;
    role: number;
    department: boolean;
    employment_start_date: string;
    employment_end_date: string;
    salary_type: string;
    hourly_rate: number;
    salary: number;
    hours_worked: number;
    bonus: number;
    deduction: number;
    tags: string;
}

// Define the server response type
interface ServerResponse {
    total: number;
    skip: number;
    limit: number;
    items: RowData[];
}

export default function EmployeesPage() {
    const gridApiRef = useRef<GridApi | null>(null);

    const [rowData, setRowData] = useState<RowData[]>([
        {
            username: "Tesla",
            m_nr: "Model Y",
            role: 64950,
            department: true,
            employment_start_date: "start_date",
            employment_end_date: "end_date",
            salary_type: "fixed",
            hourly_rate: 50,
            salary: 50000,
            hours_worked: 40,
            bonus: 500,
            deduction: 100,
            tags: "tags",
            _id: "id",
        },
    ]);

    const [colDefs, setColDefs] = useState<ColDef<RowData>[]>([
        {
            headerName: "Name",
            field: "username",
        },
        {
            headerName: "M-Nr",
            field: "m_nr",
        },
        {
            headerName: "Role",
            field: "role",
        },
        {
            headerName: "Department",
            field: "department",
        },
        {
            headerName: "Employment Start Date",
            field: "employment_start_date",
        },
        {
            headerName: "Employment End Date",
            field: "employment_end_date",
        },
        {
            headerName: "Salary Type",
            field: "salary_type",
        },
        {
            headerName: "Hourly Rate",
            field: "hourly_rate",
        },
        {
            headerName: "Salary",
            field: "salary",

        },
        {
            headerName: "Hours Worked",
            field: "hours_worked",

        },
        {
            headerName: "Bonus",
            field: "bonus",

        },
        {
            headerName: "Deduction",
            field: "deduction",

        },
        {
            headerName: "Tags",
            field: "tags",

        },
    ]);

    const defaultColDef: ColDef = {
        // flex: 1,
    };

    const setDataSource = () => {
        const dataSource = {
            getRows: async (params: IGetRowsParams) => {
                const { startRow, endRow } = params;

                console.log('Requesting rows:', startRow, 'to', endRow);

                try {
                    // Fetch data from server with pagination parameters
                    const response = await axios.get<ServerResponse>(
                        'http://localhost:8000/api/employee',
                        {
                            params: {
                                skip: startRow,                // Start index for pagination
                                limit: endRow - startRow,        // Page size
                            },
                        }
                    );

                    console.log(response.data.items);
                    // Pass rows and total count back to Ag-Grid
                    params.successCallback(response.data.items, response.data.total);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    params.failCallback();
                }
            },
        };

        gridApiRef.current?.setGridOption("datasource", dataSource);
    };

    const onGridReady = (params: GridReadyEvent) => {
        gridApiRef.current = params.api;
        setDataSource();
    }

    return (
        <div className="h-[640px]">
            <AgGridReact
                rowModelType="infinite" // server-side pagination
                columnDefs={colDefs}
                cacheBlockSize={10} // Page size (number of rows per request)
                defaultColDef={defaultColDef}
                maxBlocksInCache={5} // Cache the last 5 pages
                onGridReady={onGridReady} // Callback for grid ready
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 25, 50]}
            />
        </div>
    );
};

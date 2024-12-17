'use client';

import React, { useRef, useState } from "react";
import type { ColDef, GridApi, GridReadyEvent, IGetRowsParams, ValueGetterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { listTags as listAllTags } from "@/services/tagService";
import { listRoles as listAllRoles } from "@/services/roleService";

ModuleRegistry.registerModules([AllCommunityModule]);


interface IColData {
    _id: string,
    username: string;
    m_nr: number;
    role: string;
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

interface RowData {
    _id: string,
    username: string;
    m_nr: number;
    role: string;
    department: boolean;
    employment_start_date: string;
    employment_end_date: string;
    salary_type: string;
    hourly_rate: number;
    salary: number;
    hours_worked: number;
    bonus: number;
    deduction: number;
    tags: string[];
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

    const [colDefs, setColDefs] = useState<ColDef<IColData>[]>([
        {
            headerName: "Name",
            field: "username",
            width: 120,
        },
        {
            headerName: "M-Nr",
            field: "m_nr",
            width: 80,
        },
        {
            headerName: "Role",
            field: "role",
            width: 200,
        },
        {
            headerName: "Department",
            field: "department",
            width: 160,
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
            width: 160,
        },
        {
            headerName: "Hourly Rate",
            field: "hourly_rate",
            width: 120,
        },
        {
            headerName: "Salary",
            field: "salary",
            width: 100,
        },
        {
            headerName: "Hours Worked",
            field: "hours_worked",
            width: 150,
        },
        {
            headerName: "Bonus",
            field: "bonus",
            width: 80,
        },
        {
            headerName: "Deduction",
            field: "deduction",
            width: 120,
        },
        {
            headerName: "Tags",
            field: "tags",
            width: 300,
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
                    const all_tags = await listAllTags();
                    const all_roles = await listAllRoles();

                    const response = await axios.get<ServerResponse>(
                        'http://localhost:8000/api/employee',
                        {
                            params: {
                                skip: startRow,
                                limit: endRow - startRow,
                            },
                        }
                    );
                    const items: IColData[] = [];
                    response.data.items.forEach(element => {
                        let tags: string = "";
                        element.tags.forEach((tag_id, i) => {
                            if (i === 0) {
                                tags = all_tags[tag_id].tag_name;
                            } else {
                                tags += ", " + all_tags[tag_id].tag_name;
                            }
                        });
                        items.push({
                            _id: element._id,
                            username: element.username,
                            m_nr: element.m_nr,
                            role: all_roles[element.role].role_name,
                            department: element.department,
                            employment_start_date: element.employment_start_date,
                            employment_end_date: element.employment_end_date,
                            salary_type: element.salary_type,
                            hourly_rate: element.hourly_rate,
                            salary: element.salary,
                            hours_worked: element.hours_worked,
                            bonus: element.bonus,
                            deduction: element.deduction,
                            tags: tags,
                        });
                    });
                    params.successCallback(items, response.data.total);
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
        <div>
            <div className="text-lg font-medium px-2 py-4">Employees</div>
            <div className="h-[640px]">
                <AgGridReact
                    rowModelType="infinite" // server-side pagination
                    columnDefs={colDefs}
                    cacheBlockSize={10} // Page size (number of rows per request)
                    defaultColDef={defaultColDef}
                    maxBlocksInCache={0} // Cache the last 5 pages
                    onGridReady={onGridReady} // Callback for grid ready
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 25, 50]}
                />
            </div>
        </div>
    );
};

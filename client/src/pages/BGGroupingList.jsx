import { useState, useEffect } from 'react';
import api from '../services/api.js';
import { useNavigate } from "react-router-dom";

import Button from '../components/ui/Button.jsx';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useMemo } from "react";
export default function BGGroupingList() {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    patientName: "",
    patientID: "",
    sampleID: "",
    caseID: "",
    orderNo: "",
    requestType: "",
    requestSubType: "",
    createdDate: "",
    createdTime: ""
  });
  const navigate = useNavigate();


  // Fetch blood requests
  const getBloodRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blood-requests'); // <-- Yaha aapka backend route
      setData(res.data.data || []);
    } catch (err) {
      console.log('Error fetching list', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBloodRequests();
  }, []);



  // --- FILTERED DATA MEMOIZED ---
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const fullName =
        `${item.patientNameF || ""} ${item.patientNameL || ""}`.toLowerCase();

      return (

        item.requestSampleStatus !== 'approve_request' &&   // <--- APPROVED requests HIDE
        fullName.includes(filters.patientName.toLowerCase()) &&
        item.patientIdentifier?.toString().includes(filters.patientID) &&
        item.patientSampleId?.toString().includes(filters.sampleID) &&
        item.caseID?.toLowerCase().includes(filters.caseID.toLowerCase()) &&
        item.orderNo?.toLowerCase().includes(filters.orderNo.toLowerCase()) &&
        item.requestType?.toLowerCase().includes(filters.requestType.toLowerCase()) &&
        item.requestSubType?.toLowerCase().includes(filters.requestSubType.toLowerCase())
      );
    });
  }, [data, filters]);


  // ------------ TABLE COLUMNS DEFINITIONS ----------------
  const columns = [
    {
      header: 'Patient ID',
      accessorKey: 'patientIdentifier',
      cell: info => info.getValue() || '-',
    },
    {
      header: 'Patient Name',
      accessorFn: row =>
        `${row.patientNameF || ''} ${row.patientNameL || ''}`.trim(),
    },
    {
      header: 'Request Time',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => {
        const raw = getValue();
        if (!raw) return "-";

        const date = new Date(raw);

        const formatted = date.toLocaleString("en-IN", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });

        return formatted;
      }
    },

    {
      header: 'caseID',
      accessorKey: 'caseID',
    },
    {
      header: 'orderNO',
      accessorKey: 'orderNo',
    },
    {
      header: 'Sample ID',
      accessorKey: 'patientSampleId',
    },
    {
      header: 'Hospital Name',
      accessorFn: row => row.hospitalDetails?.hospital || '-',
    },

    {
      header: 'Status',
      accessorKey: 'requestSampleStatus',
      cell: info => {
        const val = info.getValue();
        return (
          <span
            className={`px-2 py-1 rounded text-white text-sm ${val === 'pending'
              ? 'bg-orange-500'
              : val === 'approve_request'
                ? 'bg-green-600'
                : val === 'reject_blood_sample'
                  ? 'bg-red-600'
                  : 'bg-gray-500'
              }`}
          >
            {val}
          </span>
        );
      },
    },

    {
      header: 'Action',
      cell: ({ row }) => (
        <Button
          className="px-3 py-1  text-white rounded text-sm"
          onClick={() => navigate(`/serology/bg-grouping-view/${row.original._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // ------------ INITIALIZE TABLE ----------------
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const table = useReactTable({
  //   data: filteredData,
  //   columns,
  //   state: { sorting },
  //   onSortingChange: setSorting,
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Patient Blood Grouping</h1>


      <div className="grid grid-cols-6 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">

        {/* Patient Name */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Patient Name</label>
          <input
            type="text"
            className="border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            value={filters.patientName}
            onChange={(e) => setFilters({ ...filters, patientName: e.target.value })}
          />
        </div>

        {/* Patient ID */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Patient ID</label>
          <input
            type="text"
            className="border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            value={filters.patientID}
            onChange={(e) => setFilters({ ...filters, patientID: e.target.value })}
          />
        </div>

        {/* Sample ID */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Sample ID</label>
          <input
            type="text"
            className="border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            value={filters.sampleID}
            onChange={(e) => setFilters({ ...filters, sampleID: e.target.value })}
          />
        </div>

        {/* Case ID */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Case ID</label>
          <input
            type="text"
            className="border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            value={filters.caseID}
            onChange={(e) => setFilters({ ...filters, caseID: e.target.value })}
          />
        </div>

        {/* Order No */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Order No</label>
          <input
            type="text"
            className="border px-3 py-2 rounded focus:ring focus:ring-blue-200"
            value={filters.orderNo}
            onChange={(e) => setFilters({ ...filters, orderNo: e.target.value })}
          />
        </div>

        {/* Request Type */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Request Type</label>
          <select
            className="border px-3 py-2 rounded bg-white focus:ring focus:ring-blue-200"
            value={filters.requestType}
            onChange={(e) => setFilters({ ...filters, requestType: e.target.value })}
          >
            <option value="">Select Request Type</option>
            <option value="blood_request">Blood Request</option>
            <option value="component_request">Component Request</option>
          </select>
        </div>

        {/* Request Sub Type */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-1">Request Sub Type</label>
          <select
            className="border px-3 py-2 rounded bg-white focus:ring focus:ring-blue-200"
            value={filters.requestSubType}
            onChange={(e) => setFilters({ ...filters, requestSubType: e.target.value })}
          >
            <option value="">Select Sub Type</option>
            <option value="urgent">Urgent</option>
            <option value="regular">Regular</option>
          </select>
        </div>



      </div>





      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="border rounded-lg overflow-hidden shadow-md mt-10">

          {/* TABLE */}
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="py-3 px-4 text-left border-b cursor-pointer"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-2 px-4 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="p-4 flex items-center justify-between bg-gray-50">
            <div>
              <button
                className="px-3 py-1 border rounded mr-2"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </button>
            </div>

            <div>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

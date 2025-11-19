import { useState, useEffect } from "react";
import api from "../services/api.js";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import { AiOutlineEye, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import Swal from "sweetalert2";

export default function HospitalManager() {
    const [data, setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editingHospital, setEditingHospital] = useState(null);

    const [formData, setFormData] = useState({

        HospitalName: "",
        address: "",
        city: "",
        contactNo: "",
        faxNO: "",
        disatanceFormBB: "",
        maintainCreditLegder: true,
        contactDetails: {
            preferedContact: true,
            rmo: true,
            contactPerson: "",
            designation: "",
            mobileNo_1: "",
            phoneNo: "",
            mobileNo_2: "",
            emailID: "",
            remarks: "",
        }

    });

    // fetch hospitals
    const fetchHospitals = async () => {
        try {
            const res = await api.get("/hospital");
            setData(res.data.data);
        } catch (err) {
            console.error("Failed to fetch hospitals:", err);
            Swal.fire({
                title: "Error!",
                text: "Failed to load hospitals",
                icon: "error",
            });
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    // Reset form
    const resetForm = () => {
        setFormData({
            HospitalName: "",
            address: "",
            city: "",
            contactNo: "",
            faxNO: "",
            disatanceFormBB: "",
            maintainCreditLegder: false,

            contactDetails: {
                preferedContact: false,
                rmo: false,
                contactPerson: "",
                designation: "",
                mobileNo_1: "",
                phoneNo: "",
                mobileNo_2: "",
                emailID: "",
                remarks: "",
            }
        });

        setEditingHospital(null);
    };




    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // for nested contactDetails.*  
        if (name.startsWith("contactDetails.")) {
            const key = name.split(".")[1];
            setFormData({
                ...formData,
                contactDetails: {
                    ...formData.contactDetails,
                    [key]: type === "checkbox" ? checked : value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value,
            });
        }
    };


    // form submit for create and update
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingHospital) {
                // Update hospital
                await api.put(`/hospital/${editingHospital._id}`, formData);
                Swal.fire({
                    title: "Success!",
                    text: "Hospital updated successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                // Create hospital
                await api.post('/hospital', formData);
                Swal.fire({
                    title: "Success!",
                    text: "Hospital created successfully.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            fetchHospitals();
            setOpenModal(false);
            resetForm();
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message || "Something went wrong!",
                icon: "error",
            });
        }
    };

    // Handle edit button click
    const handleEdit = (h) => {
        setEditingHospital(h);
        setFormData({
            HospitalName: h.HospitalName || "",
            address: h.address || "",
            city: h.city || "",
            contactNo: h.contactNo || "",
            faxNO: h.faxNO || "",
            disatanceFormBB: h.disatanceFormBB || "",
            maintainCreditLegder: h.maintainCreditLegder ?? true,

            contactDetails: {
                preferedContact: h.contactDetails?.preferedContact ?? true,
                rmo: h.contactDetails?.rmo ?? true,
                contactPerson: h.contactDetails?.contactPerson || "",
                designation: h.contactDetails?.designation || "",
                mobileNo_1: h.contactDetails?.mobileNo_1 || "",
                phoneNo: h.contactDetails?.phoneNo || "",
                mobileNo_2: h.contactDetails?.mobileNo_2 || "",
                emailID: h.contactDetails?.emailID || "",
                remarks: h.contactDetails?.remarks || "",
            }
        });

        setOpenModal(true);
    };


    // Handle delete
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/hospital/${id}`);
                fetchHospitals();
                Swal.fire({
                    title: "Deleted!",
                    text: "Hospital has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err) {
                Swal.fire({
                    title: "Error!",
                    text: err.response?.data?.message || "Failed to delete hospital",
                    icon: "error",
                });
            }
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setOpenModal(false);
        resetForm();
    };

    // table columns
    const columns = [
        {
            header: "Sr No",
            cell: ({ row }) => row.index + 1,
        },

        { accessorKey: "HospitalName", header: "Hospital Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "contactNo", header: "Contact No" },
        { accessorKey: "faxNO", header: "Fax No" },
        { accessorKey: "disatanceFormBB", header: "Distance (KM)" },

        {
            header: "Contact Person",
            accessorFn: (row) => row.contactDetails?.contactPerson || "",
        },

        {
            header: "Mobile",
            accessorFn: (row) => row.contactDetails?.mobileNo_1 || "",
        },

        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3 text-xl">
                    <button className="text-blue-600 hover:text-blue-800">
                        <AiOutlineEye />
                    </button>

                    <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => handleEdit(row.original)}
                    >
                        <AiOutlineEdit />
                    </button>

                    <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(row.original._id)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            ),
        },
    ];


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <div className="p-4 space-y-6">
                {/* ---------- Create Button ---------- */}
                <div className="flex justify-between items-center mb-6 mt-5">
                    <h2 className="text-xl font-semibold">Hospital List</h2>

                    <button
                        onClick={() => {
                            resetForm();
                            setOpenModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                        + Create Hospital
                    </button>
                </div>

                {/* ---------- MODAL ----------- */}
                {openModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    {editingHospital ? "Edit Hospital" : "Create Hospital"}
                                </h2>
                                <button
                                    className="text-red-500 text-xl hover:text-red-700"
                                    onClick={handleCloseModal}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                                {/* Main Fields */}
                                <label className="flex flex-col">
                                    <span>Hospital Name</span>
                                    <input
                                        name="HospitalName"
                                        className="p-2 border rounded"
                                        value={formData.HospitalName}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Address</span>
                                    <input
                                        name="address"
                                        className="p-2 border rounded"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>City</span>
                                    <input
                                        name="city"
                                        className="p-2 border rounded"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Contact No</span>
                                    <input
                                        name="contactNo"
                                        className="p-2 border rounded"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Fax No</span>
                                    <input
                                        name="faxNO"
                                        className="p-2 border rounded"
                                        value={formData.faxNO}
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span>Distance From BB (Km)</span>
                                    <input
                                        name="disatanceFormBB"
                                        className="p-2 border rounded"
                                        value={formData.disatanceFormBB}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="col-span-2 flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        name="maintainCreditLegder"
                                        checked={formData.maintainCreditLegder}
                                        onChange={handleChange}
                                    />
                                    <span>Maintain Credit Ledger</span>
                                </label>

                                {/* Contact Details */}
                                <h3 className="col-span-2 text-lg font-bold mt-3">Contact Details</h3>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="contactDetails.preferedContact"
                                        checked={formData.contactDetails.preferedContact}
                                        onChange={handleChange}
                                    />
                                    <span>Preferred Contact</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="contactDetails.rmo"
                                        checked={formData.contactDetails.rmo}
                                        onChange={handleChange}
                                    />
                                    <span>RMO</span>
                                </label>

                                <label className="flex flex-col">
                                    <span>Contact Person</span>
                                    <input
                                        name="contactDetails.contactPerson"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.contactPerson}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Designation</span>
                                    <input
                                        name="contactDetails.designation"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.designation}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Mobile No 1</span>
                                    <input
                                        name="contactDetails.mobileNo_1"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.mobileNo_1}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Phone No</span>
                                    <input
                                        name="contactDetails.phoneNo"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.phoneNo}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Mobile No 2</span>
                                    <input
                                        name="contactDetails.mobileNo_2"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.mobileNo_2}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Email</span>
                                    <input
                                        name="contactDetails.emailID"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.emailID}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="flex flex-col">
                                    <span>Remarks</span>
                                    <input
                                        name="contactDetails.remarks"
                                        className="p-2 border rounded"
                                        value={formData.contactDetails.remarks}
                                        onChange={handleChange}
                                    />
                                </label>

                                <button className="col-span-2 bg-blue-600 text-white p-2 rounded mt-3">
                                    {editingHospital ? "Update Hospital" : "Create Hospital"}
                                </button>

                            </form>


                        </div>
                    </div>
                )}

                {/* ---------- TABLE ----------- */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-200">
                            {table.getHeaderGroups().map((group) => (
                                <tr key={group.id}>
                                    {group.headers.map((header) => (
                                        <th key={header.id} className="p-3 border text-left font-semibold">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3">
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
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </button>
                        <button
                            className="px-3 py-1 border rounded disabled:opacity-50"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </button>
                    </div>
                    <span className="text-sm text-gray-600">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </span>
                </div>
            </div>
        </>
    );
}
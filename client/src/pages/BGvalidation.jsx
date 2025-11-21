


import React, { useEffect, useMemo, useState, useCallback } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Swal from "sweetalert2";

export default function BGValidation() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        patientName: "",
        patientID: "",
        sampleID: "",
        caseID: "",
        orderNo: "",
        requestType: "",
        requestSubType: ""
    });

    const [validatedBy, setValidatedBy] = useState("");
    const [remarksData, setRemarksData] = useState({});

    // -------------------------
    // SAVE VALIDATION
    // -------------------------
    // const handleUpdate = async () => {
    //     try {
    //         const payload = {

    //             BGValidation: {
    //                 remarks: remarksData,
    //                 validatedBy: validatedBy,
    //                 validatedDate: new Date(),
    //             }

    //         };

    //         await api.put("/blood-grouping/validation", payload);

    //         // SUCCESS alert
    //         Swal.fire({
    //             title: "Success!",
    //             text: "Validation Saved Successfully",
    //             icon: "success",
    //             timer: 1500,
    //             showConfirmButton: false,
    //         });

    //         // 🔥 INSTANT UI UPDATE (NO REFRESH REQUIRED)
    //         await fetchList();  // backend से updated list लाओ (Valid rows हट जाएँगे)

    //     } catch (err) {
    //         console.log(err);

    //         Swal.fire({
    //             title: "Error!",
    //             text: "Error Saving Validation",
    //             icon: "error",
    //         });
    //     }
    // };

const handleUpdate = async () => {
    try {
        const payload = {
            BGValidation: {
                rows: remarksData,  // ← FIXED
                validatedBy: validatedBy,
                validatedDate: new Date(),
            }
        };

        await api.put("/blood-grouping/validation", payload);

        Swal.fire({
            title: "Success!",
            text: "Validation Saved Successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        });

        await fetchList();

    } catch (err) {
        console.log(err);

        Swal.fire({
            title: "Error!",
            text: "Error Saving Validation",
            icon: "error",
        });
    }
};

    // -------------------------
    // FETCH BLOOD GROUPING LIST
    // -------------------------
    const fetchList = async () => {
        try {
            const res = await api.get("/blood-grouping");
            setData(res.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // -------------------------
    // FILTER DATA
    // -------------------------
    const filteredData = useMemo(() => {
        return data
            .filter((item) => item.BGValidation?.validationRemark !== "Valid")   // <-- VALID ROWS REMOVE
            .filter((item) => {
                const p = item.patientID || {};
                const fullName = `${p.patientNameF || ""} ${p.patientNameM || ""} ${p.patientNameL || ""}`.toLowerCase();

                return (
                    (!filters.patientName || fullName.includes(filters.patientName.toLowerCase())) &&
                    (!filters.patientID || p.patientIdentifier?.toString().includes(filters.patientID)) &&
                    (!filters.sampleID || p.patientSampleId?.toString().includes(filters.sampleID)) &&
                    (!filters.caseID || p.caseID?.toLowerCase().includes(filters.caseID.toLowerCase())) &&
                    (!filters.orderNo || p.orderNo?.toLowerCase().includes(filters.orderNo.toLowerCase())) &&
                    (!filters.requestType || p.requestType?.toLowerCase().includes(filters.requestType.toLowerCase())) &&
                    (!filters.requestSubType || p.requestSubType?.toLowerCase().includes(filters.requestSubType.toLowerCase()))
                );
            });
    }, [data, filters]);


    // -------------------------
    // REMARKS HANDLER
    // -------------------------
    const handleRemarkChange = useCallback((id, field, value) => {
        setRemarksData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Patient Group Validation</h2>

            
            {/* FILTERS SECTION */}
            
            <div className="grid grid-cols-6 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
                {[
                    { key: "patientName", label: "Patient Name" },
                    { key: "patientID", label: "Patient ID" },
                    { key: "sampleID", label: "Sample ID" },
                    { key: "caseID", label: "Case ID" },
                    { key: "orderNo", label: "Order No" },
                ].map((f) => (
                    <div key={f.key} className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                        <input
                            type="text"
                            className="border px-3 py-2 rounded"
                            value={filters[f.key]}
                            onChange={(e) => setFilters({ ...filters, [f.key]: e.target.value })}
                        />
                    </div>
                ))}

                {/* Request Type */}
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-600 mb-1">Request Type</label>
                    <select
                        className="border px-3 py-2 rounded bg-white"
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
                        className="border px-3 py-2 rounded bg-white"
                        value={filters.requestSubType}
                        onChange={(e) => setFilters({ ...filters, requestSubType: e.target.value })}
                    >
                        <option value="">Select Sub Type</option>
                        <option value="urgent">Urgent</option>
                        <option value="regular">Regular</option>
                    </select>
                </div>
            </div>

            {/* ------------------------- */}
            {/* SIMPLE HTML TABLE (NO CURSOR JUMP) */}
            {/* ------------------------- */}
            <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border p-2">Sample ID / Patient Name</th>
                        <th className="border p-2">Request Time</th>
                        <th className="border p-2">Confirmed BG</th>
                        <th className="border p-2">Anti A</th>
                        <th className="border p-2">Anti B</th>
                        <th className="border p-2">Anti AB</th>
                        <th className="border p-2">Anti D1</th>
                        <th className="border p-2">Anti D2</th>
                        <th className="border p-2">A Cell</th>
                        <th className="border p-2">B Cell</th>
                        <th className="border p-2">O Cell</th>
                        <th className="border p-2">BG Remarks / VALIDATION/REMARKS</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((item) => {
                        const p = item.patientID;
                        const id = item._id;

                        const remark = remarksData[id]?.remark || "";
                        const note = remarksData[id]?.note || "";

                        return (
                            <tr key={id} className="border">
                                {/* NAME */}
                                <td className="border p-2">
                                    {p?.patientSampleId} /{" "}
                                    {p?.patientNameF} {p?.patientNameM} {p?.patientNameL}
                                </td>

                                {/* TIME */}
                                <td className="border p-2">
                                    {new Date(item.createdAt).toLocaleString("en-IN")}
                                </td>

                                {/* BG */}
                                <td className="border p-2 text-center">
                                    {item.bloodGroup?.confirmedBG || "-"}
                                </td>

                                {/* Forward group */}
                                <td className="border p-2 text-center">{item.forwardGroupTests?.anti_A || "-"}</td>
                                <td className="border p-2 text-center">{item.forwardGroupTests?.anti_B || "-"}</td>
                                <td className="border p-2 text-center">{item.forwardGroupTests?.anti_AB || "-"}</td>
                                <td className="border p-2 text-center">{item.forwardGroupTests?.anti_D1 || "-"}</td>
                                <td className="border p-2 text-center">{item.forwardGroupTests?.anti_D2 || "-"}</td>

                                {/* Reverse group */}
                                <td className="border p-2 text-center">{item.reverseGroupTests?.a_Cell || "-"}</td>
                                <td className="border p-2 text-center">{item.reverseGroupTests?.b_Cell || "-"}</td>
                                <td className="border p-2 text-center">{item.reverseGroupTests?.o_Cell || "-"}</td>

                                {/* Remark + Note */}
                                <td className="border p-2">
                                    <select
                                        className="border p-1 rounded mb-2 w-full"
                                        value={remark}
                                        onChange={(e) =>
                                            handleRemarkChange(id, "remark", e.target.value)
                                        }
                                    >
                                        <option value="">Select</option>
                                        <option value="Valid">Valid</option>
                                        <option value="Invalid">Invalid</option>
                                    </select>

                                    <textarea
                                        className="border p-1 rounded w-full"
                                        rows={2}
                                        value={note}
                                        onChange={(e) =>
                                            handleRemarkChange(id, "note", e.target.value)
                                        }
                                    ></textarea>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>


            {/* VALIDATION FOOTER */}

            <div className="mt-5 flex justify-between items-center">
                <div className="flex gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Validated By</label>
                        <select
                            className="border rounded px-7 py-2 text-sm"
                            value={validatedBy}
                            onChange={(e) => setValidatedBy(e.target.value)}
                        >
                            <option value="">Select Validated By</option>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">Current Date</label>
                        <input
                            type="text"
                            value={new Date().toISOString().split("T")[0]}
                            readOnly
                            className="border rounded px-3 py-2 text-sm bg-gray-100"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button className="px-8" onClick={handleUpdate}>
                        Update
                    </Button>
                    <Button className="px-8">Exit</Button>
                </div>
            </div>
        </div>
    );
}


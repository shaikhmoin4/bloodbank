
import React from "react";
import { useEffect, useCallback, useState, useMemo } from "react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Swal from "sweetalert2";
export default function ABValidationList() {
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

    const handleRemarkChange = useCallback((id, field, value) => {
        setRemarksData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    }, []);
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

    const handleUpdate = async () => {
        try {
            const payload = {
                ABValidation: {
                    rows: remarksData,  // ← FIXED
                    validatedBy: validatedBy,
                    validatedDate: new Date(),
                }
            };

            await api.put("/blood-grouping/ab-validation", payload);

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

    const filteredData = useMemo(() => {
        return data
            .filter((item) => item.BGValidation?.validationRemark === "Valid")
            // AB Screening must be done
            .filter((item) => item.ABScreening?.testedBy)

            // ❌ Already validated AB records should not appear
            .filter((item) => !item.ABValidation?.validationRemark)

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

    return (
        <>

            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">AB Validation List</h2>

                <div className="grid grid-cols-6 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">

                    {[
                        { key: "patientName", label: "Patient Name" },
                        { key: "patientID", label: "Patient ID" },
                        { key: "sampleID", label: "Sample ID" },
                        { key: "caseID", label: "Case ID" },
                        { key: "orderNo", label: "Order No" },
                    ].map((f) => (
                        <div key={f.key} className="flex flex-col">
                            <label className="text-xs font-semibold text-gray-600 mb-1">
                                {f.label}
                            </label>
                            <input
                                type="text"
                                className="border px-3 py-2 rounded"
                                value={filters[f.key]}
                                onChange={(e) =>
                                    setFilters({ ...filters, [f.key]: e.target.value })
                                }
                            />
                        </div>
                    ))}

                    {/* Request Type */}
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-gray-600 mb-1">Request Type</label>
                        <select
                            className="border px-3 py-2 rounded bg-white"
                            value={filters.requestType}
                            onChange={(e) =>
                                setFilters({ ...filters, requestType: e.target.value })
                            }
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
                            onChange={(e) =>
                                setFilters({ ...filters, requestSubType: e.target.value })
                            }
                        >
                            <option value="">Select Sub Type</option>
                            <option value="urgent">Urgent</option>
                            <option value="regular">Regular</option>
                        </select>
                    </div>
                </div>




                <table className="w-full border-collapse mt-4">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2">Sample ID</th>
                            <th className="border p-2">Patient ID</th>
                            <th className="border p-2">Patient Name</th>
                            <th className="border p-2">Tested By</th>
                            <th className="border p-2">Screeing type</th>
                            <th className="border p-2">AB Cell1</th>
                            <th className="border p-2">AB Cell2</th>
                            <th className="border p-2">AB Cell3</th>
                            <th className="border p-2">AB Cell4</th>
                            <th className="border p-2">AB Status</th>
                            <th className="border p-2">AB Screeing Remarks / VALIDATION/REMARKS</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((item) => {
                            const p = item.patientID || {};
                            return (
                                <tr key={item._id}>
                                    <td className="border p-2">{p.patientSampleId}</td>
                                    <td className="border p-2">{p.patientIdentifier}</td>
                                    <td className="border p-2">{p.patientNameF} {p.patientNameM} {p.patientNameL}</td>
                                    <td className="border p-2">{item.ABScreening?.testedBy}</td>
                                    <td className="border p-2">{item.ABScreening?.threeCell}</td>
                                    <td className="border p-2">{item.ABScreening?.antiBody_1}</td>
                                    <td className="border p-2">{item.ABScreening?.antiBody_2}</td>
                                    <td className="border p-2">{item.ABScreening?.antiBody_3}</td>
                                    <td className="border p-2">{item.ABScreening?.antiBody_4}</td>
                                    <td className="border p-2">{item.ABScreening?.antiBodyStatus}</td>
                                    <td className="border p-2">

                                        <select
                                            className="border p-1 rounded mb-2 w-full"
                                            value={remarksData[item._id]?.remark || ""}
                                            onChange={(e) =>
                                                handleRemarkChange(item._id, "remark", e.target.value)
                                            }
                                        >
                                            <option value="">Select</option>
                                            <option value="Valid">Valid</option>
                                            <option value="Invalid">Invalid</option>
                                        </select>

                                        <textarea
                                            className="border p-1 rounded w-full"
                                            value={remarksData[item._id]?.note || ""}
                                            onChange={(e) =>
                                                handleRemarkChange(item._id, "note", e.target.value)
                                            }
                                        ></textarea>

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>


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
        </>
    )
}
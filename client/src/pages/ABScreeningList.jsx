import { useNavigate } from "react-router-dom";
import api from "../services/api";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../components/ui/Button";
export default function ABScreeningList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        patientName: "",
        patientID: "",
        sampleID: "",
        caseID: "",
        orderNo: "",
        requestType: "",
        requestSubType: ""
    });

    // Fetch AB Screening List
    const fetchList = async () => {
        try {
            const res = await api.get("/blood-grouping"); // <-- same API
            setData(res.data.data);
            console.log(res.data);

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // -----------------------------
    // FILTER — Only Valid + User Filters
    // -----------------------------
    const filteredData = useMemo(() => {
        return data
            .filter((item) => item.BGValidation?.validationRemark === "Valid")
            // 🛑 AB Screening already done → Do not show in list
            .filter((item) => !item.ABScreening?.testedBy)
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Anti Body Screening (Patient)</h2>

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


            <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                    <tr>

                        <th className="border p-2">Sample ID</th>
                        <th className="border p-2">Patient ID</th>
                        <th className="border p-2">Patient Name</th>
                        <th className="border p-2">Confirmed BG</th>
                        <th className="border p-2">Age</th>
                        <th className="border p-2">Gender</th>
                        <th className="border p-2">Request time</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((item) => {
                        const p = item.patientID || {};

                        return (
                            <tr key={item._id} className="border">

                                <td className="border p-2">{p.patientSampleId}</td>

                                <td className="border p-2">{p.patientIdentifier}</td>

                                {/* Patient Name */}
                                <td className="border p-2">
                                    {p.patientNameF} {p.patientNameM} {p.patientNameL}
                                </td>

                                {/* Confirmed BG */}
                                <td className="border p-2">{item.bloodGroup?.confirmedBG || "-"}</td>




                                {/* Validation Note */}
                                <td className="border p-2">{item.patientID.age || "-"}</td>

                                {/* Validated By */}
                                <td className="border p-2">{item.patientID.gender}</td>

                                {/* Date */}
                                <td className="border p-2">
                                    {item.patientID?.requestDateTime
                                        ? new Date(item.patientID?.requestDateTime).toLocaleString("en-IN")
                                        : "-"}
                                </td>

                                <td className="border p-2 px-6">
                                    <Button
                                        className="px-4 py-1"
                                        onClick={() => navigate(`/serology/ab-screening/view/${item._id}`)}
                                    >
                                        View
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

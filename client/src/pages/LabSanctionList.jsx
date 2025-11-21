import React from "react";
import api from '../services/api.js';
import { useEffect, useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/ui/Button.jsx";
export default function LabSanctionList() {
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

    const navigate = useNavigate();

    const fetchList = async () => {
        try {
            const res = await api.get("/blood-grouping");
            setData(res.data.data);
            console.log(res.data);

            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const filteredData = useMemo(() => {
        return data
            .filter((item) => item.BGValidation?.validationRemark === "Valid")
            // AB Screening must be done
            .filter((item) => item.ABScreening?.testedBy)

            // ❌ Already validated AB records should not appear
            // .filter((item) => !item.ABValidation?.validationRemark)

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
                <h2 className="text-xl font-bold mb-4">Blood Request Sanction</h2>
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




                <table className="w-full border mt-4">
                    <thead className="bg-gray-200">
                        <tr>


                            <th className="border p-2">Sample ID</th>
                            <th className="border p-2">Patient ID</th>

                            <th className="border p-2">Request Time</th>
                            <th className="border p-2">Patient Name</th>
                            <th className="border p-2">Tested BG</th>
                            <th className="border p-2">Silde BG</th>
                            <th className="border p-2">Request Type</th>
                            <th className="border p-2">Hospital Name</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((item) => {
                            const p = item.patientID || {};

                            return (
                                <tr key={item._id}>

                                    <td className="border p-2">{p.patientSampleId || "-"}</td>
                                    <td className="border p-2">{p.patientIdentifier || "-"}</td>

                                    <td className="border p-2">
                                        {p.requestDateTime ? new Date(p.requestDateTime).toLocaleString() : "-"}
                                    </td>


                                    <td className="border p-2">
                                        {(p.patientNameF || "") + " " + (p.patientNameM || "") + " " + (p.patientNameL || "")}
                                    </td>

                                    <td className="border p-2">{item.bloodGroup?.confirmedBG || "-"}</td>

                                    {/*  spealing change kiya hai */}
                                    <td className="border p-2">{p.orderNos || "-"}</td>

                                    <td className="border p-2">{p.requestType || "-"}</td>

                                    <td className="border p-2">
                                        {p.hospitalDetails?.hospital || "-"}
                                    </td>
                                    <td className="border p-2">
                                        <Button onClick={() => navigate(`/reception/lab-sanction/view/${item._id}`)}>
                                            View
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

            </div>
        </>
    )
}
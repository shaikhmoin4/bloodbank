import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function LabSanctionView() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/blood-grouping/${id}`);
            setItem(res.data.data);
            setLoading(false);
            console.log(res.data);

        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, []);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!item) return <p className="p-4">No Data Found</p>;

    const p = item.patientID || {};

    return (
        <div className="p-6">

            <h2 className="text-xl font-bold mb-4">Blood Request Sanction</h2>

            <div className="bg-white shadow p-4 rounded grid grid-cols-2 gap-4">

                <div>
                    <label className="font-semibold">Patient Name:</label>
                    <p>{p.patientNameF} {p.patientNameM} {p.patientNameL}</p>
                </div>

                <div>
                    <label className="font-semibold">Patient ID:</label>
                    <p>{p.patientIdentifier}</p>
                </div>

                <div>
                    <label className="font-semibold">Sample ID:</label>
                    <p>{p.patientSampleId}</p>
                </div>

                <div>
                    <label className="font-semibold">Request Time:</label>
                    <p>{p.requestDateTime ? new Date(p.requestDateTime).toLocaleString() : "-"}</p>
                </div>

                <div>
                    <label className="font-semibold">Blood Group (Tested):</label>
                    <p>{item.bloodGroup?.confirmedBG || "-"}</p>
                </div>

                <div>
                    <label className="font-semibold">Request Type:</label>
                    <p>{p.requestType}</p>
                </div>

                <div>
                    <label className="font-semibold">Hospital:</label>
                    <p>{p.hospitalDetails?.hospital}</p>
                </div>

                <div>
                    <label className="font-semibold">BG Validation Remark:</label>
                    <p>{item.BGValidation?.validationRemark}</p>
                </div>

                <div>
                    <label className="font-semibold">AB Screening Tested By:</label>
                    <p>{item.ABScreening?.testedBy || "-"}</p>
                </div>

            </div>

            <table className="w-full border mt-4">
                <thead className="bg-gray-200">
                    <tr>
                        <th>Sr. No.</th>
                        <th>Component</th>
                        <th>Delivery Time</th>
                        <th>Demond</th>
                        <th>Refused</th>
                        <th>TR</th>
                        <th>NAT Tested</th>
                        <th>Senction Qty</th>
                        <th>Priority 1</th>
                        <th>Priority 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">{p.requestComponents?.component}</td>
                        <td className="border p-2">13/04</td>
                        <td className="border p-2">{p.requestComponents?.quantity}</td>
                        <td className="border p-2"></td>
                        <td className="border p-2"></td>

                    </tr>
                </tbody>
            </table>

        </div>
    );
}

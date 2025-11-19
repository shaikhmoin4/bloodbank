import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
export default function ABScreeningView() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form fields
    const [formData, setFormData] = useState({
        screeningResult: "",
        remarks: "",
        testedBy: "",
        antiBodyStatus:"",
        auto:""

    });

    // Fetch specific record details
    const fetchDetails = async () => {
        try {
            const res = await api.get(`/blood-grouping/${id}`);
            setDetails(res.data.data);
            console.log(res.data);

            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!details) return <p className="p-4">No details found</p>;

    const p = details.patientID || {};

    // Handle Form Submit
    const handleSubmit = async () => {
        try {
            await api.put(`/blood-grouping/ab-screening/${id}`, formData);

            alert("AB Screening Updated Successfully!");
        } catch (err) {
            console.log(err);
            alert("Error updating!");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">AB Screening View</h2>

            {/* ------- Patient Details Card -------- */}
            
            <div className="bg-gray-100 p-4 rounded border mb-6">
                <h3 className="text-lg font-semibold mb-3">Patient Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>Sample ID:</strong> {p.patientSampleId}</div>
                    <div><strong>Patient Name:</strong> {p.patientNameF} {p.patientNameM} {p.patientNameL}</div>
                    <div><strong>Age:</strong> {p.age}</div>
                    <div><strong>Gender:</strong> {p.gender}</div>
                    <div><strong>Case ID:</strong> {p.caseID}</div>
                    <div><strong>Order No:</strong> {p.orderNo}</div>
                    {/* <div><strong>Confirmed BG:</strong> {details.bloodGroup?.confirmedBG || "-"}</div> */}
                    <div><strong>Validation Remark:</strong> {details.validationRemark}</div>
                    <div><strong>Validated By:</strong> {details.validatedBy}</div>
                    <div><strong>Date:</strong> {new Date(details.validatedDate).toLocaleString("en-IN")}</div>
                </div>
            </div>



            {/* ---------------- FORM SECTION ---------------- */}
            <div className="bg-white p-4 rounded border">
                <h3 className="text-lg font-semibold mb-4">AB Screening Form</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-sm font-medium">Three Cell</label>
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={formData.screeningResult}
                            onChange={(e) => setFormData({ ...formData, screeningResult: e.target.value })}
                        >
                            <option value="">Select Three Cell</option>
                            <option value="ABScreening">AB Screening</option>
                            <option value="OneCell">One Cell</option>
                            <option value="ThreeCell">Three Cell</option>
                            <option value="FourCell">Four Cell</option>
                            <option value="N/A">N/A</option>
                            <option value="SixCell">Six Cell</option>
                            <option value="ElevenCell">Eleven Cell</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Tested By</label>
                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-full"
                            placeholder="Tested By"
                            value={formData.testedBy}
                            onChange={(e) => setFormData({ ...formData, testedBy: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">AntiBody Status</label>
                        <input
                            type="text"
                            className="border px-3 py-2 rounded w-full"
                            placeholder="AntiBody Status"
                            value={formData.antiBodyStatus}
                            onChange={(e) => setFormData({ ...formData, antiBodyStatus: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Auto</label>
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={formData.auto}
                            onChange={(e) => setFormData({ ...formData, auto: e.target.value })}
                        >
                            <option value="">Select Auto</option>
                            
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-sm font-medium">Remarks</label>
                    <textarea
                        rows={3}
                        className="border px-3 py-2 rounded w-full" 
                        value={formData.remarks}
                        onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    ></textarea>
                </div>


                <div className="flex gap-3 mt-4 justify-end">

                    <Button className="px-10 py-2">
                        Save
                    </Button>
                    <Button className="px-10 py-2">
                        Cancel
                    </Button>
                    <Button className=" px-10 py-2">
                        Exit
                    </Button>
                </div>



            </div>
        </div>
    );
}

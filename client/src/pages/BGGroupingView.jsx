import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function BGGroupingView() {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const [form, setForm] = useState({
        bloodGroup_method: "",
        bloodGroup_confirmedBG: "",
        bloodGroup_forwardGroup: "",
        bloodGroup_reverseGroup: "",

        forward_anti_A: "",
        forward_anti_B: "",
        forward_anti_AB: "",
        forward_anti_D1: "",
        forward_anti_D2: "",
        forward_antiA1: "",
        forward_anti_H: "",

        weakD_IgG_M: "",
        weakD_IgG_M_2: "",
        weakD_IgG: "",

        reverse_a_Cell: "",
        reverse_b_Cell: "",
        reverse_o_Cell: "",

        antigen_status_check: "",
        antigen_status_allow: "",

        testedBy: "",
        remarks: ""
    });

    const updateForm = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const getDetails = async () => {
        try {
            const res = await api.get(`/blood-requests/${id}`);
            setDetails(res.data.data);
        } catch (error) {
            console.log("Error loading details", error);
        } finally {
            setLoading(false);
        }
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
        const response = await api.post(`/blood-grouping/${id}`, form);

        if (response.data.success) {
            alert("Blood grouping result saved successfully!");

            // RESET FORM
            setForm({
                bloodGroup_method: "",
                bloodGroup_confirmedBG: "",
                bloodGroup_forwardGroup: "",
                bloodGroup_reverseGroup: "",

                forward_anti_A: "",
                forward_anti_B: "",
                forward_anti_AB: "",
                forward_anti_D1: "",
                forward_anti_D2: "",
                forward_antiA1: "",
                forward_anti_H: "",

                weakD_IgG_M: "",
                weakD_IgG_M_2: "",
                weakD_IgG: "",

                reverse_a_Cell: "",
                reverse_b_Cell: "",
                reverse_o_Cell: "",

                antigen_status_check: "",
                antigen_status_allow: "",

                testedBy: "",
                remarks: ""
            });
        }

    } catch (error) {
        console.error("Error saving blood grouping:", error);
        alert("Error saving blood grouping result");
    } finally {
        setFormLoading(false);
    }
};


    useEffect(() => {
        getDetails();
    }, [id]);

    if (loading) return <div className="p-6">Loading...</div>;
    if (!details) return <div className="p-6">No data found!</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Blood Grouping Test
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Perform blood grouping and compatibility testing
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${formLoading ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                            <span className="text-sm text-gray-500">
                                {formLoading ? 'Processing...' : 'Form Ready'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Patient Information Card */}
                <Card
                    title="Patient Information"
                    subtitle="Patient details and sample information"
                    icon={
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    }
                    className="w-full mb-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Patient Name
                            </label>
                            <p className="text-gray-900 font-medium">
                                {details.patientNameF} {details.patientNameL}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Patient ID
                            </label>
                            <p className="text-gray-900">{details.patientIdentifier}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>
                            <p className="text-gray-900">{details.gender}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <p className="text-gray-900">{details.dateOfBirth?.slice(0, 10)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Age
                            </label>
                            <p className="text-gray-900">{details.age} {details.ageType}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sample Type
                            </label>
                            <p className="text-gray-900">{details.sampleType}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sample ID
                            </label>
                            <p className="text-gray-900">{details.patientSampleId}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prescribed BG
                            </label>
                            <p className="text-gray-900">{details.prescribedSlideBG}</p>
                        </div>
                    </div>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Blood Group Section */}
                    <Card
                        title="Blood Group"
                        subtitle="Blood grouping methodology and results"
                        icon={
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        }
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Method
                                </label>
                                <select
                                    value={form.bloodGroup_method}
                                    onChange={(e) => updateForm("bloodGroup_method", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">-- select method --</option>
                                    <option value="CAT">CAT</option>
                                    <option value="TUBE">TUBE</option>
                                </select>


                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmed BG
                                </label>
                                <select
                                    value={form.bloodGroup_confirmedBG}
                                    onChange={(e) => updateForm("bloodGroup_confirmedBG", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">-- Confirmed BG --</option>
                                    <option value="A+ve">A +ve</option>
                                    <option value="B+ve">B +ve</option>
                                    <option value="O+ve">O +ve</option>
                                    <option value="AB+ve">AB +ve</option>
                                    <option value="A-ve">A -ve</option>
                                    <option value="B-ve">B -ve</option>
                                    <option value="O-ve">O -ve</option>
                                    <option value="AB-ve">AB -ve</option>
                                    <option value="A Du +ve">A Du +ve</option>
                                </select>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Forward Group
                                </label>
                                <input
                                    name="bloodGroup_forwardGroup"
                                    value={form.bloodGroup_forwardGroup}
                                    onChange={(e) => updateForm("bloodGroup_forwardGroup", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    type="text"
                                    placeholder="Forward group"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reverse Group
                                </label>
                                <input
                                    name="bloodGroup_reverseGroup"
                                    value={form.bloodGroup_reverseGroup}
                                    onChange={(e) => updateForm("bloodGroup_reverseGroup", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    type="text"
                                    placeholder="Reverse group"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Reverse Group */}
                        <Card
                            title="Forward Grouping"
                            subtitle="Forward blood grouping results"
                            icon={
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            }
                            className="w-full"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { key: "forward_anti_A", label: "Anti A" },
                                    { key: "forward_anti_B", label: "Anti B" },
                                    { key: "forward_anti_AB", label: "Anti AB" },
                                    { key: "forward_anti_D1", label: "Anti D1" },
                                    { key: "forward_anti_D2", label: "Anti D2" },
                                    { key: "forward_antiA1", label: "Anti A1" },
                                    { key: "forward_anti_H", label: "Anti H" },
                                ].map((item) => (
                                    <div key={item.key}>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {item.label}
                                        </label>
                                        <input
                                            name={item.key}
                                            value={form[item.key]}
                                            onChange={(e) => updateForm(item.key, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Right Column - Weak D & Reverse Group */}
                        <div className="space-y-6">
                            {/* Weak D */}
                            <Card
                                title="Weak D"
                                subtitle="Weak D testing results"
                                icon={
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            IgG+M
                                        </label>
                                        <input
                                            name="weakD_IgG_M"
                                            value={form.weakD_IgG_M}
                                            onChange={(e) => updateForm("weakD_IgG_M", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            IgG+M(2)
                                        </label>
                                        <input
                                            name="weakD_IgG_M_2"
                                            value={form.weakD_IgG_M_2}
                                            onChange={(e) => updateForm("weakD_IgG_M_2", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            IgG
                                        </label>
                                        <input
                                            name="weakD_IgG"
                                            value={form.weakD_IgG}
                                            onChange={(e) => updateForm("weakD_IgG", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </Card>

                            {/* Reverse Group */}
                            <Card
                                title="Reverse Grouping"
                                subtitle="Reverse blood grouping results"
                                icon={
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                }
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            A Cell
                                        </label>
                                        <input
                                            name="reverse_a_Cell"
                                            value={form.reverse_a_Cell}
                                            onChange={(e) => updateForm("reverse_a_Cell", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            B Cell
                                        </label>
                                        <input
                                            name="reverse_b_Cell"
                                            value={form.reverse_b_Cell}
                                            onChange={(e) => updateForm("reverse_b_Cell", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            O Cell
                                        </label>
                                        <input
                                            name="reverse_o_Cell"
                                            value={form.reverse_o_Cell}
                                            onChange={(e) => updateForm("reverse_o_Cell", e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Full Width Sections */}
                    <div className="space-y-6">


                        {/* Additional Information */}
                        <Card
                            title="Additional Information"
                            subtitle="Testing personnel and remarks"
                            icon={
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            }
                            className="w-full"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tested By
                                    </label>
                                    <select
                                        value={form.testedBy}
                                        onChange={(e) => updateForm("testedBy", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="">-- Select Tester --</option>
                                        <option value="moin">moin</option>
                                        <option value="nilesh">nilesh</option>
                                        <option value="hashim">hashim</option>
                                    </select>


                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remarks
                                    </label>
                                    <textarea
                                        name="remarks"
                                        value={form.remarks}
                                        onChange={(e) => updateForm("remarks", e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                        rows={3}
                                        placeholder="Additional notes or observations"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="antigen_status_check"
                                            name="antigen_status_check"
                                            checked={form.antigen_status_check === "true" || form.antigen_status_check === true}
                                            onChange={(e) => updateForm("antigen_status_check", e.target.checked ? "true" : "false")}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="antigen_status_check" className="block text-sm font-medium text-gray-700">
                                            Check Antigenic Status
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="antigen_status_allow"
                                            name="antigen_status_allow"
                                            checked={form.antigen_status_allow === "true" || form.antigen_status_allow === true}
                                            onChange={(e) => updateForm("antigen_status_allow", e.target.checked ? "true" : "false")}
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="antigen_status_allow" className="block text-sm font-medium text-gray-700">
                                            Allow Retest
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                                Please review all test results before submitting
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={formLoading}
                                    className="px-8"
                                >
                                    Save Grouping Result
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
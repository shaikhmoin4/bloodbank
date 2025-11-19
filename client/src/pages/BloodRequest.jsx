import React, { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import api from '../services/api.js';
import { useNavigate, useParams } from 'react-router-dom';
const BloodRequest = () => {


  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    // Patient / Request main details
    requestType: '',
    requestSubType: '',
    patientIdentifier: '',
    dateOfBirth: '',
    prescribedSlideBG: '',
    age: '',
    ageType: 'Unknown',
    gender: 'Unknown',
    patientNameF: '',
    patientNameM: '',
    patientNameL: '',
    sampleType: '',
    patientSampleId: '',
    sampleQty: '',
    clinicalDiagnosis: '',
    otherText: '',
    transfusionIndication: '',

    // Hospital details
    hospitalDetails: {
      hospital: '',
      doctor: '',
      department: '',
      hospitalIPNo: '',
      sanctionReceiptNo: '',
      wardRoomBedNo: ''
    },

    // Request components
    requestComponents: [],

    // Relative / Visitor
    relativeDetails: {
      relativeName: '',
      mobileNo: '',
      address: ''
    },
    visitorBoy: '',

    // Remark / status
    remark: '',
    requestSampleStatus: 'pending',

    // Charges & rate
    charges: {
      cmCharge: 0,
      productCharge: 0,
      nat: 0,
      total: 0,
      rateMasterRef: ''
    }
  });

  // Load data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadBloodRequest();
    }
  }, [id]);


  const loadBloodRequest = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/blood-requests${id}`);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error loading blood request:', error);
      alert('Error loading blood request data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      if (isEditMode) {
        response = await api.put(`/blood-requests/${id}`, formData);
      } else {
        response = await api.post('/blood-requests', formData);
      }

      if (response.data.success) {
        alert(`Blood request ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/reception/blood-requests');
      }
    } catch (error) {
      console.error('Error saving blood request:', error);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} blood request: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Blood Request' : 'Blood Request'}
              </h1>
              <p className="mt-2 text-gray-600">
                {isEditMode ? 'Update patient record' : 'Add new patient record for blood bank management'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${
                loading ? 'bg-yellow-500' : 'bg-green-500'
              }`}></div>
              <span className="text-sm text-gray-500">
                {loading ? 'Processing...' : 'Form Ready'}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient / Request Details - Full Width */}
          <Card
            title="Patient Details"
            subtitle="Basic patient information and request details"
            icon={
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            className="w-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type <span className=' text-red-700'>*</span>
                </label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Request Type</option>
                  <option value="blood_request">Blood Request</option>
                  <option value="component_request">Component Request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Sub Type <span className=' text-red-700'>*</span>
                </label>
                <select
                  name="requestSubType"
                  value={formData.requestSubType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Select Sub Type</option>
                  <option value="urgent">Urgent</option>
                  <option value="regular">Regular</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Identifier
                </label>
                <input
                  type="text"
                  name="patientIdentifier"
                  value={formData.patientIdentifier}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. PI25-02794"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescribed/Slide BG <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="prescribedSlideBG"
                  value={formData.prescribedSlideBG}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Type <span className=' text-red-700'>*</span>
                </label>
                <select
                  name="ageType"
                  value={formData.ageType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Y">Years</option>
                  <option value="M">Months</option>
                  <option value="D">Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className=' text-red-700'>*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="patientNameF"
                  value={formData.patientNameF}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="patientNameM"
                  value={formData.patientNameM}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="patientNameL"
                  value={formData.patientNameL}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Type <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="sampleType"
                  value={formData.sampleType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Sample ID <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="patientSampleId"
                  value={formData.patientSampleId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample Quantity
                </label>
                <input
                  type="number"
                  name="sampleQty"
                  value={formData.sampleQty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                />
              </div>

              <div className="md:col-span-3 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Diagnosis
                </label>
                <textarea
                  name="clinicalDiagnosis"
                  value={formData.clinicalDiagnosis}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Text
                </label>
                <input
                  type="text"
                  name="otherText"
                  value={formData.otherText}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfusion Indication <span className=' text-red-700'>*</span>
                </label>
                <input
                  type="text"
                  name="transfusionIndication"
                  value={formData.transfusionIndication}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </Card>

          {/* Two Column Layout for Other Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Hospital Details */}
              <Card
                title="Hospital Details"
                subtitle="Hospital and medical professional information"
                icon={
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital <span className=' text-red-700'>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.hospital}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'hospital', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Doctor <span className=' text-red-700'>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.doctor}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'doctor', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.department}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital IP No
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.hospitalIPNo}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'hospitalIPNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sanction Receipt No
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.sanctionReceiptNo}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'sanctionReceiptNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ward/Room/Bed No
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalDetails.wardRoomBedNo}
                      onChange={(e) => handleNestedInputChange('hospitalDetails', 'wardRoomBedNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Request Components */}
              <Card
                title="Request Components"
                subtitle="Blood components required for transfusion"
                icon={
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                className="w-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Blood Components</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          requestComponents: [
                            ...prev.requestComponents,
                            { component: '', quantity: 0, volume: '', no: '' }
                          ]
                        }));
                      }}
                    >
                      Add Component
                    </Button>
                  </div>

                  {formData.requestComponents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No components added yet. Click "Add Component" to add blood components.</p>
                  ) : (
                    <div className="space-y-4">
                      {formData.requestComponents.map((component, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium text-gray-700">Component #{index + 1}</h4>
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => {
                                const newComponents = formData.requestComponents.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, requestComponents: newComponents }));
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Component <span className=' text-red-700'>*</span>
                              </label>
                              <select
                                value={component.component}
                                onChange={(e) => {
                                  const newComponents = [...formData.requestComponents];
                                  newComponents[index].component = e.target.value;
                                  setFormData(prev => ({ ...prev, requestComponents: newComponents }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              >
                                <option value="">Select Component</option>
                                <option value="PRBC">PRBC</option>
                                <option value="Platelets">Platelets</option>
                                <option value="FFP">FFP</option>
                                <option value="Cryoprecipitate">Cryoprecipitate</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quantity <span className=' text-red-700'>*</span>
                              </label>
                              <input
                                type="number"
                                value={component.quantity}
                                onChange={(e) => {
                                  const newComponents = [...formData.requestComponents];
                                  newComponents[index].quantity = parseInt(e.target.value) || 0;
                                  setFormData(prev => ({ ...prev, requestComponents: newComponents }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                min="0"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Volume
                              </label>
                              <input
                                type="text"
                                value={component.volume}
                                onChange={(e) => {
                                  const newComponents = [...formData.requestComponents];
                                  newComponents[index].volume = e.target.value;
                                  setFormData(prev => ({ ...prev, requestComponents: newComponents }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="e.g. 350 ml"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                No <span className=' text-red-700'>*</span>
                              </label>
                              <input
                                type="text"
                                value={component.no}
                                onChange={(e) => {
                                  const newComponents = [...formData.requestComponents];
                                  newComponents[index].no = e.target.value;
                                  setFormData(prev => ({ ...prev, requestComponents: newComponents }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.requestComponents.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No components added yet. Click "Add Component" to add blood components.</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Relative Details */}
              <Card
                title="Relative Details"
                subtitle="Contact information for patient's relatives"
                icon={
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relative Name
                    </label>
                    <input
                      type="text"
                      value={formData.relativeDetails.relativeName}
                      onChange={(e) => handleNestedInputChange('relativeDetails', 'relativeName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile No
                    </label>
                    <input
                      type="tel"
                      value={formData.relativeDetails.mobileNo}
                      onChange={(e) => handleNestedInputChange('relativeDetails', 'mobileNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.relativeDetails.address}
                      onChange={(e) => handleNestedInputChange('relativeDetails', 'address', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visitor Boy
                    </label>
                    <input
                      type="text"
                      name="visitorBoy"
                      value={formData.visitorBoy}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </Card>

              {/* Charges */}
              <Card
                title="Charges"
                subtitle="Billing and rate information"
                icon={
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                className="w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CM Charge
                    </label>
                    <input
                      type="number"
                      value={formData.charges.cmCharge}
                      onChange={(e) => handleNestedInputChange('charges', 'cmCharge', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Charge
                    </label>
                    <input
                      type="number"
                      value={formData.charges.productCharge}
                      onChange={(e) => handleNestedInputChange('charges', 'productCharge', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NAT
                    </label>
                    <input
                      type="number"
                      value={formData.charges.nat}
                      onChange={(e) => handleNestedInputChange('charges', 'nat', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total
                    </label>
                    <input
                      type="number"
                      value={formData.charges.total}
                      onChange={(e) => handleNestedInputChange('charges', 'total', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="md:col-span-3 lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rate Master Ref
                    </label>
                    <input
                      type="text"
                      value={formData.charges.rateMasterRef}
                      onChange={(e) => handleNestedInputChange('charges', 'rateMasterRef', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Full Width Section */}
          <div className="space-y-6">
            {/* Remark */}
            <Card
              title="Additional Information"
              subtitle="Remarks and request status"
              icon={
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              className="w-full"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark
                  </label>
                  <textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Sample Status
                  </label>
                  <select
                    name="requestSampleStatus"
                    value={formData.requestSampleStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approve_request">Approve Request</option>
                    <option value="approve_and_keep_pending">Approve and Keep Pending</option>
                    <option value="reject_blood_sample">Reject Blood Sample</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Please review all information before submitting
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
                  loading={loading}
                  className="px-8"
                >
                  Save Patient Record
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BloodRequest;
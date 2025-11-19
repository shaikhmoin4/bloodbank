import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

const Sidebar = ({ isOpen, onSidebarToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      )
    },
    {
      name: 'Reception',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      dropdown: [
        { name: 'Patient History', path: '/patient-history' },
        { name: 'Blood Request', path: '/reception/blood-request' },
        { name: 'BOTS Blood Request', path: '/reception/bots-blood-request' },
        { name: 'Stand Alone BOTS Request', path: '/reception/stand-alone-bots-request' },
        { name: 'Lab Sanction', path: '/reception/lab-sanction' },
        { name: 'CrossMatch Billing', path: '/reception/crossmatch-billing' },
        { name: 'Final Billing', path: '/reception/final-billing' },
        { name: 'Disease Registration', path: '/reception/disease-registration' },
        { name: 'Thalesemia Donor Allocation', path: '/reception/thalesemia-donor-allocation' },
        { name: 'VisitorBoy Dashboard', path: '/reception/visitorboy-dashboard' }
      ]
    },
    {
      name: 'Account & Cashier',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      dropdown: [
        { name: 'Cash Voucher', path: '/account-cashier/cash-voucher' },
        { name: 'Cash Voucher Validation', path: '/account-cashier/cash-voucher-validation' },
        { name: 'Patient Credit - Payment', path: '/account-cashier/patient-credit-payment' },
        { name: 'Hospital Credit Bill - Creation', path: '/account-cashier/hospital-credit-bill-creation' },
        { name: 'Hospital Credit Bill - Payment', path: '/account-cashier/hospital-credit-bill-payment' },
        { name: 'Bill Refund', path: '/account-cashier/bill-refund' },
        { name: 'VBD Refund', path: '/account-cashier/vbd-refund' },
        { name: 'Patient Payment Search', path: '/account-cashier/patient-payment-search' },
        { name: 'Payment Recovery Edit', path: '/account-cashier/payment-recovery-edit' },
        { name: 'Loan Credit Bill - Creation', path: '/account-cashier/loan-credit-bill-creation' },
        { name: 'Loan Recovery', path: '/account-cashier/loan-recovery' },
        { name: 'Monthly Invoice', path: '/account-cashier/monthly-invoice' },
        { name: 'Monthly Invoice BBO Approve', path: '/account-cashier/monthly-invoice-bbo-approve' },
        { name: 'Monthly Invoice Approve', path: '/account-cashier/monthly-invoice-approve' },
        { name: 'Monthly Invoice View Details', path: '/account-cashier/monthly-invoice-view-details' },
        { name: 'CA', path: '/account-cashier/ca' }
      ]
    },
    {
      name: 'Inward',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
      ),
      dropdown: [
        { name: 'Blood Bag Inward - Camp', path: '/inward/blood-bag-inward-camp' },
        { name: 'Loan Inward', path: '/inward/loan-inward' }
      ]
    },
    {
      name: 'Donor',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      dropdown: [
        { name: 'Donor Registration(Camp)', path: '/donor/donor-registration-camp' },
        { name: 'Donor Registration(Inhouse)', path: '/donor/donor-registration-inhouse' },
        { name: 'Camp Deferred', path: '/donor/camp-deferred' },
        { name: 'Donor Delete', path: '/donor/donor-delete' },
        { name: 'Donor Counselor', path: '/donor/donor-counselor' },
        { name: 'Donor Deferred (Post Donation)', path: '/donor/donor-deferred-post-donation' },
        { name: 'Donor Relative Detail', path: '/donor/donor-relative-detail' },
        { name: 'Donor Registration - Edit', path: '/donor/donor-registration-edit' },
        { name: 'Donor Adverse Reaction', path: '/donor/donor-adverse-reaction' },
        { name: 'Donor DCT', path: '/donor/donor-dct' },
        { name: 'Therapeutic Phlebotomy', path: '/donor/therapeutic-phlebotomy' },
        { name: 'Donor Auto DCT', path: '/donor/donor-auto-dct' },
        { name: 'Donor Club', path: '/donor/donor-club' },
        { name: 'Pre Donor Registration', path: '/donor/pre-donor-registration' }
      ]
    },
    {
      name: 'Camp',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      dropdown: [
        { name: 'Organiser Registration', path: '/camp/organiser-registration' },
        { name: 'Camp Registration', path: '/camp/camp-registration' },
        { name: 'Organiser Validation', path: '/camp/organiser-validation' },
        { name: 'Pre Camp Site Inspection', path: '/camp/pre-camp-site-inspection' },
        { name: 'Camp Duty', path: '/camp/camp-duty' },
        { name: 'Post Camp Details', path: '/camp/post-camp-details' },
        { name: 'Organiser V/s Camp Search', path: '/camp/organiser-vs-camp-search' },
        { name: 'Donor IDs', path: '/camp/donor-ids' }
      ]
    },
    {
      name: 'Serology',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      dropdown: [
        {
          name: 'Patient BG & Ab Screening',
          dropdown: [
            { name: 'BG Grouping', path: '/serology/bg-grouping-list' },
            { name: 'BG Validation', path: '/serology/bg-validation' },
            { name: 'BG Grouping Abnormal', path: '/serology/bg-grouping-abnormal' },
            { name: 'Auto BG', path: '/serology/auto-bg' },
            { name: 'BG Retest First Issue', path: '/serology/bg-retest-first-issue' },
            { name: 'BG Retest First Issue Abnormal', path: '/serology/bg-retest-first-issue-abnormal' },
            { name: 'AB Screening', path: '/serology/ab-screening-list' },
            { name: 'AB Screening - Retest', path: '/serology/ab-screening-retest' },
            { name: 'AB Validation', path: '/serology/ab-validation' },
            { name: 'Auto AB Screening', path: '/serology/auto-ab-screening' },
            { name: 'Antibody Identification', path: '/serology/antibody-identification' },
            { name: 'Antibody Titer', path: '/serology/antibody-titer' }
          ]
        },

        { name: 'Bag Allocation', path: '/serology/cross-matching' },
        { name: 'Issue', path: '/serology/direct-coombs-test' },
        { name: 'Manual Bag Issue', path: '/serology/cross-matching' },
        { name: 'BC Pooled', path: '/serology/direct-coombs-test' },
        { name: 'Retrun Form Issue', path: '/serology/cross-matching' },
        { name: 'Transfusion Adverse Reaction', path: '/serology/direct-coombs-test' },
        { name: 'Patient DCT', path: '/serology/cross-matching' },
        { name: 'Patient Sample Rejection', path: '/serology/direct-coombs-test' },
        { name: 'Blood Request / Sample Approve', path: '/serology/cross-matching' },
        { name: 'Patient Auto DCT', path: '/serology/direct-coombs-test' }
      ]
    },
    {
      name: 'Quarantine',
      path: '/quarantine',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Component',
      path: '/component',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'QC',
      path: '/qc',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Admin',
      path: '/admin',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'History',
      path: '/history',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Loan',
      path: '/loan',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Store',
      path: '/store',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Utilities',
      path: '/utilities',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Configuration',
      path: '/configuration',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'BIS Module',
      path: '/bis-module',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      name: 'Web 2.0',
      path: '/web-2-0',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      name: 'Donor Call Center',
      path: '/donor-call-center',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    {
      name: 'Master',
      path: '/master',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      name: 'BI Orders',
      path: '/bi-orders',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'Edit Module',
      path: '/edit-module',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )
    },
    {
      name: 'Contact US',
      path: '/contact-us',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Donor Self Check',
      path: '/donor-self-check',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Strides Support',
      path: '/strides-support',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Add Hospital',
      path: '/create-hospitals',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V10a2 2 0 012-2h10a2 2 0 012 2v11M9 14h6M12 11v6M8 6h8M10 3h4" />
        </svg>
      )
    },
    {
      name: 'Branch Module',
      path: '/branch-module',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M18 8a3 3 0 11-3-3 3 3 0 013 3z" />
          <path d="M6 16a3 3 0 11-3-3 3 3 0 013 3z" />
          <path d="M15 11.5c-1.5 0-4.5-.5-6 1.5-1.2 1.6-1 4 1 5.5" />
          <path d="M12 9c0 1.5 1.5 2 3 2" />
        </svg>
      )
    },
    {
      name: 'Role & Permissions',
      path: '/roles-permissions',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
  ];

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLinkClick = (path) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onSidebarToggle();
    }
    if (path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Recursive function to render menu items with unlimited nesting
  const renderMenuItems = (items, level = 0) => {
    return items.map((item, index) => {
      const isActive = item.path ? location.pathname === item.path : false;
      const isOpen = openMenus[item.name];
      const hasDropdown = item.dropdown && item.dropdown.length > 0;
      const uniqueKey = `${item.name}-${level}-${index}`;

      // Calculate padding based on level for visual indentation
      const paddingLeft = 12 + (level * 16);

      if (hasDropdown) {
        return (
          <li key={uniqueKey} className="rounded-lg">
            <button
              onClick={() => toggleMenu(item.name)}
              className={`flex items-center justify-between gap-3 p-3 w-full rounded-lg text-left transition-all duration-200 group ${isOpen ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
                }`}
              style={{ paddingLeft: `${paddingLeft}px` }}
            >
              <span className="flex items-center gap-3">
                {level === 0 && (
                  <div className={`flex-shrink-0 ${isOpen ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
                    }`}>
                    {item.icon}
                  </div>
                )}
                <span className={`font-medium ${isOpen ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
                  }`}>
                  {item.name}
                </span>
              </span>
              {isOpen ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
            </button>

            {isOpen && (
              <ul className="mt-1 space-y-1">
                {renderMenuItems(item.dropdown, level + 1)}
              </ul>
            )}
          </li>
        );
      }

      return (
        <li
          key={uniqueKey}
          className={`rounded-lg ${isActive ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50 hover:text-red-600"
            }`}
        >
          <button
            onClick={() => {
              if (item.name === 'Logout') {
                handleLogout();
              } else {
                handleLinkClick(item.path);
              }
            }}
            className="flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all duration-200 group"
            style={{ paddingLeft: `${paddingLeft}px` }}
          >
            {level === 0 && (
              <div className={`flex-shrink-0 ${isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
                }`}>
                {item.icon}
              </div>
            )}
            <span className={`font-medium ${isActive ? 'text-red-600' : 'text-gray-700 group-hover:text-red-600'
              }`}>
              {item.name}
            </span>
          </button>
        </li>
      );
    });
  };

  // Auto open menus if child path matches (supports multiple levels)
  useEffect(() => {
    const findAndOpenParents = (items, currentPath, parentNames = []) => {
      items.forEach(item => {
        if (item.path === currentPath && parentNames.length > 0) {
          // Open all parent menus
          parentNames.forEach(parentName => {
            setOpenMenus(prev => ({ ...prev, [parentName]: true }));
          });
        }

        if (item.dropdown) {
          // Recursively check nested dropdowns
          findAndOpenParents(item.dropdown, currentPath, [...parentNames, item.name]);
        }
      });
    };

    findAndOpenParents(menuItems, location.pathname);
  }, [location.pathname]);

  return (
    <aside
      className={`bg-white text-black h-screen fixed top-0 left-0 overflow-y-auto transform transition-transform duration-300 z-40 shadow-lg ${isOpen ? "translate-x-0 w-64" : "-translate-x-full"
        }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Blood Flow 360</h1>
              <p className="text-xs text-gray-500">Blood Bank</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-3">
          {renderMenuItems(menuItems)}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
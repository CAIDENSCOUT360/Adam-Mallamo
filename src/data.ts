import { LLCConfig, ComplianceTask, SecureDocument, LedgerTransaction, AccountingIntegration } from "./types";

export const initialLLC: LLCConfig = {
  companyName: "Integrated Avodah LLC",
  state: "Delaware",
  formationDate: "2026-01-15",
  ein: "98-7654321",
  status: "Active",
  managementStyle: "Member-Managed",
  businessType: "Social Enterprise & Professional Consulting",
  einStatus: "Obtained",
  members: [
    {
      id: "m1",
      name: "Scout Yeshua",
      role: "Managing Member",
      percentage: 60,
      capital: 15000,
      signedAgreement: true,
    },
    {
      id: "m2",
      name: "Chava Bernstein",
      role: "Member",
      percentage: 40,
      capital: 10000,
      signedAgreement: true,
    }
  ],
};

export const initialComplianceTasks: ComplianceTask[] = [
  {
    id: "ct1",
    title: "Delaware 2026 Franchise Tax Payment",
    dueDate: "2026-06-30",
    state: "Delaware",
    category: "Franchise Tax",
    status: "Pending",
    fee: 300,
    description: "Annual franchise tax required by the Delaware Division of Corporations to maintain active good standing.",
  },
  {
    id: "ct2",
    title: "Delaware LLC Annual Report Filing",
    dueDate: "2026-06-30",
    state: "Delaware",
    category: "State Filing",
    status: "Pending",
    fee: 50,
    description: "Annual informational report verifying physical principal office address and current active managers.",
  },
  {
    id: "ct3",
    title: "IRS Form 1065 Partnership Tax Filing",
    dueDate: "2027-03-15",
    state: "Federal Tax",
    category: "Federal Tax",
    status: "Pending",
    fee: 0,
    description: "Annual informational return to report income, deductions, gains, losses from Multi-Member LLC partnership operations.",
  },
  {
    id: "ct4",
    title: "Registered Agent Renewal (Integrated Avodah LLC)",
    dueDate: "2026-10-15",
    state: "Delaware",
    category: "Registered Agent",
    status: "Completed",
    fee: 125,
    description: "Annual service fee extension for Delaware Registered Agent coverage to securely log incoming legal process.",
  },
  {
    id: "ct5",
    title: "Municipal Business License Renewal",
    dueDate: "2026-12-31",
    state: "Local City",
    category: "City License",
    status: "Pending",
    fee: 150,
    description: "Local town operational permit required of professional consulting operations.",
  },
];

export const initialDocuments: SecureDocument[] = [
  {
    id: "doc1",
    name: "Delaware_Articles_of_Organization_Stamped.txt",
    category: "Formation Documents",
    uploadDate: "2026-01-16",
    size: "12 KB",
    isSigned: true,
    aiReviewed: true,
    summary: `### **Intelligent LLC formation Review:**
- **Entity Type:** Domestic Limited Liability Company (LLC)
- **State of Incorporation:** Delaware
- **Incorporation Date:** January 15, 2026
- **Authorized Agent:** Delaware Standard Registered Agent LLC
- **Status:** Officially Filed and Approved.
- **Key Highlight:** The legal jurisdiction is strictly set as Delaware. Requires annual report filings and Delaware franchise tax validation to guarantee active entity certification.`,
    content: `State of Delaware
Certificate of Formation of Limited Liability Company

1. Name: Integrated Avodah LLC
2. Registered Office: 1209 North Orange Street, Wilmington, County of New Castle, DE 19801
3. Registered Agent: Delaware Standard Registered Agent LLC
4. Purpose: To engage in any lawful act or activity for which limited liability companies may be organized under the Delaware Limited Liability Company Act.
5. In Witness Whereof, the undersigned has executed this Certificate of Formation this 15th day of January, 2026.

Filed by: Scout Yeshua, Organizer.`,
  },
  {
    id: "doc2",
    name: "Integrated_Avodah_LLC_Operating_Agreement_Draft.txt",
    category: "Operating Agreements",
    uploadDate: "2026-01-18",
    size: "45 KB",
    isSigned: true,
    aiReviewed: false,
    content: `OPERATING AGREEMENT
of
INTEGRATED AVODAH LLC
(A Delaware Limited Liability Company)

This Operating Agreement is made and entered into as of January 18, 2026, by and among Scout Yeshua and Chava Bernstein (collectively the "Members").

ARTICLE I: ORGANIZATION
1.1 Formation. The Members have formed a Limited Liability Company under the Delaware LLC Act.
1.2 Name. The name of the LLC is Integrated Avodah LLC.
1.3 Tax Classification. The company shall be classified as a Partnership for state and federal corporate tax purposes.

ARTICLE II: CAPITAL CONTRIBUTIONS & MEMBERSHIP
2.1 Capital. Scout Yeshua contributes $15,000 for a 60% membership interest. Chava Bernstein contributes $10,000 for a 40% membership interest.

ARTICLE III: DIRECTORS & GOVERNANCE
3.1 Management. Single and joint member approvals are required for transactions exceeding $5,000. Under Section 18-402, standard management is Member-Managed.`,
  },
  {
    id: "doc3",
    name: "IRS_EIN_Confirmation_Form_CP575.txt",
    category: "State Notices",
    uploadDate: "2026-01-20",
    size: "18 KB",
    isSigned: false,
    aiReviewed: true,
    summary: `### **Intelligent tax document analysis:**
- **Document Model:** IRS CP575 Notice (EIN Issuance)
- **Employer Identification Number (EIN):** 98-7654321, officially designated for INTEGRATED AVODAH LLC.
- **Effective Tax Rate Structure:** Partnership Mode (Form 1065 filing is due by the 15th day of the third month following the close of the taxpayer's tax year).
- **Compliance Alert:** Ensure EIN is configured correctly in all payroll services and general ledger tools.`,
    content: `Department of the Treasury
Internal Revenue Service
Cincinnati, OH 45999-0023

Notice Date: January 20, 2026
Employer Identification Number: 98-7654321
Form: CP575

INTEGRATED AVODAH LLC
SCOUT YESHUA ASSOC
1209 NORTH ORANGE STREET
WILMINGTON, DE 19801

WE ASSIGNED YOU AN EMPLOYER IDENTIFICATION NUMBER (EIN).
Your EIN is 98-7654321. Use this number on all business tax returns and files you send to us.`,
  },
  {
    id: "doc4",
    name: "DEDICATION_OF_SELF_GOVERNMENT.txt",
    category: "Other",
    uploadDate: "2026-06-15",
    size: "2.8 KB",
    isSigned: true,
    aiReviewed: true,
    summary: `### **Covenant and Self-Government Charter Review:**
- **Declaration:** Solemn dedication of the Integrated Avodah Community to righteous self-government.
- **Key Philosophy:** Seamlessly blends spiritual devotion with practical, righteous corporate governance.
- **Methodology:** The "Nine Levels of Order Mastery" establishing complete domain, spiritual, and tactical sovereignty.
- **Divine Blessings:** Formally seeks Yahweh's infinite wisdom, protection, and direction for organizational leaders, allied nations, and our defense/security unit to safeguard corporate endeavors.`,
    content: `DEDICATION OF SELF-GOVERNMENT & INTEGRATED COVENANT
INTEGRATED AVODAH LLC

PREAMBLE
We, the leadership and members of Integrated Avodah LLC, hereby establish this solemn Sovereign Dedication and Covenant of Self-Government. We declare our fundamental devotion to conducting all affairs under the supreme law of Yahweh, seeking His divine light, protection, and wisdom to guide our community and enterprises in righteous stewardship.

SECTION I: BLENDING DEVOTION WITH GOVERNANCE
This covenant seals our corporate commitment to merge spiritual fidelity with meticulous practical governance. Every business contract, legal transaction, and administrative act must reflect absolute integrity, fairness, and noble honor, honoring our sacred duty of righteous service.

SECTION II: THE NINE LEVELS OF ORDER MASTERY
1. Level 1: Personal Sovereignty & Spiritual Alignment (Fidelity to Yahweh)
2. Level 2: Command of the Tongue & Noble Speech (Truth, integrity & non-wavering honor)
3. Level 3: Sanctification of the Household (Healthy family & interior family protection structures)
4. Level 4: Absolute Financial Stewardship & Just Weights (Sovereign ledger accuracy, no usury)
5. Level 5: Contractual Fidelity & Legal Command (Vigilant state compliance & covenantal honor)
6. Level 6: Strategic Alliances & Diplomatic Counsel (Venerable partnerships with righteous nations)
7. Level 7: Tactical Security & Defensive Fortitude (Defending our borders, property, and sacred codes)
8. Level 8: Philanthropy & Community Elevating (Righteous charity & active uplifting)
9. Level 9: Sovereign Domain Integrity & Ultimate Legacy (Establishing multi-generational light)

SECTION III: BLESSINGS AND PROTECTION
We invoke the abundant blessings of Yahweh upon:
- Our visionaries, leaders, and elders, that they may be endowed with King Solomon’s judicial wisdom.
- Our allied nations and strategic partners.
- Our active defense and security unit, praying that Yahweh stands as a shield and fortress against all encroachment, giving us swift strategic superiority, absolute fortitude, and perpetual peace.

So established, adopted, and signed this 15th day of June, 2026.
Lead Organizer: Scout Yeshua
Co-Organizer: Chava Bernstein`
  },
];

export const initialTransactions: LedgerTransaction[] = [
  {
    id: "tx1",
    date: "2026-01-15",
    description: "Delaware Division of Corporations - Formation Filing Fee",
    amount: 110.0,
    type: "expense",
    category: "Formation Fees",
    refNum: "REF-00101",
  },
  {
    id: "tx2",
    date: "2026-01-16",
    description: "Corporate Legal Counsel - Setup Consultation",
    amount: 450.0,
    type: "expense",
    category: "Legal & Professional",
    refNum: "REF-00102",
  },
  {
    id: "tx3",
    date: "2026-02-01",
    description: "Client Revenue Paid - Business Consulting Retainer",
    amount: 7200.0,
    type: "income",
    category: "Revenue",
    refNum: "REF-00201",
  },
  {
    id: "tx4",
    date: "2026-02-15",
    description: "Annual Registered Agent Services LLC Support",
    amount: 125.0,
    type: "expense",
    category: "Registered Agent Fees",
    refNum: "REF-00205",
  },
  {
    id: "tx5",
    date: "2026-03-01",
    description: "Client Revenue Paid - Milestone 1 Technical Strategy",
    amount: 8800.0,
    type: "income",
    category: "Revenue",
    refNum: "REF-00301",
  },
  {
    id: "tx6",
    date: "2026-03-10",
    description: "Integrated Avodah Compliance Portal Hosting Subscription",
    amount: 49.0,
    type: "expense",
    category: "Software Subscription",
    refNum: "REF-00342",
  },
  {
    id: "tx7",
    date: "2026-04-12",
    description: "Legal Suite Drafting Software License Charge",
    amount: 180.0,
    type: "expense",
    category: "Software Subscription",
    refNum: "REF-00405",
  },
  {
    id: "tx8",
    date: "2026-05-02",
    description: "Office Depot - Administrative Paper and Supplies",
    amount: 74.5,
    type: "expense",
    category: "Office Supplies",
    refNum: "REF-00511",
  },
  {
    id: "tx9",
    date: "2026-05-15",
    description: "LinkedIn Corporate Hiring Campaign Ads",
    amount: 320.0,
    type: "expense",
    category: "Advertising",
    refNum: "REF-00588",
  },
];

export const initialIntegrations: AccountingIntegration[] = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    logo: "QB",
    status: "Disconnected",
    lastSynced: "Never",
  },
  {
    id: "xero",
    name: "Xero Portal",
    logo: "X",
    status: "Disconnected",
    lastSynced: "Never",
  },
  {
    id: "freshbooks",
    name: "FreshBooks Classic",
    logo: "FB",
    status: "Disconnected",
    lastSynced: "Never",
  },
];

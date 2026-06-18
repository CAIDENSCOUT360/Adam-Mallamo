export interface Member {
  id: string;
  name: string;
  role: "Member" | "Manager" | "Managing Member";
  percentage: number;
  capital: number;
  signedAgreement: boolean;
}

export type LLCStatus = "Active" | "Pending Filing" | "Delinquent" | "Dissolved";

export interface LLCConfig {
  companyName: string;
  state: string;
  formationDate: string;
  ein: string;
  status: LLCStatus;
  managementStyle: "Member-Managed" | "Manager-Managed";
  businessType: string;
  members: Member[];
  einStatus: "Obtained" | "In Progress" | "Not Applied";
}

export interface ComplianceTask {
  id: string;
  title: string;
  dueDate: string;
  state: string;
  category: "State Filing" | "Franchise Tax" | "Federal Tax" | "Registered Agent" | "City License";
  status: "Pending" | "Completed" | "Overdue";
  fee: number;
  description: string;
}

export interface SecureDocument {
  id: string;
  name: string;
  category: "Formation Documents" | "Operating Agreements" | "Tax Returns" | "State Notices" | "Other";
  uploadDate: string;
  size: string;
  isSigned: boolean;
  aiReviewed: boolean;
  summary?: string;
  content: string; // Plaintext representation of contents for simulation
}

export interface LedgerTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category:
    | "Revenue"
    | "Formation Fees"
    | "Legal & Professional"
    | "Registered Agent Fees"
    | "Software Subscription"
    | "Office Supplies"
    | "Advertising"
    | "State Tax / Franchise Fee"
    | "Other";
  refNum: string;
}

export type IntegrationStatus = "Disconnected" | "Connecting" | "Connected" | "Syncing";

export interface AccountingIntegration {
  id: "quickbooks" | "xero" | "freshbooks";
  name: string;
  logo: string;
  status: IntegrationStatus;
  lastSynced: string;
}


export type LeadStatus =  | "new"  | "contacted"  | "qualified"  | "lost";

export interface ILeadPayload {
  name: string;
  email: string;
  phone?: string | null;
  status?: LeadStatus;
}

export interface ILeadRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: LeadStatus;
  createdAt: string;
}

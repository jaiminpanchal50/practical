export type LeadStatus = "new" | "contacted" | "qualified" | "lost";


export interface ICreateLeadPayload {
    name: string;
    email: string;
    phone?: string;
    status?: LeadStatus;
}

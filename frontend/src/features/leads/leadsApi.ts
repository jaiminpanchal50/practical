import api from "../../lib/axiosInstance";
import type { ICreateLeadPayload,LeadStatus } from "../../types/lead.types";

export interface GetLeadsParams {
    search?: string;
    status?: LeadStatus;
    offset?: number;
}

export async function fetchLeadsApi(params: GetLeadsParams = {}) {
    const res = await api.get("/leads", { params });
    return res.data;
}

export async function fetchLeadByIdApi(id: string | number) {
    const res = await api.get(`/leads/${id}`);
    return res.data.lead;
}

export async function createLeadApi(data: ICreateLeadPayload) {
    const res = await api.post("/leads", data);
    return res.data.lead;
}

export async function updateLeadStatusApi(id: string | number, status: LeadStatus) {
    const res = await api.patch(`/leads/${id}`, { status });
    return res.data.lead;
}

export async function deleteLeadApi(id: string | number) {
    await api.delete(`/leads/${id}`);
}

export async function fetchLeadNotesApi(leadId: string | number) {
    const res = await api.get(`/leads/${leadId}/notes`);
    return res.data.notes;
}

export async function createLeadNoteApi(leadId: string | number, content: string) {
    const res = await api.post(`/leads/${leadId}/notes`, { content });
    return res.data.note;
}

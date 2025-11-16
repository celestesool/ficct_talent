import { apiService } from "./api";

export const interviewService = {
  scheduleInterview: async (applicationId, payload) => {
    return await apiService.patch(`/applications/${applicationId}/status`, {
      status: "INTERVIEW",
      notes: `Interview scheduled for ${payload.datetime}`
    });
  }
};

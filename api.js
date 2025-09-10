// api.js
let mockReports = [];

export async function submitReport(report) {
  report.id = mockReports.length + 1;
  report.status = 'Submitted';
  report.created_at = new Date().toISOString();
  mockReports.push(report);
  return report;
}

export async function getUserReports(userId) {
  return mockReports.filter(r => r.userId === userId);
}

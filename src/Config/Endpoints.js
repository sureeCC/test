import { baseUrl } from "./index";

export const loginEndpoint = baseUrl + "auth/login";
export const logoutEndpoint = baseUrl + "auth/logout";
export const projectsEndpoint = baseUrl + "projects";
export const testersEndPoint = baseUrl + "tester/";
export const userDetailsEndPoint = baseUrl + "tester/userDetails ";
export const rolesEndPoint = baseUrl + "tester/roles";
export const tenantRegistrationEndPoint = baseUrl + "registration/";
export const testerProjectsEndPoint = projectsEndpoint + "/tester/projects";
export const assignProjectEndpoint = testersEndPoint + "assign-project";
export const apiKeyEndpoint = baseUrl + "credentials/";
export const forgotPasswordEndPoint = baseUrl + "auth/forgot-password";
export const tenantsEndPoint = baseUrl + "tenants";
export const buildsEndpoint = baseUrl + "builds/";
export const runsEndpoint = baseUrl + "runs/";
export const manualLaunchesEndpoint = baseUrl + "manuallaunches/";
export const automationLaunches = baseUrl + "automationlaunches/";
export const defects = baseUrl + "defects/";
export const apiMatrixEndPoint = baseUrl + "apimatrix/";
export const permissions = baseUrl + "permissions/";
export const capabilities = baseUrl + "permissions/capabilities/";
export const sprintsEndPoint = baseUrl + "sprints/";
export const activitiesEndPoint = baseUrl + "activities/";
export const activityListEndpoint = baseUrl + "activity-lists/";

export const projectEndpoint = (projectId) => {
  return baseUrl + "projects/" + projectId;
};

export const testRecordsEndPoint = (launchId) => {
  return baseUrl + "testcases/" + launchId;
};

export const deActivateUser = (userId) => {
  return testersEndPoint + userId;
};

export const updateProfile = (userId) => {
  return testersEndPoint + userId + "/update-profile";
};

export const assignedProjectsEndpoint = (testerId) => {
  return testersEndPoint + "assignments/" + testerId;
};

export const unAssignProjectEndpoint = (testerId, projectId) => {
  return testersEndPoint + testerId + "/unassign-project/" + projectId;
};

export const activateUserEndpoint = (testerId) => {
  return testersEndPoint + "/activate/" + testerId;
};

export const unAssignedProjects = (testerId) => {
  return baseUrl + "/tester/unassigned-projects/" + testerId;
};

export const deleteLink = (projectId, linkId) => {
  return baseUrl + "/projects/" + projectId + "/delete-link/" + linkId;
};

export const addLink = (projectId) => {
  return baseUrl + "/projects/" + projectId + "/add-link/";
};
export const verifyTokenEndPoint = (token) => {
  return baseUrl + "auth/verifyResetToken/" + token;
};

export const changePasswordEndPoint = (token) => {
  return baseUrl + "auth/reset-password/" + token;
};

export const updateTesterEndPoint = (userId) => {
  return baseUrl + "tester/update/" + userId;
};

export const verifyDomainEndPoint = (domain) => {
  return baseUrl + "registration/verify-domain/" + domain;
};

export const uploadLogoEndPoint = (tenantId) => {
  return baseUrl + "tenants/" + tenantId + "/upload-logo";
};

export const putTenantsEndPoint = (tenantId) => {
  return baseUrl + "tenants/" + tenantId;
};

export const projectUsersEndPoint = (projectId) => {
  return baseUrl + "tester/project-users/" + projectId;
};

export const getBuildsEndPoint = (projectId) => {
  return buildsEndpoint + projectId;
};
export const getAllBuildsEndPoint = (projectId) => {
  return buildsEndpoint + projectId + "/allBuilds";
};
export const getBuildsExecutionTimeEndPoint = (buildId) => {
  return buildsEndpoint + buildId + "/execution-time";
};

export const getRunsEndPoint = (buildId) => {
  return runsEndpoint + buildId;
};

export const getManualLaunchesEndPoint = (runId) => {
  return manualLaunchesEndpoint + runId;
};

export const getAutomationLaunches = (runId) => {
  return automationLaunches + runId;
};

export const getDefectsEndPoint = (projectId) => {
  return defects + projectId;
};

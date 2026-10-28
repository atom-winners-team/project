import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { authService } from '../../services/authService.js';
import { equipmentService } from '../../services/equipmentService.js';
import { requestsService } from '../../services/requestsService.js';
import { telemetryService } from '../../services/telemetryService.js';
import { usersService } from '../../services/usersService.js';

const query = (loader) => async (arg) => {
  try {
    return { data: await loader(arg) };
  } catch (error) {
    return { error: { status: 'CUSTOM_ERROR', error: error.message } };
  }
};

export const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Equipment', 'EquipmentHistory', 'Requests', 'Telemetry', 'Users', 'Dashboard'],
  endpoints: (build) => ({
    login: build.mutation({ queryFn: query(authService.login), invalidatesTags: ['Dashboard'] }),
    register: build.mutation({ queryFn: query(authService.register), invalidatesTags: ['Dashboard'] }),
    getEquipment: build.query({ queryFn: query(equipmentService.getAll), providesTags: ['Equipment'] }),
    getEquipmentById: build.query({ queryFn: query(({ id }) => equipmentService.getById(id)), providesTags: (_result, _error, { id }) => [{ type: 'Equipment', id }] }),
    getEquipmentHistory: build.query({ queryFn: query(({ id }) => equipmentService.getHistory(id)), providesTags: (_result, _error, { id }) => [{ type: 'EquipmentHistory', id }] }),
    getUnmatchedEquipmentHistory: build.query({ queryFn: query(equipmentService.getUnmatchedHistory), providesTags: ['EquipmentHistory'] }),
    getRequests: build.query({ queryFn: query(requestsService.getAll), providesTags: ['Requests'] }),
    getRequest: build.query({ queryFn: query(({ id }) => requestsService.getById(id)), providesTags: (_result, _error, { id }) => [{ type: 'Requests', id }] }),
    createRequest: build.mutation({ queryFn: query(requestsService.create), invalidatesTags: ['Requests', 'Dashboard'] }),
    updateRequest: build.mutation({ queryFn: query(({ id, data }) => requestsService.update(id, data)), invalidatesTags: ['Requests'] }),
    assignRequest: build.mutation({ queryFn: query(({ id, assigneeId }) => requestsService.assign(id, assigneeId)), invalidatesTags: ['Requests'] }),
    changeRequestStatus: build.mutation({ queryFn: query(({ id, status }) => requestsService.changeStatus(id, status)), invalidatesTags: ['Requests', 'Dashboard'] }),
    getTelemetry: build.query({ queryFn: query(telemetryService.getAll), providesTags: ['Telemetry'] }),
    getUsers: build.query({ queryFn: query(usersService.getAll), providesTags: ['Users'] }),
    getDashboard: build.query({ queryFn: query(async () => {
      const [equipment, requests, telemetry] = await Promise.all([
        equipmentService.getAll(),
        requestsService.getAll(),
        telemetryService.getAll(),
      ]);
      return {
        equipment: equipment.length,
        activeRequests: requests.filter((item) => item.status !== 'Выполнена').length,
        incidents: telemetry.filter((item) => item.level === 'Критическое').length,
      };
    }), providesTags: ['Dashboard'] }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetEquipmentQuery,
  useGetEquipmentByIdQuery,
  useGetEquipmentHistoryQuery,
  useGetUnmatchedEquipmentHistoryQuery,
  useGetRequestsQuery,
  useGetRequestQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useAssignRequestMutation,
  useChangeRequestStatusMutation,
  useGetTelemetryQuery,
  useGetUsersQuery,
  useGetDashboardQuery,
} = appApi;

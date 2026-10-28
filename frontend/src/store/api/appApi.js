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
  tagTypes: ['Equipment', 'Requests', 'Telemetry', 'Users', 'Dashboard'],
  endpoints: (build) => ({
    login: build.mutation({ queryFn: query(authService.login), invalidatesTags: ['Dashboard'] }),
    register: build.mutation({ queryFn: query(authService.register), invalidatesTags: ['Dashboard'] }),
    getEquipment: build.query({ queryFn: query(equipmentService.getAll), providesTags: ['Equipment'] }),
    getRequests: build.query({ queryFn: query(requestsService.getAll), providesTags: ['Requests'] }),
    getRequest: build.query({ queryFn: query(({ id }) => requestsService.getById(id)), providesTags: (_result, _error, { id }) => [{ type: 'Requests', id }] }),
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
  useGetRequestsQuery,
  useGetRequestQuery,
  useGetTelemetryQuery,
  useGetUsersQuery,
  useGetDashboardQuery,
} = appApi;

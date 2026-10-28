const errorResponse = {
  description: 'Ошибка запроса',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
};

const unauthorizedResponse = {
  description: 'Отсутствует или недействителен Bearer-токен',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
};

const secured = [{ bearerAuth: [] }];

export const openapiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Equipment management API',
    version: '1.0.0',
    description:
      'Документация API для оборудования, пользователей и заявок. ' +
      'Все маршруты /api/equipment, /api/users и /api/requests требуют JWT Bearer-токен.',
  },
  servers: [{ url: '/api', description: 'API сервера' }],
  tags: [
    { name: 'Equipment', description: 'Реестр оборудования и история' },
    { name: 'Users', description: 'Управление пользователями' },
    { name: 'Requests', description: 'Заявки на осмотр и ремонт' },
  ],
  paths: {
    '/equipment': {
      get: {
        tags: ['Equipment'],
        summary: 'Получить список оборудования',
        security: secured,
        responses: {
          200: {
            description: 'Список оборудования',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Equipment' },
                },
              },
            },
          },
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
    },
    '/equipment/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Первичный ключ оборудования в БД',
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      get: {
        tags: ['Equipment'],
        summary: 'Получить оборудование по ID',
        security: secured,
        responses: {
          200: {
            description: 'Карточка оборудования',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Equipment' },
              },
            },
          },
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/equipment/{id}/history': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Первичный ключ оборудования в БД',
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      get: {
        tags: ['Equipment'],
        summary: 'Получить историю оборудования',
        security: secured,
        responses: {
          200: {
            description: 'Записи истории оборудования',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EquipmentHistory' },
                },
              },
            },
          },
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/equipment/history/unmatched': {
      get: {
        tags: ['Equipment'],
        summary: 'Получить несопоставленные записи истории',
        security: secured,
        responses: {
          200: {
            description: 'История без связанного оборудования',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/EquipmentHistory' },
                },
              },
            },
          },
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
    },
    '/equipment/import': {
      post: {
        tags: ['Equipment'],
        summary: 'Импортировать книгу Excel',
        description:
          'Путь к файлу можно передать в JSON-теле запроса или query-параметром. ' +
          'Файл должен быть доступен серверу.',
        security: secured,
        parameters: [
          {
            name: 'filePath',
            in: 'query',
            required: false,
            schema: { type: 'string', minLength: 1 },
          },
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EquipmentImportRequest' },
              example: { filePath: 'data/Оборудование.xlsx' },
            },
          },
        },
        responses: {
          200: {
            description: 'Итог импорта',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EquipmentImportResponse' },
              },
            },
          },
          400: {
            description: 'Не указан путь к файлу или файл не найден',
            content: {
              'application/json': {
                schema: {
                  oneOf: [
                    { $ref: '#/components/schemas/ErrorResponse' },
                    { $ref: '#/components/schemas/MessageResponse' },
                  ],
                },
              },
            },
          },
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Получить список пользователей',
        security: secured,
        responses: {
          200: {
            description: 'Пользователи без хешей паролей',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
      post: {
        tags: ['Users'],
        summary: 'Создать пользователя',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserRequest' },
              example: {
                login: 'engineer2',
                password: 'strong-password',
                role: 'engineer',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Пользователь создан',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          409: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/users/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        },
      ],
      get: {
        tags: ['Users'],
        summary: 'Получить пользователя по ID',
        security: secured,
        responses: {
          200: {
            description: 'Пользователь',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
      patch: {
        tags: ['Users'],
        summary: 'Изменить логин или роль пользователя',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Обновлённый пользователь',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          404: errorResponse,
          409: errorResponse,
          500: errorResponse,
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Удалить пользователя',
        security: secured,
        responses: {
          204: { description: 'Пользователь удалён' },
          401: unauthorizedResponse,
          404: errorResponse,
          409: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/requests': {
      get: {
        tags: ['Requests'],
        summary: 'Получить список заявок',
        security: secured,
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: { $ref: '#/components/schemas/RequestStatus' },
          },
          {
            name: 'type',
            in: 'query',
            schema: { $ref: '#/components/schemas/RequestType' },
          },
          {
            name: 'equipment_id',
            in: 'query',
            description: 'UUID оборудования, фильтр передаётся сервису как есть',
            schema: { type: 'string' },
          },
          {
            name: 'priority_id',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'author_id',
            in: 'query',
            schema: { type: 'integer' },
          },
          {
            name: 'assignee_id',
            in: 'query',
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: {
            description: 'Заявки, отсортированные по дате создания',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Request' },
                },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
      post: {
        tags: ['Requests'],
        summary: 'Создать заявку',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateRequest' },
              example: {
                type: 'inspection',
                equipment_id: null,
                priority_id: 1,
                description: 'Проверить состояние оборудования',
                planned_at: '2026-10-29T09:00:00+03:00',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Заявка создана',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          500: errorResponse,
        },
      },
    },
    '/requests/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      get: {
        tags: ['Requests'],
        summary: 'Получить заявку по ID',
        security: secured,
        responses: {
          200: {
            description: 'Заявка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
      patch: {
        tags: ['Requests'],
        summary: 'Изменить данные заявки',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Обновлённая заявка',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/requests/{id}/assign': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      post: {
        tags: ['Requests'],
        summary: 'Назначить исполнителя заявки',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AssignRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Заявка с обновлённым исполнителем',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    },
    '/requests/{id}/status': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string', format: 'uuid' },
        },
      ],
      post: {
        tags: ['Requests'],
        summary: 'Изменить статус заявки',
        security: secured,
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangeRequestStatus' },
              example: { status: 'in_progress' },
            },
          },
        },
        responses: {
          200: {
            description: 'Заявка с обновлённым статусом',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Request' },
              },
            },
          },
          400: errorResponse,
          401: unauthorizedResponse,
          404: errorResponse,
          500: errorResponse,
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: { type: 'array', items: {} },
              requestId: { type: 'string', format: 'uuid' },
            },
            required: ['code', 'message', 'requestId'],
          },
        },
        required: ['error'],
      },
      MessageResponse: {
        type: 'object',
        properties: { message: { type: 'string' } },
        required: ['message'],
      },
      Equipment: {
        type: 'object',
        description: 'Поля, определённые моделью Equipment.',
        properties: {
          id: { type: 'integer' },
          loadingId: { type: 'string', nullable: true },
          loadingIdOriginal: { type: 'string', nullable: true },
          name: { type: 'string', nullable: true },
          attributes: { type: 'object', additionalProperties: true, nullable: true },
          rawRow: { type: 'object', additionalProperties: true, nullable: true },
          isContextOnly: { type: 'boolean' },
          hierarchy_node_id: { type: 'integer', nullable: true },
          work_schedule_dict_id: { type: 'integer', nullable: true },
          typical_repair_code: { type: 'string', nullable: true },
          commissioned_at: { type: 'string', format: 'date', nullable: true },
          manufactured_at: { type: 'string', format: 'date', nullable: true },
          useful_life_months: { type: 'number', nullable: true },
          inventory_number: { type: 'string', nullable: true },
          comment: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      EquipmentHistory: {
        type: 'object',
        description: 'Исходная запись истории и данные для сопоставления.',
        properties: {
          id: { type: 'integer' },
          equipmentId: { type: 'integer', nullable: true },
          loadingIdKey: { type: 'string', nullable: true },
          loadingIdOriginal: { type: 'string', nullable: true },
          raw: { type: 'object', additionalProperties: true, nullable: true },
          isUnmatched: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      EquipmentImportRequest: {
        type: 'object',
        properties: { filePath: { type: 'string', minLength: 1 } },
        required: ['filePath'],
      },
      EquipmentImportResponse: {
        type: 'object',
        properties: {
          result: {
            type: 'object',
            properties: {
              matched: { type: 'integer' },
              unmatched: { type: 'integer' },
              createdEquipment: { type: 'integer' },
              contextOnly: { type: 'integer' },
            },
            required: ['matched', 'unmatched', 'createdEquipment', 'contextOnly'],
          },
        },
        required: ['result'],
      },
      UserRole: {
        type: 'string',
        enum: ['duty', 'engineer', 'director'],
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          login: { type: 'string' },
          role: { $ref: '#/components/schemas/UserRole' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'login', 'role', 'createdAt', 'updatedAt'],
      },
      CreateUserRequest: {
        type: 'object',
        properties: {
          login: { type: 'string', minLength: 3, maxLength: 64 },
          password: { type: 'string', minLength: 8, maxLength: 72 },
          role: { $ref: '#/components/schemas/UserRole' },
        },
        required: ['login', 'password', 'role'],
      },
      UpdateUserRequest: {
        type: 'object',
        minProperties: 1,
        properties: {
          login: { type: 'string', minLength: 3, maxLength: 64 },
          role: { $ref: '#/components/schemas/UserRole' },
        },
        additionalProperties: false,
      },
      RequestType: {
        type: 'string',
        enum: ['inspection', 'repair'],
      },
      RequestStatus: {
        type: 'string',
        enum: ['new', 'in_progress', 'waiting_parts', 'done', 'rejected'],
      },
      Request: {
        type: 'object',
        description: 'Поля заявки, возвращаемые моделью Request.',
        properties: {
          id: { type: 'string', format: 'uuid' },
          equipment_id: { type: 'string', format: 'uuid', nullable: true },
          equipment_ref_id: { type: 'integer', minimum: 1, nullable: true },
          type: { $ref: '#/components/schemas/RequestType' },
          status: { $ref: '#/components/schemas/RequestStatus' },
          priority_id: { type: 'integer', nullable: true },
          description: { type: 'string', nullable: true },
          author_id: { type: 'integer', nullable: true },
          assignee_id: { type: 'integer', nullable: true },
          planned_at: { type: 'string', format: 'date-time', nullable: true },
          snapshot_context: { type: 'object', nullable: true, additionalProperties: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'type', 'status', 'createdAt', 'updatedAt'],
      },
      CreateRequest: {
        type: 'object',
        properties: {
          type: { $ref: '#/components/schemas/RequestType' },
          equipment_id: { type: 'string', format: 'uuid', nullable: true },
          equipment_ref_id: { type: 'integer', minimum: 1, nullable: true },
          priority_id: { type: 'integer', nullable: true },
          description: { type: 'string', nullable: true },
          planned_at: { type: 'string', format: 'date-time', nullable: true },
          snapshot_context: { type: 'object', nullable: true, additionalProperties: true },
        },
        required: ['type'],
      },
      UpdateRequest: {
        type: 'object',
        properties: {
          type: { $ref: '#/components/schemas/RequestType' },
          equipment_id: { type: 'string', format: 'uuid', nullable: true },
          equipment_ref_id: { type: 'integer', minimum: 1, nullable: true },
          priority_id: { type: 'integer', nullable: true },
          description: { type: 'string', nullable: true },
          planned_at: { type: 'string', format: 'date-time', nullable: true },
          snapshot_context: { type: 'object', nullable: true, additionalProperties: true },
        },
        minProperties: 1,
      },
      AssignRequest: {
        type: 'object',
        properties: { assignee_id: { type: 'integer', nullable: true } },
        required: ['assignee_id'],
      },
      ChangeRequestStatus: {
        type: 'object',
        properties: { status: { $ref: '#/components/schemas/RequestStatus' } },
        required: ['status'],
      },
    },
  },
};

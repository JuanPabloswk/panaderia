import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Panadería',
      version: '1.0.0',
      description: 'API REST del sistema de gestión de panadería. Permite administrar categorías, productos, clientes, empleados y pedidos.',
      contact: {
        name: 'Desarrollo',
        email: 'admin@panaderia.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Categoria: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'ID autogenerado' },
            nombre: { type: 'string', description: 'Nombre de la categoría' },
            descripcion: { type: 'string', description: 'Descripción de la categoría' },
            imagen: { type: 'string', nullable: true, description: 'URL de la imagen' },
            estado: { type: 'string', enum: ['activa', 'inactiva'], description: 'Estado de la categoría' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Producto: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            precio: { type: 'number' },
            imagen: { type: 'string', nullable: true },
            stock: { type: 'integer' },
            descuento: { type: 'number' },
            peso: { type: 'string', nullable: true },
            ingredientes: { type: 'array', items: { type: 'string' } },
            calificacion: { type: 'number' },
            categoria: { type: 'string', description: 'ID de categoría' },
            disponible: { type: 'boolean' },
          },
        },
        Cliente: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            primerNombre: { type: 'string' },
            apellido: { type: 'string' },
            telefono: { type: 'string' },
            direccion: {
              type: 'object',
              properties: {
                calle: { type: 'string' },
                ciudad: { type: 'string' },
                departamento: { type: 'string' },
                zipCode: { type: 'string' },
                pais: { type: 'string' },
              },
            },
            pedidos: { type: 'array', items: { type: 'string' } },
          },
        },
        Empleado: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            primerNombre: { type: 'string' },
            apellido: { type: 'string' },
            telefono: { type: 'string' },
            rol: { type: 'string', enum: ['admin', 'gerente', 'panadero', 'vendedor', 'administrativo'] },
            salario: { type: 'number' },
            estado: { type: 'string', enum: ['activo', 'inactivo', 'licencia'] },
            horario: {
              type: 'object',
              properties: {
                diaInicio: { type: 'string' },
                diaFin: { type: 'string' },
                horaInicio: { type: 'string' },
                horaFin: { type: 'string' },
              },
            },
            permisos: { type: 'array', items: { type: 'string' } },
          },
        },
        Pedido: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            cliente: { type: 'string', description: 'ID del cliente' },
            empleado: { type: 'string', nullable: true, description: 'ID del empleado' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  producto: { type: 'string' },
                  cantidad: { type: 'integer' },
                  precioUnitario: { type: 'number' },
                },
              },
            },
            subtotal: { type: 'number' },
            descuentoTotal: { type: 'number' },
            total: { type: 'number' },
            estado: { type: 'string', enum: ['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado'] },
            metodoPago: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia', 'nequi'] },
            tipoEntrega: { type: 'string', enum: ['domicilio', 'tienda'] },
            direccionEntrega: {
              type: 'object',
              properties: {
                calle: { type: 'string' },
                ciudad: { type: 'string' },
                departamento: { type: 'string' },
                zipCode: { type: 'string' },
                pais: { type: 'string' },
                referencia: { type: 'string' },
              },
            },
            notasEspeciales: { type: 'string' },
            fechaPedido: { type: 'string', format: 'date-time' },
            fechaEntrega: { type: 'string', format: 'date-time', nullable: true },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: false },
            error: { type: 'string' },
            detalles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  campo: { type: 'string' },
                  mensaje: { type: 'string' },
                },
              },
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', example: true },
            data: {
              type: 'object',
              properties: {
                cliente: { $ref: '#/components/schemas/Cliente' },
                empleado: { $ref: '#/components/schemas/Empleado' },
                token: { type: 'string' },
              },
            },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['Sistema'],
          summary: 'Verificar estado del servidor',
          responses: {
            200: { description: 'Servidor funcionando correctamente' },
          },
        },
      },
      '/api/auth/clientes/register': {
        post: {
          tags: ['Autenticación'],
          summary: 'Registrar un nuevo cliente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'primerNombre', 'apellido'],
                  properties: {
                    email: { type: 'string', example: 'juan@email.com' },
                    password: { type: 'string', example: 'Juan1234' },
                    primerNombre: { type: 'string', example: 'Juan' },
                    apellido: { type: 'string', example: 'Pérez' },
                    telefono: { type: 'string', example: '3001234567' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Cliente registrado exitosamente', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Error de validación', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email ya registrado' },
          },
        },
      },
      '/api/auth/clientes/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión como cliente',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'juan@email.com' },
                    password: { type: 'string', example: 'Juan1234' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login exitoso' },
            401: { description: 'Credenciales inválidas' },
          },
        },
      },
      '/api/auth/empleados/login': {
        post: {
          tags: ['Autenticación'],
          summary: 'Iniciar sesión como empleado',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'admin@panaderia.com' },
                    password: { type: 'string', example: 'Admin1234' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login exitoso', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Credenciales inválidas' },
            403: { description: 'Cuenta inactiva' },
          },
        },
      },
      '/api/categorias': {
        get: {
          tags: ['Categorías'],
          summary: 'Obtener todas las categorías',
          parameters: [
            { in: 'query', name: 'estado', schema: { type: 'string', enum: ['activa', 'inactiva'] }, description: 'Filtrar por estado' },
          ],
          responses: {
            200: { description: 'Lista de categorías' },
          },
        },
        post: {
          tags: ['Categorías'],
          summary: 'Crear una nueva categoría',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                  schema: {
                    type: 'object',
                    required: ['nombre', 'descripcion'],
                    properties: {
                      nombre: { type: 'string', example: 'Panadería' },
                      descripcion: { type: 'string', example: 'Pan artesanal y tradicional' },
                      imagen: { type: 'string', format: 'binary' },
                      estado: { type: 'string', enum: ['activa', 'inactiva'], example: 'activa' },
                    },
                    description: 'Los campos numéricos se envían como Text (string) y el middleware parseFormData los convierte automáticamente.',
                  },
              },
            },
          },
          responses: {
            201: { description: 'Categoría creada' },
            400: { description: 'Error de validación' },
            401: { description: 'No autenticado' },
          },
        },
      },
      '/api/categorias/{id}': {
        get: {
          tags: ['Categorías'],
          summary: 'Obtener una categoría por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Categoría encontrada' }, 404: { description: 'No encontrada' } },
        },
        put: {
          tags: ['Categorías'],
          summary: 'Actualizar una categoría',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { nombre: { type: 'string' }, descripcion: { type: 'string' }, imagen: { type: 'string', format: 'binary' }, estado: { type: 'string', enum: ['activa', 'inactiva'] } } } } } },
          responses: { 200: { description: 'Categoría actualizada' } },
        },
        delete: {
          tags: ['Categorías'],
          summary: 'Eliminar una categoría',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Categoría eliminada' } },
        },
      },
      '/api/categorias/{id}/estado': {
        patch: {
          tags: ['Categorías'],
          summary: 'Cambiar estado de una categoría',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { estado: { type: 'string', enum: ['activa', 'inactiva'] } } } } } },
          responses: { 200: { description: 'Estado actualizado' } },
        },
      },
      '/api/productos': {
        get: {
          tags: ['Productos'],
          summary: 'Obtener todos los productos',
          parameters: [
            { in: 'query', name: 'categoria', schema: { type: 'string' }, description: 'Filtrar por ID de categoría' },
            { in: 'query', name: 'disponible', schema: { type: 'string', enum: ['true', 'false'] }, description: 'Filtrar por disponibilidad' },
            { in: 'query', name: 'busqueda', schema: { type: 'string' }, description: 'Buscar por nombre o descripción' },
            { in: 'query', name: 'precioMin', schema: { type: 'number' }, description: 'Precio mínimo' },
            { in: 'query', name: 'precioMax', schema: { type: 'number' }, description: 'Precio máximo' },
          ],
          responses: { 200: { description: 'Lista de productos' } },
        },
        post: {
          tags: ['Productos'],
          summary: 'Crear un nuevo producto',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['nombre', 'descripcion', 'precio', 'stock', 'categoria'],
                  properties: {
                    nombre: { type: 'string', example: 'Pan de Masa Madre' },
                    descripcion: { type: 'string', example: 'Pan artesanal con fermentación natural' },
                    precio: { type: 'string', example: '12000', description: 'Se convierte automáticamente a número' },
                    stock: { type: 'string', example: '30', description: 'Se convierte automáticamente a entero' },
                    imagen: { type: 'string', format: 'binary' },
                    descuento: { type: 'string', example: '0', description: 'Se convierte automáticamente a número' },
                    peso: { type: 'string', example: '500g' },
                    ingredientes: { type: 'string', example: '["Harina","Agua","Sal"]', description: 'Array JSON como string, se convierte automáticamente' },
                    categoria: { type: 'string', description: 'ID de categoría' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Producto creado' } },
        },
      },
      '/api/productos/{id}': {
        get: {
          tags: ['Productos'],
          summary: 'Obtener un producto por ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Producto encontrado' }, 404: { description: 'No encontrado' } },
        },
        put: {
          tags: ['Productos'],
          summary: 'Actualizar un producto',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    nombre: { type: 'string' },
                    descripcion: { type: 'string' },
                    precio: { type: 'string', description: 'Se convierte automáticamente a número' },
                    stock: { type: 'string', description: 'Se convierte automáticamente a entero' },
                    imagen: { type: 'string', format: 'binary' },
                    descuento: { type: 'string', description: 'Se convierte automáticamente a número' },
                    peso: { type: 'string' },
                    ingredientes: { type: 'string', description: 'Array JSON como string, se convierte automáticamente' },
                    disponible: { type: 'string', description: '"true" o "false" como string, se convierte automáticamente' },
                    categoria: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Producto actualizado' } },
        },
        delete: {
          tags: ['Productos'],
          summary: 'Eliminar un producto',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Producto eliminado' } },
        },
      },
      '/api/clientes': {
        get: {
          tags: ['Clientes'],
          summary: 'Obtener todos los clientes',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Lista de clientes' } },
        },
      },
      '/api/clientes/perfil': {
        get: {
          tags: ['Clientes'],
          summary: 'Obtener perfil del cliente autenticado',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Perfil del cliente' } },
        },
        put: {
          tags: ['Clientes'],
          summary: 'Actualizar perfil del cliente autenticado',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    primerNombre: { type: 'string' },
                    apellido: { type: 'string' },
                    telefono: { type: 'string' },
                    direccion: { type: 'object', properties: { calle: { type: 'string' }, ciudad: { type: 'string' }, departamento: { type: 'string' }, zipCode: { type: 'string' }, pais: { type: 'string' } } },
                    preferencias: { type: 'object', properties: { newsletter: { type: 'boolean' } } },
                  },
                },
              },
            },
          },
          responses: { 200: { description: 'Perfil actualizado' } },
        },
      },
      '/api/empleados': {
        get: {
          tags: ['Empleados'],
          summary: 'Obtener todos los empleados',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'estado', schema: { type: 'string', enum: ['activo', 'inactivo', 'licencia'] } },
            { in: 'query', name: 'rol', schema: { type: 'string', enum: ['admin', 'gerente', 'panadero', 'vendedor', 'administrativo'] } },
          ],
          responses: { 200: { description: 'Lista de empleados' } },
        },
        post: {
          tags: ['Empleados'],
          summary: 'Crear un nuevo empleado',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['username', 'email', 'password', 'primerNombre', 'apellido', 'rol', 'salario'],
                  properties: {
                    username: { type: 'string', example: 'empleado1' },
                    email: { type: 'string', example: 'empleado@panaderia.com' },
                    password: { type: 'string', example: 'Empleado1234' },
                    primerNombre: { type: 'string', example: 'Carlos' },
                    apellido: { type: 'string', example: 'Martínez' },
                    telefono: { type: 'string' },
                    rol: { type: 'string', enum: ['admin', 'gerente', 'panadero', 'vendedor', 'administrativo'], example: 'vendedor' },
                    salario: { type: 'number', example: 2000000 },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Empleado creado' } },
        },
      },
      '/api/empleados/perfil': {
        get: {
          tags: ['Empleados'],
          summary: 'Obtener perfil del empleado autenticado',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Perfil del empleado' } },
        },
      },
      '/api/pedidos': {
        get: {
          tags: ['Pedidos'],
          summary: 'Obtener todos los pedidos',
          security: [{ bearerAuth: [] }],
          parameters: [
            { in: 'query', name: 'estado', schema: { type: 'string', enum: ['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado'] } },
            { in: 'query', name: 'cliente', schema: { type: 'string' }, description: 'Filtrar por ID de cliente' },
            { in: 'query', name: 'fechaDesde', schema: { type: 'string', format: 'date' } },
            { in: 'query', name: 'fechaHasta', schema: { type: 'string', format: 'date' } },
          ],
          responses: { 200: { description: 'Lista de pedidos' } },
        },
        post: {
          tags: ['Pedidos'],
          summary: 'Crear un nuevo pedido',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['cliente', 'items', 'subtotal', 'total'],
                  properties: {
                    cliente: { type: 'string', description: 'ID del cliente' },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          producto: { type: 'string' },
                          cantidad: { type: 'integer', example: 2 },
                          precioUnitario: { type: 'number', example: 12000 },
                        },
                      },
                    },
                    subtotal: { type: 'number', example: 24000 },
                    total: { type: 'number', example: 24000 },
                    metodoPago: { type: 'string', enum: ['efectivo', 'tarjeta', 'transferencia', 'nequi'], example: 'efectivo' },
                    tipoEntrega: { type: 'string', enum: ['domicilio', 'tienda'], example: 'tienda' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Pedido creado' } },
        },
      },
      '/api/pedidos/{id}': {
        get: {
          tags: ['Pedidos'],
          summary: 'Obtener un pedido por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Pedido encontrado' }, 404: { description: 'No encontrado' } },
        },
        put: {
          tags: ['Pedidos'],
          summary: 'Actualizar un pedido',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Pedido actualizado' } },
        },
        delete: {
          tags: ['Pedidos'],
          summary: 'Eliminar un pedido',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Pedido eliminado' } },
        },
      },
      '/api/pedidos/{id}/estado': {
        patch: {
          tags: ['Pedidos'],
          summary: 'Actualizar estado de un pedido',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { estado: { type: 'string', enum: ['pendiente', 'confirmado', 'preparacion', 'listo', 'entregado', 'cancelado'], example: 'confirmado' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Estado actualizado' } },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

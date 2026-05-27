# Braka Management Dashboard — API Contract

**Base URL:** `http://localhost:5000/api/v1`  
**Version:** MVP v0.1.0  
**Last Updated:** 2025

---

## Table of Contents

1. [Global Standards](#1-global-standards)
2. [Authentication](#2-authentication)
3. [Clients](#3-clients)
4. [Maintenance](#4-maintenance)
5. [Invoices](#5-invoices)
6. [Notifications](#6-notifications)
7. [Dashboard](#7-dashboard)
8. [Progress](#8-progress)
9. [Enum Reference](#9-enum-reference)

---

## 1. Global Standards

### 1.1 Success Response Structure

```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {}
}
```

### 1.2 Success Response with Pagination

```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

### 1.3 Error Response Structure

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### 1.4 Error Response with Detail

```json
{
  "success": false,
  "message": "Validation error: Email is required",
  "error": "Stack trace or detail (development only)"
}
```

### 1.5 HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200  | OK — request succeeded |
| 201  | Created — resource created |
| 400  | Bad Request — validation or malformed request |
| 401  | Unauthorized — missing or invalid token |
| 403  | Forbidden — access denied |
| 404  | Not Found — resource does not exist |
| 409  | Conflict — duplicate resource |
| 422  | Unprocessable Entity — schema validation failed |
| 500  | Internal Server Error |

### 1.6 Authentication Header

All protected routes require:

### 1.7 Query Parameter Conventions

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `page`    | number | Page number, default: 1 |
| `limit`   | number | Items per page, default: 10, max: 100 |
| `search`  | string | Keyword search |
| `status`  | string | Filter by status enum |
| `client`  | string | Filter by client ObjectId |

---

## 2. Authentication

### 2.1 Login

**`POST /auth/login`**  
Auth: **Public**

**Request Body:**
```json
{
  "email": "admin@braka.co.id",
  "password": "admin123456"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Braka Admin",
      "email": "admin@braka.co.id"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response `401`:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response `400`:**
```json
{
  "success": false,
  "message": "Email is required"
}
```

---

### 2.2 Get Current Admin

**`GET /auth/me`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Braka Admin",
      "email": "admin@braka.co.id"
    }
  }
}
```

**Error Response `401`:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

---

### 2.3 JWT Details

| Property   | Value |
|------------|-------|
| Algorithm  | HS256 |
| Expires In | 7 days (configurable via `JWT_EXPIRES_IN`) |
| Payload    | `{ id, email }` |

**Token Usage Flow:**
1. Call `POST /auth/login` to receive token
2. Store token on client side
3. Attach to every protected request as `Authorization: Bearer <token>`
4. On `401` response — redirect to login

---

## 3. Clients

### 3.1 List Clients

**`GET /clients`**  
Auth: **Protected**

**Query Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `search`  | string | Search by name, picName, or email |
| `status`  | string | Filter by: `active`, `inactive`, `prospect` |
| `page`    | number | Page number |
| `limit`   | number | Items per page |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Clients fetched successfully",
  "data": {
    "clients": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "PT Maju Bersama",
        "picName": "Budi Santoso",
        "email": "budi@majubersama.co.id",
        "phone": "0812-3456-7890",
        "address": "Jl. Sudirman No. 12, Jakarta Pusat",
        "notes": "Long-term client since 2021.",
        "status": "active",
        "createdAt": "2024-01-15T08:00:00.000Z",
        "updatedAt": "2024-01-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

---

### 3.2 Get Client by ID

**`GET /clients/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Client fetched successfully",
  "data": {
    "client": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "PT Maju Bersama",
      "picName": "Budi Santoso",
      "email": "budi@majubersama.co.id",
      "phone": "0812-3456-7890",
      "address": "Jl. Sudirman No. 12, Jakarta Pusat",
      "notes": "Long-term client since 2021.",
      "status": "active",
      "createdAt": "2024-01-15T08:00:00.000Z",
      "updatedAt": "2024-01-15T08:00:00.000Z"
    }
  }
}
```

**Error Response `404`:**
```json
{
  "success": false,
  "message": "Client not found"
}
```

**Error Response `400`:**
```json
{
  "success": false,
  "message": "Invalid client ID"
}
```

---

### 3.3 Create Client

**`POST /clients`**  
Auth: **Protected**

**Request Body:**
```json
{
  "name": "PT Maju Bersama",
  "picName": "Budi Santoso",
  "email": "budi@majubersama.co.id",
  "phone": "0812-3456-7890",
  "address": "Jl. Sudirman No. 12, Jakarta Pusat",
  "notes": "Long-term client.",
  "status": "active"
}
```

**Required fields:** `name`, `picName`, `email`, `phone`, `address`  
**Optional fields:** `notes`, `status` (default: `active`)

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Client created successfully",
  "data": {
    "client": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "PT Maju Bersama",
      "picName": "Budi Santoso",
      "email": "budi@majubersama.co.id",
      "phone": "0812-3456-7890",
      "address": "Jl. Sudirman No. 12, Jakarta Pusat",
      "status": "active",
      "createdAt": "2025-01-20T08:00:00.000Z",
      "updatedAt": "2025-01-20T08:00:00.000Z"
    }
  }
}
```

**Error Response `409`:**
```json
{
  "success": false,
  "message": "Client with email 'budi@majubersama.co.id' already exists"
}
```

---

### 3.4 Update Client

**`PATCH /clients/:id`**  
Auth: **Protected**

**Request Body** (all fields optional):
```json
{
  "name": "PT Maju Bersama Updated",
  "status": "inactive"
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Client updated successfully",
  "data": {
    "client": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "PT Maju Bersama Updated",
      "status": "inactive",
      "updatedAt": "2025-01-21T10:00:00.000Z"
    }
  }
}
```

---

### 3.5 Delete Client

**`DELETE /clients/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Client deleted successfully",
  "data": null
}
```

---

## 4. Maintenance

### 4.1 List Maintenance Contracts

**`GET /maintenance`**  
Auth: **Protected**

**Query Parameters:**

| Parameter     | Type   | Description |
|---------------|--------|-------------|
| `search`      | string | Search by serviceName |
| `status`      | string | Filter by: `active`, `paused`, `expired`, `cancelled` |
| `billingType` | string | Filter by: `monthly`, `yearly` |
| `client`      | string | Filter by client ObjectId |
| `page`        | number | Page number |
| `limit`       | number | Items per page |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Maintenance contracts fetched successfully",
  "data": {
    "contracts": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
        "client": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "PT Maju Bersama",
          "email": "budi@majubersama.co.id"
        },
        "serviceName": "Annual AC Maintenance",
        "billingType": "yearly",
        "price": 24000000,
        "startDate": "2024-01-01T00:00:00.000Z",
        "nextDueDate": "2025-01-01T00:00:00.000Z",
        "status": "active",
        "notes": "Includes 4 service visits per year.",
        "createdAt": "2024-01-01T08:00:00.000Z",
        "updatedAt": "2024-01-01T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "totalPages": 1
    }
  }
}
```

---

### 4.2 Get Maintenance by ID

**`GET /maintenance/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Maintenance contract fetched successfully",
  "data": {
    "contract": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "client": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "PT Maju Bersama",
        "email": "budi@majubersama.co.id"
      },
      "serviceName": "Annual AC Maintenance",
      "billingType": "yearly",
      "price": 24000000,
      "startDate": "2024-01-01T00:00:00.000Z",
      "nextDueDate": "2025-01-01T00:00:00.000Z",
      "status": "active",
      "notes": "Includes 4 service visits per year.",
      "createdAt": "2024-01-01T08:00:00.000Z",
      "updatedAt": "2024-01-01T08:00:00.000Z"
    }
  }
}
```

---

### 4.3 Create Maintenance Contract

**`POST /maintenance`**  
Auth: **Protected**

**Request Body:**
```json
{
  "client": "64f1a2b3c4d5e6f7a8b9c0d1",
  "serviceName": "Annual AC Maintenance",
  "billingType": "yearly",
  "price": 24000000,
  "startDate": "2024-01-01",
  "nextDueDate": "2025-01-01",
  "status": "active",
  "notes": "Includes 4 service visits per year."
}
```

**Required fields:** `client`, `serviceName`, `billingType`, `price`, `startDate`, `nextDueDate`  
**Optional fields:** `status` (default: `active`), `notes`

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Maintenance contract created successfully",
  "data": {
    "contract": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "client": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "PT Maju Bersama",
        "email": "budi@majubersama.co.id"
      },
      "serviceName": "Annual AC Maintenance",
      "billingType": "yearly",
      "price": 24000000,
      "startDate": "2024-01-01T00:00:00.000Z",
      "nextDueDate": "2025-01-01T00:00:00.000Z",
      "status": "active"
    }
  }
}
```

**Error Response `404`:**
```json
{
  "success": false,
  "message": "Client with ID '64f1a2b3c4d5e6f7a8b9c0d1' not found"
}
```

---

### 4.4 Update Maintenance Contract

**`PATCH /maintenance/:id`**  
Auth: **Protected**

**Request Body** (all fields optional):
```json
{
  "status": "paused",
  "nextDueDate": "2025-06-01",
  "price": 26000000
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Maintenance contract updated successfully",
  "data": {
    "contract": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "status": "paused",
      "nextDueDate": "2025-06-01T00:00:00.000Z",
      "price": 26000000
    }
  }
}
```

---

### 4.5 Delete Maintenance Contract

**`DELETE /maintenance/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Maintenance contract deleted successfully",
  "data": null
}
```

---

## 5. Invoices

### 5.1 List Invoices

**`GET /invoices`**  
Auth: **Protected**

**Query Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `search`  | string | Search by invoiceNumber |
| `status`  | string | Filter by: `draft`, `sent`, `paid`, `overdue`, `cancelled` |
| `client`  | string | Filter by client ObjectId |
| `page`    | number | Page number |
| `limit`   | number | Items per page |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Invoices fetched successfully",
  "data": {
    "invoices": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "invoiceNumber": "INV-0041",
        "client": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "PT Maju Bersama",
          "email": "budi@majubersama.co.id"
        },
        "maintenance": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
          "serviceName": "Annual AC Maintenance"
        },
        "items": [
          {
            "description": "AC Maintenance Q1 Service Visit",
            "quantity": 1,
            "unitPrice": 3000000,
            "amount": 3000000
          }
        ],
        "subtotal": 4500000,
        "total": 4500000,
        "invoiceDate": "2025-01-15T00:00:00.000Z",
        "dueDate": "2025-01-28T00:00:00.000Z",
        "paidAt": null,
        "status": "sent",
        "notes": "Payment via bank transfer.",
        "createdAt": "2025-01-15T08:00:00.000Z",
        "updatedAt": "2025-01-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 7,
      "totalPages": 1
    }
  }
}
```

---

### 5.2 Get Invoice by ID

**`GET /invoices/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Invoice fetched successfully",
  "data": {
    "invoice": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "invoiceNumber": "INV-0041",
      "client": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "PT Maju Bersama",
        "email": "budi@majubersama.co.id"
      },
      "maintenance": null,
      "items": [
        {
          "description": "AC Maintenance Q1 Service Visit",
          "quantity": 1,
          "unitPrice": 3000000,
          "amount": 3000000
        },
        {
          "description": "Refrigerant Recharge",
          "quantity": 2,
          "unitPrice": 650000,
          "amount": 1300000
        }
      ],
      "subtotal": 4300000,
      "total": 4300000,
      "invoiceDate": "2025-01-15T00:00:00.000Z",
      "dueDate": "2025-01-28T00:00:00.000Z",
      "paidAt": null,
      "status": "sent",
      "notes": "Payment via bank transfer.",
      "createdAt": "2025-01-15T08:00:00.000Z",
      "updatedAt": "2025-01-15T08:00:00.000Z"
    }
  }
}
```

---

### 5.3 Create Invoice

**`POST /invoices`**  
Auth: **Protected**

**Request Body:**
```json
{
  "invoiceNumber": "INV-0041",
  "client": "64f1a2b3c4d5e6f7a8b9c0d1",
  "maintenance": "64f1a2b3c4d5e6f7a8b9c0d2",
  "items": [
    {
      "description": "AC Maintenance Q1 Service Visit",
      "quantity": 1,
      "unitPrice": 3000000
    },
    {
      "description": "Refrigerant Recharge",
      "quantity": 2,
      "unitPrice": 650000
    }
  ],
  "invoiceDate": "2025-01-15",
  "dueDate": "2025-01-28",
  "status": "draft",
  "notes": "Payment via bank transfer."
}
```

**Required fields:** `invoiceNumber`, `client`, `items` (min 1), `invoiceDate`, `dueDate`  
**Optional fields:** `maintenance`, `status` (default: `draft`), `notes`

**Item required fields:** `description`, `quantity`, `unitPrice`  
**Note:** `amount` per item and `subtotal`/`total` are calculated server-side.

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "invoice": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "invoiceNumber": "INV-0041",
      "subtotal": 4300000,
      "total": 4300000,
      "status": "draft"
    }
  }
}
```

**Error Response `409`:**
```json
{
  "success": false,
  "message": "Invoice number 'INV-0041' already exists"
}
```

---

### 5.4 Update Invoice

**`PATCH /invoices/:id`**  
Auth: **Protected**

**Note:** Paid invoices cannot be edited.

**Request Body** (all fields optional):
```json
{
  "status": "sent",
  "dueDate": "2025-02-01",
  "notes": "Updated payment instructions."
}
```

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Invoice updated successfully",
  "data": {
    "invoice": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "status": "sent",
      "dueDate": "2025-02-01T00:00:00.000Z"
    }
  }
}
```

**Error Response `400` (already paid):**
```json
{
  "success": false,
  "message": "Paid invoices cannot be edited"
}
```

---

### 5.5 Delete Invoice

**`DELETE /invoices/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully",
  "data": null
}
```

---

### 5.6 Mark Invoice as Paid

**`POST /invoices/:id/mark-as-paid`**  
Auth: **Protected**

**Request Body:** None required

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Invoice marked as paid successfully",
  "data": {
    "invoice": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "invoiceNumber": "INV-0041",
      "status": "paid",
      "paidAt": "2025-01-25T14:30:00.000Z"
    }
  }
}
```

**Error Response `400` (already paid):**
```json
{
  "success": false,
  "message": "Invoice is already marked as paid"
}
```

---

## 6. Notifications

### 6.1 List Notifications

**`GET /notifications`**  
Auth: **Protected**

**Query Parameters:**

| Parameter | Type    | Description |
|-----------|---------|-------------|
| `type`    | string  | Filter by: `due_soon`, `overdue`, `payment_received`, `system` |
| `isRead`  | boolean | Filter by read state: `true` or `false` |
| `page`    | number  | Page number |
| `limit`   | number  | Items per page (default: 20) |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Notifications fetched successfully",
  "data": {
    "notifications": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
        "title": "Invoice Overdue",
        "message": "INV-0039 from CV Cipta Karya is overdue by 4 days.",
        "type": "overdue",
        "isRead": false,
        "relatedClient": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "CV Cipta Karya"
        },
        "relatedInvoice": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
          "invoiceNumber": "INV-0039"
        },
        "createdAt": "2025-01-25T09:15:00.000Z",
        "updatedAt": "2025-01-25T09:15:00.000Z"
      }
    ],
    "unreadCount": 4,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

---

### 6.2 Mark Notification as Read

**`PATCH /notifications/:id/read`**  
Auth: **Protected**

**Request Body:** None required  
**Note:** Idempotent — does not fail if already read.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "notification": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
      "isRead": true,
      "updatedAt": "2025-01-25T10:00:00.000Z"
    }
  }
}
```

**Error Response `404`:**
```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

### 6.3 Mark All Notifications as Read

**`PATCH /notifications/read-all`**  
Auth: **Protected**

**Request Body:** None required

**Success Response `200`:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "modifiedCount": 4
  }
}
```

---

## 7. Dashboard

### 7.1 Get Dashboard Summary

**`GET /dashboard/summary`**  
Auth: **Protected**

**Query Parameters:** None

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "totalClients": 8,
    "activeMaintenance": 5,
    "pendingInvoices": 3,
    "overdueInvoices": 2,
    "monthlyRevenue": 48200000,
    "upcomingDueInvoices": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
        "invoiceNumber": "INV-0041",
        "dueDate": "2025-01-28T00:00:00.000Z",
        "total": 4500000,
        "client": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "PT Maju Bersama"
        }
      }
    ],
    "recentActivity": [
      {
        "type": "invoice_paid",
        "description": "Invoice INV-0038 was paid",
        "meta": "PT Maju Bersama",
        "timestamp": "2025-01-23T14:22:00.000Z"
      },
      {
        "type": "client_created",
        "description": "New client added",
        "meta": "CV Harapan Jaya",
        "timestamp": "2025-01-22T10:00:00.000Z"
      },
      {
        "type": "maintenance_created",
        "description": "Maintenance contract created",
        "meta": "Annual AC Maintenance · PT Maju Bersama",
        "timestamp": "2025-01-20T08:00:00.000Z"
      },
      {
        "type": "invoice_created",
        "description": "Invoice INV-0042 was created",
        "meta": "UD Sinar Terang",
        "timestamp": "2025-01-18T09:00:00.000Z"
      }
    ]
  }
}
```

**Activity Types:**

| Type | Description |
|------|-------------|
| `invoice_paid`          | Invoice was marked as paid |
| `invoice_created`       | New invoice was created |
| `client_created`        | New client was added |
| `maintenance_created`   | New maintenance contract was created |

**Notes:**
- `monthlyRevenue` — sum of `total` from paid invoices in the current calendar month
- `upcomingDueInvoices` — invoices with status `draft`, `sent`, or `overdue` where `dueDate >= today`, sorted by nearest due date, limit 5
- `recentActivity` — top 8 most recent events across invoices, clients, and maintenance

---

## 8. Progress

### 8.1 List Progress Projects (Admin)

**`GET /progress`**  
Auth: **Protected**

**Query Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `search`  | string | Search by projectName |
| `status`  | string | Filter by project status enum |
| `client`  | string | Filter by client ObjectId |
| `page`    | number | Page number |
| `limit`   | number | Items per page |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Progress projects fetched successfully",
  "data": {
    "projects": [
      {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
        "client": {
          "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
          "name": "PT Maju Bersama",
          "email": "budi@majubersama.co.id"
        },
        "projectName": "HQ Renovation – Phase 2",
        "status": "development",
        "progress": 72,
        "description": "Full renovation of headquarters second floor.",
        "milestones": [
          { "title": "Project Kickoff & Planning", "completed": true },
          { "title": "Design & Material Procurement", "completed": true },
          { "title": "Interior Works & Finishing", "completed": false }
        ],
        "publicToken": "brk_pg_a82js92ks3f4b1c2",
        "lastUpdated": "2025-01-24T00:00:00.000Z",
        "createdAt": "2024-10-01T08:00:00.000Z",
        "updatedAt": "2025-01-24T08:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

---

### 8.2 Get Progress Project by ID (Admin)

**`GET /progress/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Progress project fetched successfully",
  "data": {
    "project": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "client": {
        "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
        "name": "PT Maju Bersama",
        "email": "budi@majubersama.co.id"
      },
      "projectName": "HQ Renovation – Phase 2",
      "status": "development",
      "progress": 72,
      "description": "Full renovation of headquarters second floor.",
      "milestones": [
        { "title": "Project Kickoff & Planning", "completed": true },
        { "title": "Interior Works & Finishing", "completed": false }
      ],
      "publicToken": "brk_pg_a82js92ks3f4b1c2",
      "lastUpdated": "2025-01-24T00:00:00.000Z",
      "createdAt": "2024-10-01T08:00:00.000Z",
      "updatedAt": "2025-01-24T08:00:00.000Z"
    }
  }
}
```

---

### 8.3 Create Progress Project (Admin)

**`POST /progress`**  
Auth: **Protected**

**Request Body:**
```json
{
  "client": "64f1a2b3c4d5e6f7a8b9c0d1",
  "projectName": "HQ Renovation – Phase 2",
  "status": "development",
  "progress": 72,
  "description": "Full renovation of headquarters second floor.",
  "milestones": [
    { "title": "Project Kickoff & Planning", "completed": true },
    { "title": "Design & Material Procurement", "completed": true },
    { "title": "Interior Works & Finishing", "completed": false }
  ]
}
```

**Required fields:** `client`, `projectName`  
**Optional fields:** `status` (default: `planning`), `progress` (default: `0`), `description`, `milestones`  
**Note:** `publicToken` is auto-generated on creation and never regenerated automatically.

**Success Response `201`:**
```json
{
  "success": true,
  "message": "Progress project created successfully",
  "data": {
    "project": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "publicToken": "brk_pg_a82js92ks3f4b1c2",
      "status": "development",
      "progress": 72
    }
  }
}
```

---

### 8.4 Update Progress Project (Admin)

**`PATCH /progress/:id`**  
Auth: **Protected**

**Request Body** (all fields optional):
```json
{
  "progress": 85,
  "status": "testing",
  "milestones": [
    { "title": "Project Kickoff & Planning", "completed": true },
    { "title": "Interior Works & Finishing", "completed": true }
  ]
}
```

**Note:** `lastUpdated` is automatically set to current timestamp on every update.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Progress project updated successfully",
  "data": {
    "project": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "progress": 85,
      "status": "testing",
      "lastUpdated": "2025-01-25T10:00:00.000Z"
    }
  }
}
```

---

### 8.5 Delete Progress Project (Admin)

**`DELETE /progress/:id`**  
Auth: **Protected**

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Progress project deleted successfully",
  "data": null
}
```

---

### 8.6 Regenerate Public Token (Admin)

**`POST /progress/:id/regenerate-token`**  
Auth: **Protected**

**Request Body:** None required  
**Warning:** The old public token becomes immediately invalid.

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Public token regenerated successfully",
  "data": {
    "publicToken": "brk_pg_x91kc73mn4a2d8e1"
  }
}
```

---

### 8.7 Get Public Progress Page

**`GET /progress/public/:token`**  
Auth: **Public — No authentication required**

**Parameters:**

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `token`   | string | Public progress token (`brk_pg_...`) |

**Success Response `200`:**
```json
{
  "success": true,
  "message": "Progress fetched successfully",
  "data": {
    "clientName": "PT Maju Bersama",
    "projectName": "HQ Renovation – Phase 2",
    "status": "development",
    "progress": 72,
    "description": "Full renovation of headquarters second floor.",
    "lastUpdated": "2025-01-24T00:00:00.000Z",
    "milestones": [
      { "title": "Project Kickoff & Planning", "completed": true },
      { "title": "Design & Material Procurement", "completed": true },
      { "title": "Interior Works & Finishing", "completed": false }
    ]
  }
}
```

**Error Response `404`:**
```json
{
  "success": false,
  "message": "Progress page not found or link is invalid"
}
```

**Note:** This endpoint exposes ONLY public-safe fields. Internal fields (`publicToken`, `_id`, `client ObjectId`) are never returned.

---

## 9. Enum Reference

### 9.1 Client Status

| Value      | Description |
|------------|-------------|
| `active`   | Active client with ongoing relationship |
| `inactive` | Former client, no current activity |
| `prospect` | Potential client, not yet contracted |

---

### 9.2 Maintenance Status

| Value       | Description |
|-------------|-------------|
| `active`    | Contract is active and ongoing |
| `paused`    | Temporarily paused by client or admin |
| `expired`   | Contract period has ended |
| `cancelled` | Contract was cancelled |

---

### 9.3 Maintenance Billing Type

| Value     | Description |
|-----------|-------------|
| `monthly` | Billed every month |
| `yearly`  | Billed once per year |

---

### 9.4 Invoice Status

| Value       | Description |
|-------------|-------------|
| `draft`     | Created but not yet sent to client |
| `sent`      | Sent to client, awaiting payment |
| `paid`      | Payment confirmed — sets `paidAt` timestamp |
| `overdue`   | Due date passed without payment |
| `cancelled` | Invoice was cancelled |

---

### 9.5 Notification Type

| Value              | Description |
|--------------------|-------------|
| `due_soon`         | Invoice or contract is due within reminder window |
| `overdue`          | Invoice or contract is past due date |
| `payment_received` | Invoice payment was confirmed |
| `system`           | Internal system or app update message |

---

### 9.6 Progress Status

| Value         | Description |
|---------------|-------------|
| `planning`    | Project is in planning phase |
| `design`      | Design work is in progress |
| `development` | Active development or installation |
| `revision`    | Revision or rework phase |
| `testing`     | Testing, commissioning, or QA phase |
| `completed`   | Project fully completed and handed over |

---

## Appendix — Quick Reference

### All Endpoints

Health
GET    /api/v1/health
Auth
POST   /api/v1/auth/login
GET    /api/v1/auth/me                            [Protected]
Dashboard
GET    /api/v1/dashboard/summary                  [Protected]
Clients
GET    /api/v1/clients                            [Protected]
GET    /api/v1/clients/:id                        [Protected]
POST   /api/v1/clients                            [Protected]
PATCH  /api/v1/clients/:id                        [Protected]
DELETE /api/v1/clients/:id                        [Protected]
Maintenance
GET    /api/v1/maintenance                        [Protected]
GET    /api/v1/maintenance/:id                    [Protected]
POST   /api/v1/maintenance                        [Protected]
PATCH  /api/v1/maintenance/:id                    [Protected]
DELETE /api/v1/maintenance/:id                    [Protected]
Invoices
GET    /api/v1/invoices                           [Protected]
GET    /api/v1/invoices/:id                       [Protected]
POST   /api/v1/invoices                           [Protected]
PATCH  /api/v1/invoices/:id                       [Protected]
DELETE /api/v1/invoices/:id                       [Protected]
POST   /api/v1/invoices/:id/mark-as-paid          [Protected]
Notifications
GET    /api/v1/notifications                      [Protected]
PATCH  /api/v1/notifications/read-all             [Protected]
PATCH  /api/v1/notifications/:id/read             [Protected]
Progress (Admin)
GET    /api/v1/progress                           [Protected]
GET    /api/v1/progress/:id                       [Protected]
POST   /api/v1/progress                           [Protected]
PATCH  /api/v1/progress/:id                       [Protected]
DELETE /api/v1/progress/:id                       [Protected]
POST   /api/v1/progress/:id/regenerate-token      [Protected]
Progress (Public)
GET    /api/v1/progress/public/:token             [Public]

---

*End of API Contract — Braka Management Dashboard MVP*
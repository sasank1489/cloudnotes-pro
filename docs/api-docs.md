# CloudNotes Pro API Documentation

Base URL: `/api`

## Authentication Endpoints

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "JWT_TOKEN_STRING",
    "user": {
      "id": "60d5ec49f1b2c81234567890",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "profileImage": "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
    }
  }
  ```

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```

### 3. Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`

### 4. Get Current Profile
- **URL**: `/api/auth/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

## Notes Endpoints

### 1. Get Notes (Paginated, Searchable, Filterable)
- **URL**: `/api/notes`
- **Method**: `GET`
- **Query Params**: `search`, `category`, `tag`, `isPinned`, `isArchived`, `sort`, `page`, `limit`

### 2. Create Note
- **URL**: `/api/notes`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "title": "Cloud Architecture Meeting",
    "content": "Discuss Terraform modules and Kubernetes cluster scaling",
    "category": "Work",
    "tags": ["DevOps", "Architecture"],
    "isPinned": true
  }
  ```

### 3. Update Note
- **URL**: `/api/notes/:id`
- **Method**: `PUT`

### 4. Delete Note
- **URL**: `/api/notes/:id`
- **Method**: `DELETE`

### 5. Toggle Pin / Archive
- **URL**: `/api/notes/:id/pin` | `/api/notes/:id/archive`
- **Method**: `PATCH`

### 6. Share Note
- **URL**: `/api/notes/:id/share`
- **Method**: `POST`
- **Body**: `{ "email": "colleague@example.com" }`

---

## Observability & DevOps Endpoints
- **Health Check**: `GET /health`
- **Prometheus Metrics**: `GET /metrics`

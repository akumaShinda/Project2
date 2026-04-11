# StreamFusion API Documentation

Complete API reference for StreamFusion endpoints.

## Authentication API

### Login
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "username": "Akuma",
  "password": "SkylineR30"
}
```

**Response** (Success - 200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-001",
    "username": "Akuma",
    "email": "admin@streamfusion.local",
    "role": "admin"
  },
  "message": "Login successful"
}
```

**Response** (Error - 401):
```json
{
  "error": "Invalid password"
}
```

### Verify Token
**Endpoint**: `POST /api/auth/verify`

**Request**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (Success - 200):
```json
{
  "valid": true,
  "user": {
    "userId": "admin-001",
    "username": "Akuma",
    "role": "admin"
  }
}
```

**Response** (Error - 401):
```json
{
  "error": "Invalid or expired token"
}
```

## Content Search API

### Search Content
**Endpoint**: `GET /api/search?q=query&type=all`

**Parameters**:
- `q` (required): Search query
- `type` (optional): Content type (all, movie, tv, anime)

**Example**:
```
GET /api/search?q=Inception&type=movie
```

**Response** (Success - 200):
```json
{
  "id": "movie-inception",
  "title": "Inception",
  "description": "A skilled thief who steals corporate secrets...",
  "poster": "https://example.com/poster.jpg",
  "links": [
    {
      "url": "https://provider1.com/stream/movie-inception",
      "quality": "1080p",
      "type": "stream",
      "headers": {}
    }
  ],
  "provider": "FlyxTV",
  "timestamp": 1704067200000
}
```

**Response** (Error - 404):
```json
{
  "error": "No streams found"
}
```

## Content Extraction API

### Extract Stream Links
**Endpoint**: `GET /api/extract?contentId=id`

**Parameters**:
- `contentId` (required): Content ID to extract

**Example**:
```
GET /api/extract?contentId=movie-inception
```

**Response** (Success - 200):
```json
{
  "contentId": "movie-inception",
  "providers": [
    {
      "id": "movie-inception",
      "title": "Inception",
      "description": "Available via FlyxTV",
      "links": [
        {
          "url": "https://provider1.com/stream/movie-inception",
          "quality": "1080p",
          "type": "stream"
        }
      ],
      "provider": "FlyxTV",
      "timestamp": 1704067200000
    }
  ],
  "totalProviders": 1,
  "primary": { /* FlyxTV result */ },
  "fallbacks": [ /* Other providers */ ]
}
```

## Synchronization API

### Save Watch History
**Endpoint**: `POST /api/sync/history`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "userId": "user-001",
  "contentId": "movie-inception",
  "progress": 45,
  "timestamp": 1704067200000
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Watch history saved"
}
```

**Response** (Error - 401):
```json
{
  "error": "Unauthorized"
}
```

### Pull Sync Data
**Endpoint**: `GET /api/sync/pull?userId=user-id`

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `userId` (required): User ID

**Response** (Success - 200):
```json
{
  "userId": "user-001",
  "watchHistory": [
    {
      "contentId": "movie-inception",
      "progress": 45,
      "timestamp": 1704067200000
    }
  ],
  "favorites": ["movie-inception", "movie-matrix"],
  "watchlist": ["movie-avatar"],
  "settings": {
    "quality": "1080p",
    "autoPlay": true,
    "subtitles": true,
    "theme": "dark"
  },
  "lastSyncTime": 1704067200000
}
```

### Push Sync Data
**Endpoint**: `POST /api/sync/push`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "userId": "user-001",
  "watchHistory": [
    {
      "contentId": "movie-inception",
      "progress": 50,
      "timestamp": 1704067200000
    }
  ],
  "favorites": ["movie-inception", "movie-matrix"],
  "watchlist": ["movie-avatar"],
  "settings": {
    "quality": "1080p",
    "autoPlay": true,
    "subtitles": true,
    "theme": "dark"
  }
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Sync data saved",
  "lastSyncTime": 1704067200000
}
```

### Update Favorites
**Endpoint**: `POST /api/sync/favorites`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "userId": "user-001",
  "favorites": ["movie-inception", "movie-matrix", "movie-avatar"]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Favorites updated"
}
```

### Update Watchlist
**Endpoint**: `POST /api/sync/watchlist`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request**:
```json
{
  "userId": "user-001",
  "watchlist": ["movie-avatar", "movie-dune"]
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Watchlist updated"
}
```

## Error Responses

### Common Error Codes

**400 Bad Request**:
```json
{
  "error": "Query parameter is required"
}
```

**401 Unauthorized**:
```json
{
  "error": "Invalid or expired token"
}
```

**404 Not Found**:
```json
{
  "error": "Content not found"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- Search requests: 10 requests per minute
- Sync requests: 5 requests per minute
- Extract requests: 20 requests per minute

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer {token}
```

Token obtained from login endpoint and valid for 7 days.

## Caching

### Search Results
- Cached for 30 minutes
- Cache key includes query and content type

### Extract Results
- Cached for 30 minutes
- Cache key includes content ID and provider

### Sync Data
- Last sync timestamp returned in response
- Client should implement incremental sync

## Example Workflows

### Complete User Journey

1. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Akuma","password":"SkylineR30"}'
```

2. **Search**:
```bash
curl -X GET "http://localhost:3000/api/search?q=Inception" \
  -H "Authorization: Bearer {token}"
```

3. **Extract**:
```bash
curl -X GET "http://localhost:3000/api/extract?contentId=movie-inception" \
  -H "Authorization: Bearer {token}"
```

4. **Save Progress**:
```bash
curl -X POST http://localhost:3000/api/sync/history \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "userId":"user-001",
    "contentId":"movie-inception",
    "progress":50,
    "timestamp":'$(date +%s)000'
  }'
```

5. **Pull Sync**:
```bash
curl -X GET "http://localhost:3000/api/sync/pull?userId=user-001" \
  -H "Authorization: Bearer {token}"
```

## SDK Example (JavaScript/TypeScript)

```typescript
import axios from 'axios';

class StreamFusionClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  async login(username: string, password: string) {
    const response = await axios.post(`${this.baseUrl}/api/auth/login`, {
      username,
      password,
    });
    this.token = response.data.token;
    return response.data;
  }

  async search(query: string, type: string = 'all') {
    return axios.get(`${this.baseUrl}/api/search`, {
      params: { q: query, type },
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async extract(contentId: string) {
    return axios.get(`${this.baseUrl}/api/extract`, {
      params: { contentId },
      headers: { Authorization: `Bearer ${this.token}` },
    });
  }

  async saveProgress(userId: string, contentId: string, progress: number) {
    return axios.post(
      `${this.baseUrl}/api/sync/history`,
      { userId, contentId, progress, timestamp: Date.now() },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
}

// Usage
const client = new StreamFusionClient();
await client.login('Akuma', 'SkylineR30');
const results = await client.search('Inception');
```

---

For more information, visit [README.md](./README.md) or [ARCHITECTURE.md](./ARCHITECTURE.md)

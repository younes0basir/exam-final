# Common API Response Issues & Fixes

## Issue: `users.filter is not a function`

### Problem
Your React component is trying to call `.filter()` on the users data, but it's receiving a **paginated object** instead of an array.

### Root Cause
The Laravel backend uses pagination:

```php
// Backend: AdminController.php
public function users()
{
    $users = User::latest()->paginate(20); // Returns paginated object
    return response()->json($users);
}
```

This returns:
```json
{
  "current_page": 1,
  "data": [
    { "id": 1, "name": "John", ... },
    { "id": 2, "name": "Jane", ... }
  ],
  "first_page_url": "http://localhost:8000/api/admin/users?page=1",
  "from": 1,
  "last_page": 3,
  "last_page_url": "http://localhost:8000/api/admin/users?page=3",
  "next_page_url": "http://localhost:8000/api/admin/users?page=2",
  "path": "http://localhost:8000/api/admin/users",
  "per_page": 20,
  "prev_page_url": null,
  "to": 20,
  "total": 45
}
```

But your frontend expects:
```json
[
  { "id": 1, "name": "John", ... },
  { "id": 2, "name": "Jane", ... }
]
```

---

## Solutions

### Option 1: Update Frontend to Handle Pagination (Recommended) ✅

Update your service and component to work with paginated data:

#### Step 1: Update Type Definitions

```typescript
// src/types/api.ts
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
```

#### Step 2: Update Service

```typescript
// src/services/adminService.ts
import api from './auth';
import { PaginatedResponse } from '../types/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const adminService = {
  // Return paginated response
  getUsers: (page: number = 1): Promise<PaginatedResponse<User>> =>
    api.get(`/admin/users?page=${page}`).then((res) => res.data),
  
  // Or if you want all users without pagination, create a new endpoint
  getAllUsers: (): Promise<User[]> =>
    api.get('/admin/users/all').then((res) => res.data),
};
```

#### Step 3: Update Component with TanStack Query

```typescript
// src/pages/admin/UsersPage.tsx
import { useQuery } from '@tanstack/react-query';
import { adminService, PaginatedResponse, User } from '../../services/adminService';
import { useState } from 'react';

export const UsersPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data, isLoading, error } = useQuery<PaginatedResponse<User>>({
    queryKey: ['users', page],
    queryFn: () => adminService.getUsers(page),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;
  if (!data) return <div>No users found</div>;

  // Access the array from data.data
  const users = data.data;

  // Now filter works correctly
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users Management</h1>
      
      {/* Search and Filter Controls */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        />
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="professor">Professors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'professor' ? 'bg-blue-100 text-blue-800' : 
                      'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Showing {data.from} to {data.to} of {data.total} users
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data.prev_page_url}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {data.current_page} of {data.last_page}
          </span>
          
          <button
            onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
            disabled={!data.next_page_url}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### Option 2: Change Backend to Return Plain Array

If you don't need pagination, update the backend controller:

```php
// app/Http/Controllers/Api/AdminController.php
public function users()
{
    // Option A: Get all users (no pagination)
    $users = User::latest()->get();
    return response()->json($users);
    
    // Option B: Add a separate endpoint for non-paginated users
    // Keep the existing paginated endpoint and add:
}

public function allUsers()
{
    $users = User::latest()->get();
    return response()->json($users);
}
```

Then update routes:

```php
// routes/api.php
Route::middleware(['api.role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'users']);           // Paginated
    Route::get('/users/all', [AdminController::class, 'allUsers']);    // All users
    // ... other routes
});
```

Frontend stays simple:

```typescript
// src/services/adminService.ts
export const adminService = {
  getUsers: (): Promise<User[]> =>
    api.get('/admin/users/all').then((res) => res.data),
};
```

---

### Option 3: Quick Fix - Extract Data in Service Layer

Keep backend as-is but fix in service:

```typescript
// src/services/adminService.ts
export const adminService = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    // Extract the data array from paginated response
    return response.data.data || [];
  },
};
```

⚠️ **Warning**: This loses pagination info. Only use if you're sure you'll never need pagination.

---

## Other Endpoints with Same Issue

Check these endpoints that also use pagination:

| Endpoint | Controller Method | Uses Pagination? |
|----------|------------------|------------------|
| `/api/admin/users` | `AdminController::users()` | ✅ Yes |
| `/api/admin/requests` | `AdminController::requests()` | ✅ Yes |
| `/api/professor/modules` | `ProfessorController::modules()` | Check implementation |
| `/api/student/results` | `StudentController::results()` | Check implementation |

### Fix All at Once

Create a helper function:

```typescript
// src/utils/api.ts
export const extractData = <T>(response: any): T[] => {
  // Handle paginated responses
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  // Handle plain array responses
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // Fallback
  return [];
};
```

Use it in services:

```typescript
// src/services/adminService.ts
import { extractData } from '../utils/api';

export const adminService = {
  getUsers: (): Promise<User[]> =>
    api.get('/admin/users').then((res) => extractData<User>(res)),
  
  getRequests: (): Promise<AdministrativeRequest[]> =>
    api.get('/api/admin/requests').then((res) => extractData<AdministrativeRequest>(res)),
};
```

---

## Best Practice Recommendation

✅ **Use Option 1** (Handle pagination properly) because:
- Better performance with large datasets
- Better UX with page-by-page loading
- Standard Laravel pagination pattern
- Easy to add search/filter/sort later

❌ **Avoid Option 3** because:
- Hides important pagination metadata
- Can cause memory issues with large datasets
- Makes debugging harder

---

## Debugging Tips

### Check What You're Receiving

```typescript
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: () => adminService.getUsers(),
  onSuccess: (data) => {
    console.log('Full response:', data);
    console.log('Is array?', Array.isArray(data));
    console.log('Has data.data?', data?.data);
    console.log('Type:', typeof data);
  },
});
```

### Add TypeScript Safety

```typescript
// Always check before using array methods
const users = Array.isArray(data) ? data : (data?.data ?? []);

// Or with optional chaining
const filteredUsers = (data?.data ?? []).filter(user => ...);
```

---

## Summary

**Problem**: Laravel pagination returns `{ data: [...] }` but frontend expects `[...]`

**Solution**: Access `response.data.data` instead of `response.data`

**Best Approach**: Use TanStack Query with proper TypeScript types for paginated responses

**Quick Fix**: Extract array in service layer with `response.data.data || []`

Choose the option that best fits your needs! 🚀

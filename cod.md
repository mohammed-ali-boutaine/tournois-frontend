# React Frontend

Here's how to set up the React frontend for our Laravel API:

## 1. Create a new React project

```bash
npx create-react-app react-laravel-app
cd react-laravel-app
npm install axios react-router-dom
```

## 2. Set up API client

Create a new file `src/api/axios.js`:

```javascript
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the token
axiosClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axiosClient;
```

## 3. Create AuthContext for global state management

Create a new file `src/context/AuthContext.js`:

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await axiosClient.get('/user');
          setUser(response.data);
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/register', userData);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/login', credentials);
      setUser(response.data.user);
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    try {
      await axiosClient.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
```

## 4. Create components for authentication

Create `src/components/Register.js`:

```javascript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password_confirmation">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
      </p>
    </div>
  );
};

export default Register;
```

Create `src/components/Login.js`:

```javascript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
      </p>
    </div>
  );
};

export default Login;
```

## 5. Create components for posts

Create `src/components/PostList.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosClient.get('/posts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosClient.delete(`/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading posts...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Posts</h2>
        {user && (
          <Link
            to="/posts/create"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create New Post
          </Link>
        )}
      </div>
      
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet. Be the first to create one!</p>
      ) : (
        <div className="grid gap-6">
          {posts.map(post => (
            <div
              key={post.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <div className="text-sm text-gray-500">
                  By {post.user.name}
                </div>
              </div>
              <p className="text-gray-700 mt-2 mb-4">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Read More
                </Link>
                {user && user.id === post.user_id && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/posts/${post.id}/edit`}
                      className="text-yellow-500 hover:text-yellow-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
```

Create `src/components/PostDetail.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosClient.get(`/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axiosClient.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading post...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!post) return <div className="text-center mt-10">Post not found</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <div className="text-gray-500 mb-6">
        Posted by {post.user.name} on {new Date(post.created_at).toLocaleDateString()}
      </div>
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{post.content}</p>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <Link
          to="/"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back to Posts
        </Link>
        
        {user && user.id === post.user_id && (
          <>
            <Link
              to={`/posts/${post.id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
```

Create `src/components/PostForm.js` (used for both Create and Edit):

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axios';

const PostForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    const fetchPost = async () => {
      if (isEditing) {
        try {
          const response = await axiosClient.get(`/posts/${id}`);
          setFormData({
            title: response.data.title,
            content: response.data.content,
          });
        } catch (err) {
          console.error('Error fetching post:', err);
          navigate('/');
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchPost();
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    try {
      if (isEditing) {
        await axiosClient.put(`/posts/${id}`, formData);
      } else {
        await axiosClient.post('/posts', formData);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving post:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
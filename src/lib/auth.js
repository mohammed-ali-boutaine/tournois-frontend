import clientApi from "./clientApi";

async function register(userData) {
  try {
    const response = await clientApi.post("/api/register", userData);
    const { token } = response.data;

    // Store token
    localStorage.setItem("token", token);

    // Set authorization header for future requests
    clientApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data.user;
  } catch (e) {
    console.error("Registration failed:", e);
    throw e;
  }
}

async function login(credentials) {
  try {
    const response = await clientApi.post("/api/login", credentials);
    const { token } = response.data;

    // Store token
    localStorage.setItem("token", token);

    // Set authorization header for future requests
    clientApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data.user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

// Logout user
async function logout() {
  try {
    await clientApi.post("/api/logout");

    // Remove token
    localStorage.removeItem("token");

    // Remove authorization header
    delete clientApi.defaults.headers.common["Authorization"];
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

export { login, register, logout };

import { getToken } from "./authStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function signup(
    name: string,
    email:string,
    password:string
){
    const response = await fetch(`${API_URL}/auth/signup`,{
        method:"POST",

        headers:{
            "Content-Type":"application/json",
        },

        body: JSON.stringify({
            name,
            email,
            password
        }),

    });

    const data = await response.json();

    if (!response.ok) {
      let message = "SignUP failed";

      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail[0]?.msg || "Invalid input";
      }

      

      throw new Error(message);
  }

    return data;
}

export async function login(
  email: string,
  password: string
) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  

  if (!response.ok) {
    let message = "Login failed";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail[0]?.msg || "Invalid input";
    }

    

    throw new Error(message);
  }


  return data;
}

export async function getMe() {
  const token = await getToken();

  if(!token){
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/auth/me`,{
    method: 'GET',
    headers:{
      Authorization:`Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    let message = "failed to get user";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail[0]?.msg || "Invalid input";
    }

    

    throw new Error(message);
  }

  return data;
}

export async function getHabits(){
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found")

  }

  const response = await fetch(`${API_URL}/habits/`,
    {
      method:"GET",
      headers:{
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  
  if (!response.ok) {
    let message = "failed to get habits";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail[0]?.msg || "Something went wrong ";
    }

    

    throw new Error(message);
  }

  return data;
}

export async function createHabit(name: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_URL}/habits/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    let message = "Failed to create habit";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail[0]?.msg || "Invalid input";
    }

    throw new Error(message);
  }

  return data;
}

export async function updateHabit(
  habitId: number,
  completed: boolean
) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_URL}/habits/${habitId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        completed,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    let message = "Failed to update habit";

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail[0]?.msg || "Invalid input";
    }

    throw new Error(message);
  }

  return data;
}

export async function deleteHabit(habitId: number) {
  const token = await getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}/habits/${habitId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let message = "Failed to delete habit";

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // No JSON response
    }

    throw new Error(message);
  }

  // DELETE endpoint returns 204 No Content.
  // Don't call response.json() here.
  return true;
}
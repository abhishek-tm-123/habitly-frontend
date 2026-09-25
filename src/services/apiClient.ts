import {
    getAccessToken,
    getRefreshToken,
    removeTokens,
    saveTokens
} from "./authStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken){
    throw new Error("No refresh token")
  }

  const response = await fetch(
    `${API_URL}/auth/refresh`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        refresh_token:refreshToken,
      }),
    }
  );

  if (!response.ok){
    throw new Error("refresh failed");
  }

  const data = await response.json();

  await saveTokens(
    data.access_token,
    data.refresh_token
  )

  return data.access_token;
}

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
){
    let accessToken = await getAccessToken();

    if (!accessToken){
        throw new Error("No authentication token found");
        
    }

    let response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers:{
                "Content-Type": "application/json",
                ...options.headers,
                Authorization:`Bearer ${accessToken}`,
            },
        }
    );

    if (response.status === 401){
        try{
            // Get new access token
            accessToken = await refreshAccessToken();

            //retry original request
            response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    ...options,
                    headers:{
                        "Content-Type": "application/json",
                        ...options.headers,
                        Authorization:`Bearer ${accessToken}`,
                    },
                }
            )
        } catch{
            // Refresh token expired/invalid

            await removeTokens();

            throw new Error("SESSION_EXPIRED");
        }
    }

    return response
}
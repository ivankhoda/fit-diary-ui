import { useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  email: string;
  admin: boolean;
  exp: number;
}

export const useToken = () => {
  const getToken = (): string | null => {
    const tokenString = localStorage.getItem("token");

    try {
      return tokenString ? JSON.parse(tokenString) : null;
    } catch (error) {
      console.error("Error parsing token from localStorage:", error);
      return null;
    }
  };

  const [token, setToken] = useState<string | null>(getToken());

  const decodeToken = useCallback((): DecodedToken | null => {
    if (!token) return null;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }, [token]);

  const saveToken = (userToken: string | null) => {
    if (userToken) {
      localStorage.setItem("token", JSON.stringify(userToken));
      setToken(userToken);
    } else {
      console.warn("Attempted to save an undefined token:", userToken);
    }
  };


  const isAdmin = (): boolean => {
    const decoded = decodeToken();
    return decoded?.admin || false;
  };

  return {
    token,
    setToken: saveToken,
    getToken,
    isAdmin,
    decodeToken,
  };
};

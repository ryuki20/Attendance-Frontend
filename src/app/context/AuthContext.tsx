"use client";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import type { Employee } from "../types";

const SESSION_KEY_TOKEN = "token";
const SESSION_KEY_EMPLOYEE = "AuthEmployee";
const AUTH_CHANGE_EVENT = "auth-change";

function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function subscribeToAuth(callback: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => window.removeEventListener(AUTH_CHANGE_EVENT, callback);
}

let _cachedStored: string | null = undefined as unknown as null;
let _cachedToken: string | null = undefined as unknown as null;
let _cachedEmployee: Employee | null = null;

function getAuthSnapshot(): Employee | null {
  const stored = sessionStorage.getItem(SESSION_KEY_EMPLOYEE);
  const token = sessionStorage.getItem(SESSION_KEY_TOKEN);
  if (stored === _cachedStored && token === _cachedToken) {
    return _cachedEmployee;
  }
  _cachedStored = stored;
  _cachedToken = token;
  _cachedEmployee = stored && token ? (JSON.parse(stored) as Employee) : null;
  return _cachedEmployee;
}

function getServerSnapshot(): Employee | null {
  return null;
}

type AuthContextType = {
  employee: Employee | null;
  isHydrated: boolean;
  login: (employee: Employee, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const employee = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const login = (emp: Employee, token: string) => {
    sessionStorage.setItem(SESSION_KEY_TOKEN, token);
    sessionStorage.setItem(SESSION_KEY_EMPLOYEE, JSON.stringify(emp));
    notifyAuthChange();
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY_TOKEN);
    sessionStorage.removeItem(SESSION_KEY_EMPLOYEE);
    notifyAuthChange();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ employee, isHydrated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CryptoJS from 'crypto-js';

const secretKey = 'CLAVESECRETASEGURA'; 

const encryptToken = (token) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(token, secretKey).toString();
    console.log('Token encrypted successfully:', encrypted);
    return encrypted;
  } catch (error) {
    console.error('Error encrypting token:', error);
    throw error;
  }
};

export const decryptToken = (encryptedToken) => {
  try {
    console.log('Attempting to decrypt token:', encryptedToken);
    const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
    const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedToken) throw new Error('Malformed UTF-8 data');
    console.log('Token decrypted successfully:', decryptedToken);
    return decryptedToken;
  } catch (error) {
    console.error('Error decrypting token:', error);
    throw error;
  }
};

const initialState = {
  user: null,
  token: null,
  error: null,
  loading: false,
};

const savedToken = localStorage.getItem('token');
if (savedToken) {
  try {
    initialState.token = decryptToken(savedToken);
  } catch (error) {
    console.error('Error initializing token from localStorage:', error);
    localStorage.removeItem('token');
  }
}

export const loginUser = createAsyncThunk('auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre: username, clave: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      const encryptedToken = encryptToken(data.token);
      localStorage.setItem('token', encryptedToken);
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.usuario;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

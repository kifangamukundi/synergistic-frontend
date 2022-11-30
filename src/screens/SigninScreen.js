import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LoginIcon from '@mui/icons-material/Login';
import Stack from '@mui/material/Stack';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Axios from 'axios';
import { Link as ReactRouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useContext, useReducer, useEffect, useState } from 'react';
import { Store } from '../Store';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';

const theme = createTheme();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_REQUEST':
      return { ...state, loginStatus: true };
    case 'SIGN_SUCCESS':
      return { ...state, loginStatus: false };
    case 'SIGN_FAIL':
      return { ...state, loginStatus: false, error: action.payload };
    default:
      return state;
  }
};

export default function SigninScreen() {
    const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [{ loginStatus, error }, dispatch] = useReducer(reducer, {
    error: '',
  });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'SIGN_REQUEST' });
            const { data } = await Axios.post(`${BASE_URL}/api/users/signin`, {
            email,
            password,
            });
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            dispatch({ type: 'SIGN_SUCCESS' });
            toast.success('Signed in Successfully');
            navigate(redirect || '/');
        } catch (err) {
          dispatch({
            type: 'SIGN_FAIL',
            payload: getError(err),
          });
          const resp = err.response.data.message;
          resp.forEach((item, index, arr) => {
            toast.error(item);
          }); 
        }
    };
    
    useEffect(() => {
        if (userInfo) {
        navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Helmet>
            <title>Sign In</title>
        </Helmet>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: '#587246' }}>
            <LoginIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {loginStatus ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <>
              {error.map((err) => (
                <MessageBox key={err} severity="error">{err}</MessageBox>
              ))}
            </>
          ) : (
            <></>
          )}
          
          <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              color="success"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loginStatus}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Box paddingY={2}>
                  <Stack direction="row" spacing={2}>
                    <Button disabled={loginStatus} color="success" component={ReactRouterLink} to={`/signup?redirect=${redirect}`} variant="contained" endIcon={<ArrowForwardIcon />}>
                      {"Don't have an account? Sign Up"}
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
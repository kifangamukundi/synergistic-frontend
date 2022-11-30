import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as ReactRouterLink, useNavigate, useParams } from 'react-router-dom';
import {  toast } from 'material-react-toastify';

import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError, BASE_URL } from '../utils';

import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stack from '@mui/material/Stack';

const theme = createTheme();


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function UserEditScreen() {
  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: userId } = params;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isFieldAgent, setIsFieldAgent] = useState(false);
  const [isFarmer, setIsFarmer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`${BASE_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setMobileNumber(data.mobileNumber);
        setEmail(data.email);
        setIsActive(data.isActive);
        setIsAdmin(data.isAdmin);
        setIsModerator(data.isModerator);
        setIsFieldAgent(data.isFieldAgent);
        setIsFarmer(data.isFarmer);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userId, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `${BASE_URL}/api/users/${userId}`,
        { 
          _id: userId,
          firstName,
          lastName,
          mobileNumber,
          email, 
          isActive, 
          isAdmin,
          isModerator,
          isFieldAgent,
          isFarmer
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('User updated successfully');
      navigate('/user/list');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Helmet>
            <title>Editing {firstName} {lastName}</title>
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
            <EditIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {firstName} {lastName}
          </Typography>
          {loadingUpdate && <LoadingBox></LoadingBox>}

          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox severity="error">{error}</MessageBox>
          ) : (
          <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="firstName">First  Name</InputLabel>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="lastName">Last  Name</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="mobileNumber">Mobile Number</InputLabel>
                <TextField
                  required
                  fullWidth
                  id="mobileNumber"
                  name="mobileNumber"
                  autoComplete="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </Grid>
              
              {userInfo && userInfo.isAdmin && (
                <>
                  <Grid item xs={12} sm={6}>
                    <InputLabel htmlFor="isAdmin">Admin Status</InputLabel>
                    <Checkbox
                      id="isAdmin"
                      color="success"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputLabel htmlFor="isModerator">Moderator Status</InputLabel>
                    <Checkbox
                      id="isModerator"
                      color="success"
                      checked={isModerator}
                      onChange={(e) => setIsModerator(e.target.checked)}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="isFieldAgent">FieldAgent Status</InputLabel>
                <Checkbox
                  id="isFieldAgent"
                  color="success"
                  checked={isFieldAgent}
                  onChange={(e) => setIsFieldAgent(e.target.checked)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="isFarmer">Farmer Status</InputLabel>
                <Checkbox
                  id="isFarmer"
                  color="success"
                  checked={isFarmer}
                  onChange={(e) => setIsFarmer(e.target.checked)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel htmlFor="isActive">Activity Status</InputLabel>
                <Checkbox
                    id="isActive"
                    color="success"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              disabled={loadingUpdate}
            >
              Update
            </Button>
            <Grid container>
              <Grid item>
                <Box paddingY={2}>
                  <Stack direction="row" spacing={2}>
                    <Button disabled={loadingUpdate} color="success" component={ReactRouterLink} to="/user/list" variant="contained" endIcon={<ArrowBackIcon />}>
                      Back
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

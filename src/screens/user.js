import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import { useContext, useEffect, useReducer, useState } from 'react';
import { Link as ReactRouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          users: action.payload.users,
          page: action.payload.page,
          pages: action.payload.pages,
          countUsers: action.payload.countUsers,
          loading: false,
        };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
      case 'DELETE_REQUEST':
        return { ...state, loadingDelete: true, successDelete: false };
      case 'DELETE_SUCCESS':
        return {
          ...state,
          loadingDelete: false,
          successDelete: true,
        };
      case 'DELETE_FAIL':
        return { ...state, loadingDelete: false, successDelete: false };
      case 'DELETE_RESET':
        return { ...state, loadingDelete: false, successDelete: false };
      default:
        return state;
    }
  };
  
  const isUserActive = [
    {
      name: 'Active',
      value: 'true',
    },
    {
      name: 'Not Active',
      value: 'false',
    },
  ];
  const isUserAdmin = [
    {
      name: 'Admin',
      value: 'true',
    },
    {
      name: 'Not Admin',
      value: 'false',
    },
  ];
  const isUserModerator = [
    {
      name: 'Moderator',
      value: 'true',
    },
    {
      name: 'Not Moderator',
      value: 'false',
    },
  ];
  const isUserFieldAgent = [
    {
      name: 'Field Agent',
      value: 'true',
    },
    {
      name: 'Not Field Agent',
      value: 'false',
    },
  ];
  const isUserFarmer = [
    {
      name: 'Farmer',
      value: 'true',
    },
    {
      name: 'Not Farmer',
      value: 'false',
    },
  ];

export default function Test() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState('');
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const isActive = sp.get('isActive') || 'all';
  const isAdmin = sp.get('isAdmin') || 'all';
  const isModerator = sp.get('isModerator') || 'all';
  const isFieldAgent = sp.get('isFieldAgent') || 'all';
  const isFarmer = sp.get('isFarmer') || 'all';
  const query = sp.get('query') || 'all';
  const page = sp.get('page') || 1;

  const [{ loading, error, users, pages, countUsers, loadingDelete,
    successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

    const { state } = useContext(Store);
    const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/api/users/search?page=${page}&query=${query}&isActive=${isActive}&isAdmin=${isAdmin}&isModerator=${isModerator}&isFieldAgent=${isFieldAgent}&isFarmer=${isFarmer}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [successDelete, isActive, isAdmin, isModerator, isFieldAgent, isFarmer, error, page, query]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterIsActive = filter.isActive || isActive;
    const filterIsAdmin = filter.isAdmin || isAdmin;
    const filterIsModerator = filter.isModerator || isModerator;
    const filterIsFieldAgent = filter.isFieldAgent || isFieldAgent;
    const filterIsFarmer = filter.isFarmer || isFarmer;
    const filterQuery = filter.query || query;
    return `/user/list?isActive=${filterIsActive}&isAdmin=${filterIsAdmin}&isModerator=${filterIsModerator}&isFieldAgent=${filterIsFieldAgent}&isFarmer=${filterIsFarmer}&query=${filterQuery}&page=${filterPage}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/user/list/?query=${queryParams}` : '/user/list');
  };
  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`${BASE_URL}/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('user deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (error) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            Live From Space
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            Mac Miller
          </Typography>
        </CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="previous">
            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
          </IconButton>
          <IconButton aria-label="play/pause">
            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
          </IconButton>
          <IconButton aria-label="next">
            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="/static/images/cards/live-from-space.jpg"
        alt="Live from space album cover"
      />
    </Card>
  );
}
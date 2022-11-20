import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Drawer from '@mui/material/Drawer';
import FilterListIcon from '@mui/icons-material/FilterList';



import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';


import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useContext, useEffect, useReducer, useState } from 'react';
import { Link as ReactRouterLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

// shiet
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

import { formatDistance } from 'date-fns';

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

export default function UserListScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
  const handleChipDelete = () => {
    navigate('/user/list');
  };

  return (
    <div>
      <Helmet>
        <title>Search Users</title>
      </Helmet>
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox severity="error">{error}</MessageBox>
          ) : (
            <>
            
              {/* Search feature */}
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search For Users"
                  inputProps={{ 'aria-label': 'search users' }}
                  onChange={(e) => setQueryParams(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                />
                <IconButton onClick={submitHandler} type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton sx={{ p: '10px', color: "#00693e" }} aria-label="directions">
                  <FilterListIcon onClick={() => setIsDrawerOpen(true)}/>
                </IconButton>
              </Paper>
              <br/>

              {users.length === 0 && (
                <MessageBox>No User Found</MessageBox>
              )}
              <br/>

              {/* Results */}
              <Stack direction="row" spacing={1}>
              {countUsers === 0 ? 'No' : countUsers} Results
                {query !== 'all' && ' for '}
                {query !== 'all' ? (
                  <Chip label={query} variant="outlined" onDelete={handleChipDelete} />
                ) : null}
              </Stack>
              <br/>
              
              {/* Filter Feature */}
              <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box p={2} width='250px' textAlign='center' role='presentation'>
                  <nav aria-label="main mailbox folders">
                    <List>
                      
                      {/* Admins */}
                      <Link style={{textDecoration: 'none', color: 'black'}} component={ReactRouterLink} to={getFilterUrl({ isAdmin: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isAdmin ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="All Including Admins" />
                          </ListItemButton>
                        </ListItem>
                        </Link>

                        {isUserAdmin.map((iua) => (
                          <Link style={{textDecoration: 'none', color: 'black'}} key={iua.value} component={ReactRouterLink} to={getFilterUrl({ isAdmin: iua.value })}>
                            <ListItem disablePadding key={iua.value}>
                              <ListItemButton style={iua.value === isAdmin ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <AdminPanelSettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary={iua.name} />
                              </ListItemButton>
                            </ListItem>
                        </Link>
                        ))}

                      {/* Moderators */}
                      <Divider />
                      <Link style={{textDecoration: 'none', color: 'black'}} component={ReactRouterLink} to={getFilterUrl({ isModerator: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isModerator ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="All Including Moderators" />
                          </ListItemButton>
                        </ListItem>
                        </Link>
                        
                        {isUserModerator.map((ium) => (
                          <Link style={{textDecoration: 'none', color: 'black'}} key={ium.value} component={ReactRouterLink} to={getFilterUrl({ isModerator: ium.value })}>
                            <ListItem disablePadding key={ium.value}>
                              <ListItemButton style={ium.value === isModerator ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <AddModeratorIcon />
                                </ListItemIcon>
                                <ListItemText primary={ium.name} />
                              </ListItemButton>
                            </ListItem>
                        </Link>
                        ))}

                      {/* Field Agents */}
                      <Divider />
                      <Link style={{textDecoration: 'none', color: 'black'}} component={ReactRouterLink} to={getFilterUrl({ isFieldAgent: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isFieldAgent ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="All Including FieldAgents" />
                          </ListItemButton>
                        </ListItem>
                        </Link>
                        
                        {isUserFieldAgent.map((iufa) => (
                          <Link style={{textDecoration: 'none', color: 'black'}} key={iufa.value} component={ReactRouterLink} to={getFilterUrl({ isFieldAgent: iufa.value })}>
                            <ListItem disablePadding key={iufa.value}>
                              <ListItemButton style={iufa.value === isFieldAgent ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <SupportAgentIcon />
                                </ListItemIcon>
                                <ListItemText primary={iufa.name} />
                              </ListItemButton>
                            </ListItem>
                        </Link>
                        ))}

                      {/* Farmers */}
                      <Divider />
                      <Link style={{textDecoration: 'none', color: 'black'}} component={ReactRouterLink} to={getFilterUrl({ isFarmer: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isFarmer ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary="All Including Farmers" />
                          </ListItemButton>
                        </ListItem>
                        </Link>
                        
                        {isUserFarmer.map((iuf) => (
                          <Link style={{textDecoration: 'none', color: 'black'}} key={iuf.value} component={ReactRouterLink} to={getFilterUrl({ isFarmer: iuf.value })}>
                            <ListItem disablePadding key={iuf.value}>
                              <ListItemButton style={iuf.value === isFarmer ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <AgricultureIcon />
                                </ListItemIcon>
                                <ListItemText primary={iuf.name} />
                              </ListItemButton>
                            </ListItem>
                        </Link>
                        ))}

                      {/* Active */}
                      <Divider />
                      <Link style={{textDecoration: 'none', color: 'black'}} component={ReactRouterLink} to={getFilterUrl({ isActive: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isActive ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <MoreHorizIcon />
                            </ListItemIcon>
                            <ListItemText primary="Both Active and Inactive" />
                          </ListItemButton>
                        </ListItem>
                        </Link>
                        
                        {isUserActive.map((iua) => (
                          <Link style={{textDecoration: 'none', color: 'black'}} key={iua.value} component={ReactRouterLink} to={getFilterUrl({ isActive: iua.value })}>
                            <ListItem disablePadding key={iua.value}>
                              <ListItemButton style={iua.value === isActive ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <NotificationImportantIcon />
                                </ListItemIcon>
                                <ListItemText primary={iua.name} />
                              </ListItemButton>
                            </ListItem>
                        </Link>
                        ))}

                    </List>
                  </nav>
                </Box>
              </Drawer>

              {/* cards */}
              <Container>
                <Grid container spacing={3}>
                  
                {users.map((user) => (
                  <Grid item xs={12} sm={6} md={3}>

                    <Card sx={{ maxWidth: 345 }} elevation={1}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={user.image}
                        alt={user.firstName}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.mobileNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <IconButton sx={{color: "#00693e"}} onClick={() => navigate(`/user/edit/${user._id}`)} aria-label="edit">
                              <EditIcon/>
                          </IconButton>
                        )}
                        {userInfo && userInfo.isAdmin && (
                        <IconButton sx={{color: "#00693e"}} onClick={() => deleteHandler(user)} aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                        )}
                      </CardActions>
                    </Card>

                  </Grid>
                  ))}

                </Grid>
              </Container>

              <div>
                {[...Array(pages).keys()].map((x) => (
                  <LinkContainer
                    key={x + 1}
                    className="mx-1"
                    to={getFilterUrl({ page: x + 1 })}
                  >
                    <Button
                      className={Number(page) === x + 1 ? 'text-bold' : ''}
                      variant="light"
                    >
                      {x + 1}
                    </Button>
                  </LinkContainer>
                ))}
              </div>
            </>
          )}
    </div>
  );
}
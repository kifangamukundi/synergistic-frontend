import * as React from 'react';
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

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

// new stuff
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ClassIcon from '@mui/icons-material/Class';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import NumbersIcon from '@mui/icons-material/Numbers';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AddBoxIcon from '@mui/icons-material/AddBox';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


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
        surveys: action.payload.surveys,
        page: action.payload.page,
        pages: action.payload.pages,
        countSurveys: action.payload.countSurveys,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
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

const surveyResponses = [
  {
    name: '1 to 50',
    value: '1-50',
  },
  {
    name: '51 to 200',
    value: '51-200',
  },
  {
    name: '201 to 1000',
    value: '201-1000',
  },
];
const isSurveyActive = [
  {
    name: 'Active',
    value: 'true',
  },
  {
    name: 'Closed',
    value: 'false',
  },
];

export default function SearchScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState('');
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const isActive = sp.get('isActive') || 'all';
  const query = sp.get('query') || 'all';
  const numResponses = sp.get('numResponses') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, surveys, pages, countSurveys, loadingDelete, successDelete, loadingCreate }, dispatch] =
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
          `${BASE_URL}/api/surveys/search?page=${page}&query=${query}&category=${category}&isActive=${isActive}&numResponses=${numResponses}&order=${order}`
        );
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
  }, [category, isActive, error, order, page, numResponses, query, successDelete]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/surveys/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterIsActive = filter.isActive || isActive;
    const filterQuery = filter.query || query;
    const filterNumResponses = filter.numResponses || numResponses;
    const sortOrder = filter.order || order;
    return `/survey/list?category=${filterCategory}&isActive=${filterIsActive}&query=${filterQuery}&numResponses=${filterNumResponses}&order=${sortOrder}&page=${filterPage}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/survey/list/?query=${queryParams}` : '/survey/list');
  };

  const deleteHandler = async (survey) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`${BASE_URL}/api/surveys/${survey._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('survey deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          `${BASE_URL}/api/surveys`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('Survey created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/survey/edit/${data.survey._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };
  const handleChipDelete = () => {
    navigate('/survey/list');
  };

  return (
    <Container maxWidth="xl" style={{ background: '#f5f5f5' }}>
      {/* style={{ background: '#f5f5f5' }} */}
      <Helmet>
        <title>Search Tools</title>
      </Helmet>
          {loadingCreate && <Box paddingY={1}><LoadingBox></LoadingBox></Box>}
          {loadingDelete && <Box paddingY={1}><LoadingBox></LoadingBox></Box>}
          {loading ? (
            <Box paddingY={1}><LoadingBox></LoadingBox></Box>
          ) : error ? (
            <Box paddingY={1}>
              <MessageBox severity="error">{error}</MessageBox>
            </Box>
          ) : (
            <>
            
              {/* Search feature */}
              <Box paddingY={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Paper
                  component="form"
                  sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 'auto' }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search For Tools"
                    inputProps={{ 'aria-label': 'search tools' }}
                    onChange={(e) => setQueryParams(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && e.preventDefault()}
                  />
                  <IconButton onClick={submitHandler} type="button" sx={{ p: '10px', color: "#00693e" }} aria-label="search">
                    <SearchIcon />
                  </IconButton>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton sx={{ p: '10px', color: "#00693e" }} aria-label="directions">
                    <FilterListIcon onClick={() => setIsDrawerOpen(true)}/>
                  </IconButton>

                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                    <IconButton sx={{ p: '10px', color: "#00693e" }} aria-label="create">
                      <AddBoxIcon onClick={createHandler}/>
                    </IconButton>
                  )}
                </Paper>
              </Box>

              {surveys.length === 0 && (
                <Box paddingY={1}>
                  <MessageBox><Typography variant='h6' component='body1'>No Tool Found</Typography></MessageBox>
                </Box>
              )}

              {/* Results */}
              <Box paddingY={1}>
                <Stack direction="row" spacing={1}>
                {countSurveys === 0 ? <Typography variant='h6' component='body1'>No</Typography> : <Typography variant='h6' component='body1'> <Chip label={countSurveys} color="success" /></Typography>} <Typography variant='h6' component='body1'>Results</Typography>
                  {query !== 'all' && <Typography variant='h6' component='body1'>Query {`"${query}"`}</Typography>}
                  {category !== 'all' && <Typography variant='h6' component='body1'>Category {`"${category}"`}</Typography>}
                  {query !== 'all' ||
                  category !== 'all' ||
                  numResponses !== 'all' ? (
                    <Chip label={<Typography variant='h6' component='body1'>{"Clear"}</Typography>} variant="outlined" onDelete={handleChipDelete} />
                  ) : null}
                </Stack>
              </Box>
              
              {/* Filter Feature */}
              <Drawer anchor='right' open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box sx={{ backgroundColor: '#f5f5f5' }} p={2} width='250px' textAlign='center' role='presentation'>
                  <nav aria-label="main mailbox folders">
                    <List>
                      
                      {/* Categories */}
                      <Link style={{textDecoration: 'none', color: '#587246'}} component={ReactRouterLink} to={getFilterUrl({ category: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === category ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <GroupIcon sx={'all' === category ? { color: "white"}: {color: "#587246"}}/>
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' component="body1">Any category</Typography>} />
                          </ListItemButton>
                        </ListItem>
                      </Link>

                      {categories.map((cat) => (
                        <Link style={{textDecoration: 'none', color: '#587246'}} key={cat} component={ReactRouterLink} to={getFilterUrl({ category: cat })}>
                          <ListItem disablePadding key={cat}>
                            <ListItemButton style={cat === category ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                              <ListItemIcon>
                                <ClassIcon sx={cat === category ? { color: "white"}: {color: "#587246"}}/>
                              </ListItemIcon>
                              <ListItemText primary={<Typography variant='body1' component="body1">{cat}</Typography>} />
                            </ListItemButton>
                          </ListItem>
                      </Link>
                      ))}

                      {/* Responses */}
                      <Box>
                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <Link style={{textDecoration: 'none', color: '#587246'}} component={ReactRouterLink} to={getFilterUrl({ numResponses: 'all' })}>
                            <ListItem disablePadding>
                              <ListItemButton style={'all' === numResponses ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <FormatListNumberedIcon sx={'all' === numResponses ? { color: "white"}: {color: "#587246"}}/>
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant='body1' component="body1">All Responses</Typography>} />
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        )}
                      </Box>

                        {surveyResponses.map((sr) => (
                          <Box>
                            {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                            <Link style={{textDecoration: 'none', color: '#587246'}} key={sr.value} component={ReactRouterLink} to={getFilterUrl({ numResponses: sr.value })}>
                              <ListItem disablePadding key={sr.value}>
                                <ListItemButton style={sr.value === numResponses ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                  <ListItemIcon>
                                    <NumbersIcon sx={sr.value === numResponses ? { color: "white"}: {color: "#587246"}}/>
                                  </ListItemIcon>
                                  <ListItemText primary={<Typography variant='body1' component="body1">{sr.name}</Typography>} />
                                </ListItemButton>
                              </ListItem>
                            </Link>
                            )}
                          </Box>
                        ))}

                      {/* Status */}
                      <Divider />
                      <Link style={{textDecoration: 'none', color: '#587246'}} component={ReactRouterLink} to={getFilterUrl({ isActive: 'all' })}>
                        <ListItem disablePadding>
                          <ListItemButton style={'all' === isActive ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                            <ListItemIcon>
                              <AutoFixHighIcon sx={'all' === isActive ? { color: "white"}: {color: "#587246"}}/>
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant='body1' component="body1">Any status</Typography>} />
                          </ListItemButton>
                        </ListItem>
                      </Link>
                        
                        {isSurveyActive.map((isa) => (
                          <Link style={{textDecoration: 'none', color: '#587246'}} key={isa.value} component={ReactRouterLink} to={getFilterUrl({ isActive: isa.value })}>
                            <ListItem disablePadding key={isa.value}>
                              <ListItemButton style={isa.value === isActive ? {  backgroundColor: '#587246', color: 'white'}: {color: ''}}>
                                <ListItemIcon>
                                  <ToggleOnIcon sx={isa.value === isActive ? { color: "white"}: {color: "#587246"}}/>
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant='body1' component="body1">{isa.name}</Typography>} />
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        ))}

                      {/* Sort */}
                      <Divider />
                      <Box paddingY={1}>
                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <FormControl fullWidth>
                            <InputLabel htmlFor="sort">Sort</InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Sort"
                              value={order} 
                              onChange={(e) => {
                                navigate(getFilterUrl({ order: e.target.value }));
                              }}
                            >
                              <MenuItem value={"newest"}>Newest Surveys</MenuItem>
                              <MenuItem value={"lowest"}>Responses: Low to High</MenuItem>
                              <MenuItem value={"highest"}>Responses: High to Low</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Box>

                    </List>
                  </nav>
                </Box>
              </Drawer>

              {/* cards */}
                <Grid container spacing={3}>
                  
                {surveys.map((survey) => (
                  <Grid item xs={12} sm={6} md={3} key={survey._id}>

                    <Card sx={{ maxWidth: 345 }} elevation={1}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={survey.image}
                        alt={survey.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {survey.name.slice(0, 50)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {survey.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {survey.description.slice(0, 90)}
                        </Typography>
                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Responses: {survey.numResponses}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Created: {formatDistance(new Date(survey.createdAt), new Date(), {addSuffix: true})}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Updated: {formatDistance(new Date(survey.updatedAt), new Date(), {addSuffix: true})}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                      <CardActions>

                        
                        {userInfo && userInfo.isAdmin && (
                          <IconButton sx={{color: "#00693e"}} onClick={() => navigate(`/survey/analysis/${survey.slug}`)} aria-label="analysis">
                              <AssessmentIcon/>
                          </IconButton>
                        )}

                        {survey.isActive === false ? (
                          <IconButton sx={{color: "#00693e"}} aria-label="locked">
                            <LockIcon/>
                          </IconButton>
                        ) : (
                          <IconButton sx={{color: "#00693e"}} onClick={() => { navigate(`/survey/${survey.slug}`);}} aria-label="show">
                              <VisibilityIcon/>
                          </IconButton>
                        )}

                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <IconButton sx={{color: "#00693e"}} onClick={() => navigate(`/survey/edit/${survey._id}`)} aria-label="edit">
                              <EditIcon/>
                          </IconButton>
                        )}

                        {userInfo && userInfo.isAdmin && (
                        <IconButton sx={{color: "#00693e"}} onClick={() => deleteHandler(survey)} aria-label="delete">
                            <DeleteIcon/>
                        </IconButton>
                        )}
                        

                      </CardActions>
                    </Card>

                  </Grid>
                  ))}

                </Grid>

              <Box paddingY={1}>
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
              </Box>
            </>
          )}
    </Container>
  );
}
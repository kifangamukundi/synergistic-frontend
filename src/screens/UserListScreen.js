import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import LinkContainer from 'react-router-bootstrap/LinkContainer';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import ListGroup from 'react-bootstrap/ListGroup';

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
    <div>
      <Helmet>
        <title>Search Users</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h4 className='mb-3'>By Admin Role</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isAdmin: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isAdmin ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isUserAdmin.map((iua) => (
                <div key={iua.value}>
                  <Link to={getFilterUrl({ isAdmin: iua.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={iua.value === isAdmin ? 'primary' : 'light'}>
                      {iua.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>By Moderator Role</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isModerator: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isModerator ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isUserModerator.map((ium) => (
                <div key={ium.value}>
                  <Link to={getFilterUrl({ isModerator: ium.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={ium.value === isModerator ? 'primary' : 'light'}>
                      {ium.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>By Field Agent Role</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isFieldAgent: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isFieldAgent ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isUserFieldAgent.map((iufa) => (
                <div key={iufa.value}>
                  <Link to={getFilterUrl({ isFieldAgent: iufa.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={iufa.value === isFieldAgent ? 'primary' : 'light'}>
                      {iufa.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>By Farmer Role</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isFarmer: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isFarmer ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isUserFarmer.map((iuf) => (
                <div key={iuf.value}>
                  <Link to={getFilterUrl({ isFarmer: iuf.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={iuf.value === isFarmer ? 'primary' : 'light'}>
                      {iuf.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>By Current Status</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isActive: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isActive ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isUserActive.map((iua) => (
                <div key={iua.value}>
                  <Link to={getFilterUrl({ isActive: iua.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={iua.value === isActive ? 'primary' : 'light'}>
                      {iua.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
        </Col>
        <Col md={9}>
          {loadingDelete && <LoadingBox></LoadingBox>}
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countUsers === 0 ? 'No' : countUsers} Results
                    {query !== 'all' && ' : ' + query}
                    {query !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/user/list')}
                      >
                        <i className="fas fa-times-circle"></i>
                      </Button>
                    ) : null}
                  </div>
                </Col>
                <Col md={6}>
                  <Form className="d-flex me-auto" onSubmit={submitHandler}>
                    <InputGroup>
                      <FormControl
                        type="text"
                        name="q"
                        id="q"
                        onChange={(e) => setQueryParams(e.target.value)}
                        placeholder="search users..."
                        aria-label="Search users"
                        aria-describedby="button-search"
                      ></FormControl>
                      <Button variant="outline-success" type="submit" id="button-search">
                        <i className="fas fa-search"></i>
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
              </Row>
              {users.length === 0 && (
                <MessageBox>No User Found</MessageBox>
              )}

              <Row>
                {users.map((user) => (
                  <Col sm={6} lg={4} className="mb-3" key={user._id}>
                      <Card style={{ width: '18rem' }} key={user._id} className="mx-auto">
                        <Card.Body>
                          <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                          <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                          <ListGroup.Item>Mobile: {user.mobileNumber}</ListGroup.Item>
                          <ListGroup.Item>Active: {user.isActive ? 'YES' : 'NO'}</ListGroup.Item>
                          <ListGroup.Item>Admin: {user.isAdmin ? 'YES' : 'NO'}</ListGroup.Item>
                          <ListGroup.Item>Moderator: {user.isModerator ? 'YES' : 'NO'}</ListGroup.Item>
                          <ListGroup.Item>Field Agent: {user.isFieldAgent ? 'YES' : 'NO'}</ListGroup.Item>
                          <ListGroup.Item>Farmer: {user.isFarmer ? 'YES' : 'NO'}</ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                          <Button onClick={() => navigate(`/user/edit/${user._id}`)} variant="success">Edit</Button>
                        )}
                          &nbsp; &nbsp;
                          {userInfo && userInfo.isAdmin && (
                          <Button onClick={() => deleteHandler(user)} variant="danger">Delete</Button>
                          )}
                        </Card.Body>
                      </Card>
                  </Col>
                ))}
              </Row>

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
        </Col>
      </Row>
    </div>
  );
}

import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';


const BASE_URL = "https://mukundi-agriculture-backend.herokuapp.com";
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
    <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="mobileNumber">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          {userInfo && userInfo.isAdmin && (
          <>
            <Form.Check
              className="mb-3"
              type="checkbox"
              id="isAdmin"
              label="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
            <Form.Check
              className="mb-3"
              type="checkbox"
              id="isModerator"
              label="isModerator"
              checked={isModerator}
              onChange={(e) => setIsModerator(e.target.checked)}
            />
          </>
          )}

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isFieldAgent"
            label="isFieldAgent"
            checked={isFieldAgent}
            onChange={(e) => setIsFieldAgent(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isFarmer"
            label="isFarmer"
            checked={isFarmer}
            onChange={(e) => setIsFarmer(e.target.checked)}
          />
          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isActive"
            label="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}

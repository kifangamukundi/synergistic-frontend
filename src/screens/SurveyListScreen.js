import React, { useContext, useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';


import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError, BASE_URL } from '../utils';


import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';



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

export default function SurveyListScreen() {
  const [
    {
      loading,
      error,
      surveys,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const [queryParams, setQueryParams] = useState('');
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;
  const query = sp.get('query') || 'all';

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/surveys/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
        // localStorage.removeItem("analysisInfo");
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

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

  const deleteHandler = async (survey) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
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

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/survey/search/?query=${queryParams}` : '/survey/search');
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Data Collection Tools</h1>
        </Col>
        <Col>
          <Form className="d-flex me-auto" onSubmit={submitHandler}>
            <InputGroup>
              <FormControl
                type="text"
                name="q"
                id="q"
                onChange={(e) => setQueryParams(e.target.value)}
                placeholder="search surveys..."
                aria-label="Search surveys"
                aria-describedby="button-search"
              ></FormControl>
              <Button variant="outline-success" type="submit" id="button-search">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
        {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler} variant="success">
              New Tool
            </Button>
          </div>
        </Col>
        )}
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Helmet>
            <title>Data Collection Tools</title>
            <meta name="description" content="Data Collection Tools"></meta>
          </Helmet>
          <Row xs={1} md={2} className="g-4">
          {surveys.map((survey) => (
            <Card className="text-center" key={survey._id}>
              <Card.Header>{survey.category}</Card.Header>
              <Card.Body>
                <Card.Title>{survey.name}</Card.Title>
                <Card.Text>
                  {survey.description}
                </Card.Text>

                {userInfo && userInfo.isAdmin && (
                <Button 
                  type="button"
                  variant="primary"
                  onClick={() => {
                    navigate(`/survey/analysis/${survey.slug}`);
                  }}
                >
                  Analysis
                </Button>
                )}

                &nbsp;
                {survey.isActive === false ? (
                  <Button variant="secondary" disabled>
                    Closed
                  </Button>
                ) : (
                  <Button type="button" variant="success" onClick={() => { navigate(`/survey/${survey.slug}`);}}>Start Now</Button>
                )}
                &nbsp;

                {userInfo && (userInfo.isAdmin || userInfo.isModerator) && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(`/survey/edit/${survey._id}`)}
                >
                  Edit
                </Button>
                )}

                &nbsp;

                {userInfo && userInfo.isAdmin && (
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => deleteHandler(survey)}
                >
                  Delete
                </Button>
                )}

              </Card.Body>
              <Card.Footer className="text-muted">Responses: {survey.numResponses}</Card.Footer>
            </Card>
            ))}

          </Row>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/survey/list?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

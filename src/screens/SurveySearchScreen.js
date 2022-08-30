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
        surveys: action.payload.surveys,
        page: action.payload.page,
        pages: action.payload.pages,
        countSurveys: action.payload.countSurveys,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

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

  const [{ loading, error, surveys, pages, countSurveys }, dispatch] =
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
    fetchData();
  }, [category, isActive, error, order, page, numResponses, query]);

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
    return `/survey/search?category=${filterCategory}&isActive=${filterIsActive}&query=${filterQuery}&numResponses=${filterNumResponses}&order=${sortOrder}&page=${filterPage}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/survey/search/?query=${queryParams}` : '/survey/search');
  };
  return (
    <div>
      <Helmet>
        <title>Search Surveys</title>
      </Helmet>
      <Row>
        <Col md={3}>
          <h4 className='mb-3'>Filter By Category</h4>
          <ListGroup>
              <Link to={getFilterUrl({ category: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === category ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {categories.map((c) => (
                <div key={c}>
                  <Link to={getFilterUrl({ category: c })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={c === category ? 'primary' : 'light'}>
                      {c}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>Filter By Responses</h4>
          <ListGroup>
              <Link to={getFilterUrl({ numResponses: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === numResponses ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {surveyResponses.map((sr) => (
                <div key={sr.value}>
                  <Link to={getFilterUrl({ numResponses: sr.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={sr.value === numResponses ? 'primary' : 'light'}>
                      {sr.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
          <h4 className='mb-3'>Filter By Status</h4>
          <ListGroup>
              <Link to={getFilterUrl({ isActive: 'all' })} style={{textDecoration: 'none'}}>
                <ListGroup.Item variant={'all' === isActive ? 'primary' : 'light'}>
                  Any
                </ListGroup.Item>
              </Link>

              {isSurveyActive.map((isa) => (
                <div key={isa.value}>
                  <Link to={getFilterUrl({ isActive: isa.value })} style={{textDecoration: 'none'}}>
                    <ListGroup.Item variant={isa.value === isActive ? 'primary' : 'light'}>
                      {isa.name}
                    </ListGroup.Item>
                  </Link>
                </div>
              ))}
          </ListGroup>
            <h4 className='mb-3'>Sort From</h4>
            <Form.Select value={order} onChange={(e) => {
                navigate(getFilterUrl({ order: e.target.value }));
              }}>
              <option value="newest">Newest Surveys</option>
              <option value="lowest">Responses: Low to High</option>
              <option value="highest">Responses: High to Low</option>
            </Form.Select>
        </Col>
        <Col md={9}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row className="justify-content-between mb-3">
                <Col md={6}>
                  <div>
                    {countSurveys === 0 ? 'No' : countSurveys} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {query !== 'all' ||
                    category !== 'all' ||
                    numResponses !== 'all' ? (
                      <Button
                        variant="light"
                        onClick={() => navigate('/survey/search')}
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
              </Row>
              {surveys.length === 0 && (
                <MessageBox>No Survey Found</MessageBox>
              )}

              <Row>
                {surveys.map((survey) => (
                  <Col sm={6} lg={4} className="mb-3" key={survey._id}>
                      <Card bg="light">
                        <Card.Body>
                          <Card.Title>{survey.name.substr(0, 50)}</Card.Title>
                          <Card.Text>{survey.description.substr(0, 120)}</Card.Text>
                          <Card.Subtitle className="mb-2 text-muted">Category: {survey.category}</Card.Subtitle>
                          <Card.Subtitle className="mb-2 text-muted">Responses: {survey.numResponses}</Card.Subtitle>
                          
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
                            <Button variant="success" onClick={() => { navigate(`/survey/${survey?.slug}`);}}>Start Now</Button>
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

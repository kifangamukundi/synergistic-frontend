import { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
// import data from '../data';
const BASE_URL = "https://mukundi-agriculture-backend.herokuapp.com";

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${BASE_URL}/api/products`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);
  return (
    <div>
      <Helmet>
        <title>SynergisticAgribusiness - Agriculture Management Made Easy</title>
      </Helmet>
      <h1>Our Services</h1>
      <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          // <Row>
          //   {products.map((product) => (
          //     <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
          //       <Product product={product}></Product>
          //     </Col>
          //   ))}
          // </Row>
          <Row xs={1} md={2} className="g-4">
              <Col>
                <Card>
                  <Card.Img 
                  variant="top" 
                  src="/images/data.jpg" />
                  <Card.Body>
                    <Card.Title>Farm Data Collection Tools</Card.Title>
                    <Card.Text>
                    Data collection allows for farmers to approach conservation at a landscape-scale, versus at the farm or even the county level.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Img 
                  variant="top" 
                  src="/images/analysis.jpg" />
                  <Card.Body>
                    <Card.Title>Farm Produce Tracking And Analysis</Card.Title>
                    <Card.Text>
                    Synergistic Agribusiness is a comprehensive fresh produce business management solution that caters for all operational processes from quality control, inventory, sales, dispatch, and orders.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Img 
                  variant="top" 
                  src="/images/market.jpg" />
                  <Card.Body>
                    <Card.Title>Farm Produce Markets</Card.Title>
                    <Card.Text>
                    We offer a real-time FREE online marketplace where buyers and sellers meet to trade farm related products and services.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card>
                  <Card.Img variant="top" src="/images/tips.jpg" />
                  <Card.Body>
                    <Card.Title>Farmers Advice</Card.Title>
                    <Card.Text>
                    A good farmer is an innovator par excellence, able to take on board feedback, and to develop, test and implement the actions necessary to maintain the farm's ongoing well-being.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
export default HomeScreen;

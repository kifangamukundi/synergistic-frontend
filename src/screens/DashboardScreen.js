import React, { useContext, useEffect, useReducer, useState } from 'react';
import Chart from 'react-google-charts';
import axios from 'axios';
import { Store } from '../Store';
import { getError, BASE_URL } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function DashboardScreen() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [lastWeek, setlastWeek] = useState([]);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/surveys/summary`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });

        // Sorting aggregated users and saving to state
        setUsers(data.test.sort(compare))
        setlastWeek(((data.test[0].total - data.test[1].total) / data.test[1].total) * 100);
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  console.log(users)
  console.log(lastWeek)

  function compare(a, b) {
    if(a._id < b._id) {
      return 1;
    }
    if(a._id > b._id) {
      return -1;
    }
    return 0;
  }

  return (
    <div>
      <h1>Summary</h1>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Row>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {users[0]?.total}
                  </Card.Title>
                  <Card.Text> {lastWeek > 0 ? <Badge bg="success">+ {lastWeek} %</Badge> : <Badge bg="danger">{lastWeek} %</Badge>}</Card.Text>
                  <Card.Text>Users: (Compared to Last week)</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </Card.Title>
                  <Card.Text> All time Users</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>
                    {summary.surveys && summary.surveys[0]
                      ? summary.surveys[0].numSurveys
                      : 0}
                  </Card.Title>
                  <Card.Text> Survey Tools</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>

            </Col>
            <Col md={4}>

            </Col>
          </Row>
          <div className="my-3">
            <h2>Survey Categories</h2>
            {summary.surveyCategories.length === 0 ? (
              <MessageBox>No Category</MessageBox>
            ) : (
              <Chart
                width="100%"
                height="400px"
                chartType="PieChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Category', 'Products'],
                  ...summary.surveyCategories.map((x) => [x._id, x.count]),
                ]}
              ></Chart>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'survey-analytics/survey.analytics.min.css';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { toast } from 'react-toastify';

// Table imports
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

// import { Tabulator } from "survey-analytics/survey.analytics.tabulator.js";
import { Tabulator } from "survey-analytics/survey.analytics.tabulator";
import "survey-analytics/survey.analytics.tabulator.css";
import "tabulator-tables/dist/css/tabulator.min.css";

window.jsPDF = jsPDF;
window.XLSX = XLSX;

const vizPanelOptions = {
  allowHideQuestions: false,
  haveCommercialLicense: true
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_SURVEY':
      return { ...state, survey: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateResponse: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateResponse: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateResponse: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, survey: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SurveyTabulatorScreen() {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  const [surveyJson, setSurveyJson] = useState(null);
  const [surveyProps, setSurveyProps] = useState(null);
  const params = useParams();
  const { slug } = params;
  const surveyRef = useRef(null);
  const navigate = useNavigate();

  const [{ loading, error, surveyLoad, loadingCreateResponse }, dispatch] =
    useReducer(reducer, {
      surveyLoad: [],
      loading: true,
      error: '',
    });

  if (!survey) {
    const survey = new Model(surveyJson);
    setSurvey(survey);
  }
  
  // This gave me a nightmare; it was not updating on refresh
  // Also data could not be loaded using the useState method
  useEffect(() => {
    if (!vizPanel && !!survey) {
      loadSurveyResults(`${BASE_URL}/api/surveys/slug/` + slug)
        .then((surveyResponse) => {
          const survey = new Model(surveyResponse.surveyJson);
          setSurvey(survey);
          setSurveyJson(surveyResponse.surveyJson);
          setSurveyProps(surveyResponse);

          const vizPanel = new Tabulator(survey, surveyResponse.responses?.map(({ response }) => response));
          vizPanel.showHeader = false;
          vizPanel.haveCommercialLicense = true;
          setVizPanel(vizPanel);
          vizPanel.render(surveyRef.current);
          return () => {
            surveyRef.current.innerHTML = "";
          }
        });
    }
  }, [slug])

  // In the future limit actions users can take using userInfo data
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  // Function to fetch the survey
function loadSurveyResults (url) {
  dispatch({ type: 'FETCH_REQUEST' });
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.onload = () => {
      const response = request.response ? JSON.parse(request.response) : [];
      resolve(response);
      dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
    }
    request.onerror = (err) => {
      reject(request.statusText);
      dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
    }
    request.send();
  });
}

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{ `Analysis - ${ surveyProps?.name }` }</title>
        <meta name="description" content={surveyProps?.description}></meta>
      </Helmet>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Survey Results and other Properties</Accordion.Header>
          <Accordion.Body>
            <Card className="text-center">
              <Card.Header>Category: {surveyProps?.category}</Card.Header>
              <Card.Body>
                  <Card.Title>Title: {surveyProps?.name}</Card.Title>
                  <Card.Text>
                    Description: {surveyProps?.description}
                  </Card.Text>
                  <Button 
                    onClick={() => { navigate(`/survey/analysis/${surveyProps?.slug}`);}} 
                    variant="primary"
                  >
                    View Charts
                  </Button>
              </Card.Body>
              <Card.Footer className="text-muted">Responses: {surveyProps?.numResponses}</Card.Footer>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div ref={surveyRef} id="summaryContainer" />
    </div>
  );
}

// const surveyResults = survey?.responses?.map(({ response }) => response)?.join(', ')
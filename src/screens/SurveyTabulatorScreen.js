import { useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'survey-analytics/survey.analytics.min.css';
import { Model } from 'survey-core';
import { VisualizationPanel } from 'survey-analytics';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';


import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import PieChartIcon from '@mui/icons-material/PieChart';


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

return (
  <Container maxWidth="xl" style={{ background: '#f5f5f5' }}>
    {/* style={{ background: '#f5f5f5' }} */}
    <Helmet>
      <title>{ `Tables - ${ surveyProps?.name }` }</title>
      <meta name="description" content={surveyProps?.description}></meta>
    </Helmet>
        {loading ? (
          <Box paddingY={1}><LoadingBox></LoadingBox></Box>
        ) : error ? (
          <Box paddingY={1}>
            <MessageBox severity="error">{error}</MessageBox>
          </Box>
        ) : (
          <>
            <Box paddingY={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Typography variant='h5' component="body1">{ surveyProps?.name } - Analysis</Typography>
              <Divider sx={{ height: 28, m: 0.5, color: "#00693e" }} orientation="vertical" />
              <IconButton sx={{ p: '10px', color: "#00693e" }} aria-label="Tables">
                <PieChartIcon onClick={() => { navigate(`/survey/analysis/${surveyProps?.slug}`);}}/>
              </IconButton>
            </Box>
            <Box paddingY={2}>
              <div ref={surveyRef} id="summaryContainer" />
            </Box>
          </>
        )}
  </Container>
);
}

// const surveyResults = survey?.responses?.map(({ response }) => response)?.join(', ')
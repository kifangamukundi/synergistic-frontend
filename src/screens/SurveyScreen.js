import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { Link as ReactRouterLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import {  toast } from 'material-react-toastify';

import { getError, BASE_URL } from '../utils';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';

// shiet
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';


// Modern theme
import 'survey-core/modern.min.css';
// Default V2 theme
// import 'survey-core/defaultV2.min.css';
import { StylesManager, Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import { SurveyPDF } from 'survey-pdf';

// const SURVEY_ID = 1;

StylesManager.applyTheme("modern");

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

// Pdf stuff
const exportToPdfOptions = {
  fontSize: 12,
  haveCommercialLicense: true
};

export default function SurveyScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, survey, loadingCreateResponse }, dispatch] =
    useReducer(reducer, {
      survey: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`${BASE_URL}/api/surveys/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;


  // New staff fo the data collection
  const surveyJson = survey.surveyJson;
  const surveyStart = new Model(surveyJson);
  const alertResults = useCallback((sender) => {
    console.log(JSON.stringify(sender.data))
    submitHandler(sender.data);

  }, [onValueChanged]);
  surveyStart.onComplete.add(alertResults);

  // Pdf stuff
  surveyStart.addNavigationItem({
    id: "pdf-export",
    title: "Save as PDF",
    action: () => savePdf(surveyStart.data)
  });

  const savePdf = function (surveyData) {
    const surveyPdf = new SurveyPDF(surveyJson, exportToPdfOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
  };

  const submitHandler = async (answers) => {
    if (!answers) {
      toast.error('Please finish the Survey');
      return;
    }
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/surveys/${survey._id}/responses`,
        { user: userInfo._id, response: answers, },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'CREATE_SUCCESS',
      });
      toast.success('Response Submitted Successfully');
      survey.responses.unshift(data.response);
      survey.numResponses = data.numResponses;
      dispatch({ type: 'REFRESH_SURVEY', payload: survey });
      navigate('/survey/list');
    } catch (error) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  // This makes sure the url for submission is updated as the survey is filled
  function onValueChanged(_, options) {
    console.log("New value: " + options.value);
  }

  return (
    <Container maxWidth="xl" style={{ background: '#f5f5f5' }}>
      {/* style={{ background: '#f5f5f5' }} */}
      <Helmet>
        <title>{ `${ survey.name } - Tool` }</title>
        <meta name="description" content={`${survey.description}`}></meta>
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
                <Survey model={surveyStart} onValueChanged={onValueChanged} />
              </Box>
            </>
          )}
    </Container>
  );
}
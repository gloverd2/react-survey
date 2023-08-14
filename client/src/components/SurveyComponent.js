// src/components/SurveyComponent.js
import React, { useState } from 'react';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';
import axios from 'axios';

const SurveyComponent = () => {
  const surveyJSON = {
    title: 'Person Information Survey',
    showProgressBar: 'bottom',
    pages: [
      {
        questions: [
          {
            type: 'text',
            name: 'name',
            title: 'What is your name?',
            isRequired: true
          },
          {
            type: 'text',
            name: 'age',
            title: 'What is your age?',
            inputType: 'number',
            isRequired: true,
            validators: [
              {
                type: 'numeric',
                min: 0,
                max: 150, // You can adjust the range as needed
                text: 'Please enter a valid age.'
              }
            ]
          },
          // Add more questions here if needed
        ]
      }
    ],
    completedHtml: '<p>Thank you for completing the survey!</p>'
  };

  const onCompleteSurvey = async (survey) => {
    try {
      const surveyData = {
        data: {...survey.data},
        meta: {tbl: 'users'}
      };
      
      const response = await axios.post('http://localhost:3001/store-data', surveyData);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <div>
      <h1>Survey App</h1>
      <Survey.Survey json={surveyJSON} onComplete={onCompleteSurvey} />
    </div>
  );
};

export default SurveyComponent;

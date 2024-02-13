import axios from 'axios';

class APIService {
  const;
  static API_ENDPOINT = 'https://audio-ai.ahlab.org/atoms/';

  static async resolveIntent(text) {
    let endpoint =
      this.API_ENDPOINT +
      'intent-recognition/recognize-intent/?algorithm_name=CHAT_GPT';

    const engineConfigurations = {
      INTENT_RECOGNITION_OPEN_AI_TEMPERATURE: '0.7',
      INTENT_RECOGNITION_OPEN_AI_MODEL: 'gpt-3.5-turbo-0613',
      INTENT_RECOGNITION_OPEN_AI_LOGGER_LOCATION:
        'C:\\Users\\Public\\projects\\drone-buddy-library\\dronebuddylib\\atoms\\intentrecognition\\resources\\stats\\',
      INTENT_RECOGNITION_OPEN_AI_API_KEY:
        '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',
      INTENT_RECOGNITION_OPEN_AI_API_URL:
        'https://api.openai.com/v1/chat/completions',
    };
    const requestBody = {
      engine_configurations: JSON.stringify(engineConfigurations),
      text: text,
    };

    console.log('api url', endpoint);
    console.log('api request', requestBody);

    try {
      // Make the axios request
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          // Include any other headers your API requires
        },
      });

      // Return the response data
      return response.data;
    } catch (error) {
      console.error(
        'There has been a problem with your axios operation:',
        error,
      );
      // Handle errors here, depending on how you want to manage error states.
      throw error;
    }
  }

  // Define a function to perform a GET request
  static async fetchData() {
    const url = this.API_ENDPOINT + 'intent-recognition/recognize-intent';
    console.log(url);

    try {
      const response = await axios.get(url);
      console.log('result', response.data);
      // Process the response data as needed
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Data:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error:', error.message);
      }
      console.error('Error config:', error.config);
    }
  }
}

export default APIService;

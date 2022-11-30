export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const BASE_URL = "http://localhost:5000";


//  Local URI: http://localhost:5000
// Cloud run: https://backend-xtowfqi6oq-uc.a.run.app
// Git revert to previous commit : git log
// git reset --hard <commit hash>
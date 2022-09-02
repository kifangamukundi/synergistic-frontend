export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const BASE_URL = "http://localhost:5000";


//  Local URI: http://localhost:5000
// Remote URI : https://mukundi-agriculture-backend.herokuapp.com
// Git revert to previous commit : git log
// git reset --hard <commit hash>
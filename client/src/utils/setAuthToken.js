import axios from 'axios';

// we are not making a request with axios,
// just adding global header
// gets the token and adds to the header
// token comes from local storage
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;

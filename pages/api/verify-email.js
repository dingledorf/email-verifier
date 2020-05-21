const axios = require('axios').default;

export default (req, res) => {
  const {
    query: { email },
  } = req

  axios.get('https://api.kickbox.com/v2/verify', {
      params: {email, apikey: process.env.KB_PROD_KEY}
  }).then((response) => {
    res.send(response.data);
  }).catch((error) => {
    if (error.response) {
      res.send(error.response.data);
    } else {
        res.send(JSON.stringify({
            message: 'Something went wrong!',
            success: false
        }))
    }
  });
}

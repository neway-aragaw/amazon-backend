import axios from "axios";

const instance = axios.create({

  baseURL: 'http://127.0.0.1:5001/fir-dc116/us-central1/api'
  // use this for local
    // "http://localhost:5001/challenge-4b2b2/us-central1/api",
});

export default instance;



import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export async function signIn(username, password) {
  try {
    return axios.post(`${apiBaseUrl}/auth/token/`, { username, password }).then(
      (response) => {
        const token = response.data.token;
        return axios.get(`${apiBaseUrl}/users/${response.data.user_id}/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        }).then(
          (response) => {
            const user = response.data;
            user.token = token
            return {
              isOk: true,
              data: user
            };
          }
        );
      }
    );

  }
  catch {
    return {
      isOk: false,
      message: "Authentication failed"
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}

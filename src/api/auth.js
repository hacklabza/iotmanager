import axios from 'axios';

const baseAPIUrl = 'http://localhost:8000/api';

export async function signIn(username, password) {
  try {
    let user = null;
    axios.post(`${baseAPIUrl}/auth/token`, { username, password }).then(
      (response) => {
        axios.get(`${baseAPIUrl}/users`, {
          headers: {
            Authorization: `Token ${response.data.token}`
          }
        }).then(
          (response) => {
            user = response.data[0];
          }
        );
      }
    );

    console.log(user);

    return {
      isOk: true,
      data: user
    };

  }
  catch {
    return {
      isOk: false,
      message: "Authentication failed"
    };
  }
}

export async function getUser() {
  try {
    // Send request

    return {
      isOk: true,
      data: null
    };
  }
  catch {
    return {
      isOk: false
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

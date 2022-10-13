import tokenService from "./tokenService";

const BASE_URL = "/api/users/"; // Note: Once deployed this should be updated.

function signup(user) {
  return (
    fetch(BASE_URL + "signup", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(user),
    })
      .then((res) => {
        if (res.ok) return res.json();
        // Probably a duplicate email
        throw new Error("Email already taken!");
      })
      // Parameter destructuring!
      .then(({ token }) => tokenService.setToken(token))
  );
  // The above could have been written as
  //.then((token) => token.token);
}

function getUser() {
  return tokenService.getUserFromToken();
}

function logout() {
  tokenService.removeToken();
}

function login(creds) {
  return fetch(BASE_URL + "login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(creds),
  })
    .then((res) => {
      // Valid login if we have a status of 2xx (res.ok)
      if (res.ok) return res.json();
      throw new Error("Bad Credentials!");
    })
    .then(({ token }) => tokenService.setToken(token));
}

// TODO: Post profile info
//! dc
export const updateProfileInfo = async (formData, userID) => {
  console.log("UserService check ->", formData);

  try {
    const token = tokenService.getToken();
    let res = await fetch(`/api/users/${userID}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(formData),
    });
    console.log("res ->", res);
    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// export const addProfileInfo = async (profileEdit, userID) => {
//   try {
//     const token = tokenService.getToken();
//     let res = await fetch(`/api/users/${userID}`, {
//       method: "POST",
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify(profileEdit),
//     });
//     return res.json();
//   } catch (error) {
//     console.log(error);
//   }
// };

// TODO: Update profile info
// export const updateProfileInfo = async (profileEdit, userID) => {
//   try {
//     console.log("user service check", profileEdit);
//     const token = tokenService.getToken();
//     let res = await fetch(`/api/users/${userID}`, {
//       method: "PATCH",
//       headers: {
//         "content-type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify(profileEdit),
//     });
//     return res.json();
//   } catch (error) {
//     console.log(error);
//   }
// };

// // TODO: Delete profile info
// export const deleteProfileInfo = async (formData, userID) => {
//   try {
//     const token = tokenService.getToken();
//     let res = await fetch(`/api/users/${userID}`, {
//       method: "DELETE",
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//       body: formData,
//     });
//     return res;
//   } catch (error) {
//     console.log(error);
//   }
// };

const exports = {
  signup,
  getUser,
  logout,
  login,
};

export default exports;

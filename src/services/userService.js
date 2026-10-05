const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;


// Get the currently authenticated user
const currentUser = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(`${BASE_URL}/current_user`, config);

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(
        data?.detail || `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


// Admin creates a user with a specific role
const createUserByAdmin = async (userData) => {
  try {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    };

    const res = await fetch(`${BASE_URL}/admin/users`, config);

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new Error(
        data?.detail || `Request failed with status ${res.status}`
      );
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


export {
  currentUser,
  createUserByAdmin,
};
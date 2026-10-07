const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;


const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});


const getErrorMessage = (detail) => {
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(', ');
  }

  return detail;
};


const handleResponse = async (res) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      getErrorMessage(data?.detail) || `Request failed with status ${res.status}`
    );
  }

  return data;
};


const getMyProfile = async () => {
  try {
    const res = await fetch(`${BASE_URL}/profiles/me`, {
      headers: authHeaders(),
    });

    // No profile yet for this user
    if (res.status === 404) return null;

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


const createProfile = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/profiles`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


const updateMyProfile = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/profiles/me`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(data),
    });

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


export {
  getMyProfile,
  createProfile,
  updateMyProfile,
};

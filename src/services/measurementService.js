const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;


const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});


const handleResponse = async (res) => {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(
      data?.detail || `Request failed with status ${res.status}`
    );
  }

  return data;
};


const createMeasurements = async (measurements) => {
  try {
    const res = await fetch(`${BASE_URL}/measurements`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(measurements),
    });

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


const getMyMeasurements = async () => {
  try {
    const res = await fetch(`${BASE_URL}/measurements/me`, {
      headers: authHeaders(),
    });

    // No measurements yet for this client
    if (res.status === 404) return null;

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


const updateMeasurements = async (measurements) => {
  try {
    const res = await fetch(`${BASE_URL}/measurements/me`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(measurements),
    });

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


const deleteMeasurements = async () => {
  try {
    const res = await fetch(`${BASE_URL}/measurements/me`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


export {
  createMeasurements,
  getMyMeasurements,
  updateMeasurements,
  deleteMeasurements,
};

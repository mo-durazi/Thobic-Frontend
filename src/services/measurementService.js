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


export { BASE_URL, authHeaders, handleResponse };

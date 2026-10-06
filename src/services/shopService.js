const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;


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

const getShops = async (filters = {}) => {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const query = params.toString();
    const res = await fetch(`${BASE_URL}/shops${query ? `?${query}` : ''}`);

    return await handleResponse(res);
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};
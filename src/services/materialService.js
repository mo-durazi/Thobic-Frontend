const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;


// Get all materials
const getMaterials = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const url = queryString
      ? `${BASE_URL}/materials?${queryString}`
      : `${BASE_URL}/materials`;

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(url, config);

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


// Get current user's materials
const getMyMaterials = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(`${BASE_URL}/materials/mine`, config);

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


// Get one material
const getMaterial = async (materialId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(`${BASE_URL}/materials/${materialId}`, config);

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


// Create a material
const createMaterial = async (materialData) => {
  try {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(materialData),
    };

    const res = await fetch(`${BASE_URL}/materials`, config);

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


// Update a material
const updateMaterial = async (materialId, materialData) => {
  try {
    const config = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(materialData),
    };

    const res = await fetch(`${BASE_URL}/materials/${materialId}`, config);

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


// Delete a material
const deleteMaterial = async (materialId) => {
  try {
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(`${BASE_URL}/materials/${materialId}`, config);

    if (!res.ok) {
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      throw new Error(
        data?.detail || `Request failed with status ${res.status}`
      );
    }

    return true;
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


// Upload material image to Cloudinary through the backend
const uploadMaterialImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const config = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    };

    const res = await fetch(
      `${BASE_URL}/materials/upload-image`,
      config
    );

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
  getMaterials,
  getMyMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  uploadMaterialImage,
};
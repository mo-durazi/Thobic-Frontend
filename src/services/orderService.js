import API from "./api"; // Your configured Axios instance

// Create a new order (returns the created order object directly)
export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

// Get all orders for the current user (Client or Tailor)
export const getMyOrders = async () => {
  const response = await API.get("/orders/my-orders");
  return response.data;
};

// Get a single order by ID
const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};

// Edit a pending order
export const editOrder = async (orderId, orderData) => {
  const response = await API.put(`/orders/${orderId}`, orderData);
  return response.data;
};

// Delete a pending order
export const deleteOrder = async (orderId) => {
  const response = await API.delete(`/orders/${orderId}`);
  return response.data;
};

// Tailor accepts order (sets price and final deadline)
export const tailorAcceptOrder = async (orderId, acceptData) => {
  const response = await API.patch(
    `/orders/${orderId}/tailor-accept`,
    acceptData,
  );
  return response.data;
};

// Tailor rejects order
export const tailorRejectOrder = async (orderId) => {
  const response = await API.patch(`/orders/${orderId}/tailor-reject`);
  return response.data;
};

// Client responds to accepted order (approve: true/false)
export const clientRespondOrder = async (orderId, approve) => {
  const response = await API.patch(`/orders/${orderId}/client-respond`, {
    approve,
  });
  return response.data;
};

// Tailor workflow progress steps
export const markOrderInProgress = async (orderId) => {
  const response = await API.patch(`/orders/${orderId}/in-progress`);
  return response.data;
};

export const markOrderReady = async (orderId) => {
  const response = await API.patch(`/orders/${orderId}/ready`);
  return response.data;
};

export const markOrderOnTheWay = async (orderId) => {
  const response = await API.patch(`/orders/${orderId}/on-the-way`);
  return response.data;
};

// Client confirms final delivery
export const markOrderDelivered = async (orderId) => {
  const response = await API.patch(`/orders/${orderId}/delivered`);
  return response.data;
};

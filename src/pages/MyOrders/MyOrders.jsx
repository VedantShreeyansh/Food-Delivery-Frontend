import React, { useContext, useState, useEffect } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {headers: {token}});
      console.log("User orders response:", response.data);
      
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Food Processing': return '#ff6347';
      case 'Out for delivery': return '#ffa500';
      case 'Delivered': return '#32cd32';
      default: return '#666';
    }
  }

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length === 0 ? (
          <div className="no-orders">
            <p>No orders found. Start by placing an order!</p>
          </div>
        ) : (
          data.map((order, index) => {
            return (
              <div key={index} className="my-orders-order">
                <img src={assets.parcel_icon} alt="" />
                <p>{order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}</p>
                <p>${order.amount}.00</p>
                <p>Items: {order.items.length}</p>
                <p>
                  <span style={{color: getStatusColor(order.status)}}>&#x25cf;</span>
                  <b style={{color: getStatusColor(order.status)}}>{order.status}</b>
                </p>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MyOrders;
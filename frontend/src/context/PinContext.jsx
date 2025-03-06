import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

const PinContext = createContext();

export const PinProvider = ({ children }) => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState(null);

  async function fetchPins() {
    try {
      const { data } = await axios.get("/api/pin/all");
      setPins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pins:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch pins');
      setLoading(false);
    }
  }

  async function fetchPin(id) {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/pin/" + id);
      setPin(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pin:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch pin');
      setLoading(false);
    }
  }

  async function updatePin(id, title, pin, setEdit) {
    try {
      const { data } = await axios.put("/api/pin/" + id, { title, pin });
      toast.success(data.message);
      fetchPin(id);
      setEdit(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const addComment = async (id, comment, setComment) => {
    try {
      const { data } = await axios.post(`/api/pin/comment/${id}`, { comment });
      
      // Log the response to see its structure
      console.log('Comment response:', data);

      // More flexible check for response data
      if (data) {
        setPin(prevPin => {
          if (!prevPin) return null;
          
          // Create new comment object based on response structure
          const newComment = {
            _id: data._id || data.commentId || Date.now(),
            user: data.userId || data.user || '',
            name: data.userName || data.name || '',
            avatar: data.userAvatar || data.avatar || '',
            comment: comment
          };

          return {
            ...prevPin,
            comments: [
              newComment,
              ...(prevPin.comments || [])
            ]
          };
        });
        
        setComment('');
        toast.success(data.message || 'Comment added successfully');
      } else {
        throw new Error('No response data received from server');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Log the full error response for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const deleteComment = async (pinId, commentId) => {
    try {
      const { data } = await axios.delete(`/api/pin/comment/${pinId}/${commentId}`); // Updated endpoint format
      
      if (data) {
        setPin(prevPin => {
          if (!prevPin || !prevPin.comments) return prevPin;
          return {
            ...prevPin,
            comments: prevPin.comments.filter(comment => comment._id !== commentId)
          };
        });
        toast.success(data.message || 'Comment deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  async function deletePin(id, navigate) {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/pin/${id}`);
      toast.success(data.message);
      navigate("/");
      setLoading(false);
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function addPin(
    formData,
    setFilePrev,
    setFile,
    setTitle,
    setPin,
    navigate
  ) {
    try {
      const { data } = await axios.post("/api/pin/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success(data.message);
      
      // Reset form fields
      setFile([]);
      setFilePrev("");
      setPin("");
      setTitle("");
      
      // Fetch the updated pins list
      await fetchPins();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create pin');
    }
  }

  useEffect(() => {
    fetchPins();
  }, []);
  return (
    <PinContext.Provider
      value={{
        pins,
        loading,
        fetchPin,
        pin,
        updatePin,
        addComment,
        deleteComment,
        deletePin,
        addPin,
        fetchPins,
      }}
    >
      {children}
    </PinContext.Provider>
  );
};

export const PinData = () => {
  const context = useContext(PinContext);
  if (!context) {
    throw new Error('usePinData must be used within a PinProvider');
  }
  return context;
};

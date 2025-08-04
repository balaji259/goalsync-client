import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/api';
import { setPendingRequestsCount, decrementPendingRequestsCount } from '../../redux/approvalSlice';


function PendingRequests() {
  const [requests, setRequests] = useState([]);

  const dispatch = useDispatch();

  const { theme } = useSelector((state) => state.theme); 

  const getPendingRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/groups/pending-requests', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data);
      dispatch(setPendingRequestsCount(response.data.length));
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getPendingRequests();
  }, []);

  const handle = async (id, action) => {
    const token = localStorage.getItem('token');
    await api.post(
      '/api/groups/handle-request',
      { requestId: id, action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setRequests(requests.filter((r) => r._id !== id));
    dispatch(decrementPendingRequestsCount());
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 md:p-10 transition-all ${
        theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-black'
      }`}
    >
      <div
        className={`max-w-3xl mx-auto rounded-xl shadow-md p-6 ${
          theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-black'
        }`}
      >
        <h2 className="text-2xl font-semibold mb-4">Pending Join Requests</h2>

        {requests.length === 0 ? (
          <p
            className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
            }`}
          >
            No pending requests.
          </p>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div
                key={r._id}
                className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-md transition hover:shadow-sm ${
                  theme === 'dark'
                    ? 'bg-[#334155] text-white'
                    : 'bg-gray-100 text-black'
                }`}
              >
                <div className="mb-2 sm:mb-0">
                  <span className="font-medium">{r.user.name}</span> →{' '}
                  <span className="font-semibold">{r.group.name}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handle(r._id, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-md transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handle(r._id, 'rejected')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingRequests;

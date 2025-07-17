import React, { useEffect, useState } from 'react';
import api from '../api/api';

function PendingRequests() {
  const [requests, setRequests] = useState([]);

  const getPendingRequests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/groups/pending-requests', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setRequests(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getPendingRequests();
  }, []);

  const handle = async (id, action) => {
    const token = localStorage.getItem('token');
    await api.post('/api/groups/handle-request', { requestId: id, action }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setRequests(requests.filter(r => r._id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Join Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <div
                key={r._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-4 rounded-md transition hover:shadow-sm"
              >
                <div className="text-gray-700 mb-2 sm:mb-0">
                  <span className="font-medium">{r.user.name}</span> → <span className="font-semibold">{r.group.name}</span>
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

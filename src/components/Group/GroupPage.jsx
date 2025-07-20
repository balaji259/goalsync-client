import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Target, 
  Lock, 
  Unlock, 
  TrendingUp, 
  History, 
  Settings,
  ChevronDown,
  ChevronUp,
  Crown,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';
import api from "../api/api";
import {useParams} from 'react-router-dom';

const GroupPage = () => {
     const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedGoal, setExpandedGoal] = useState(null);
  const { user, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();




  // Mock data - replace with actual API calls
  const mockGroup = {
    id: groupId,
    name: "Fitness Champions",
    type: "Health & Fitness",
    description: "A group dedicated to achieving our fitness goals together",
    creator: { id: 1, username: "john_doe", email: "john@example.com" },
    members: [
      { id: 1, username: "john_doe", email: "john@example.com", role: "creator" },
      { id: 2, username: "jane_smith", email: "jane@example.com", role: "member" },
      { id: 3, username: "mike_wilson", email: "mike@example.com", role: "member" },
      { id: 4, username: "sarah_jones", email: "sarah@example.com", role: "member" }
    ],
    goals: [
      {
        id: 1,
        title: "Weekly Running Challenge",
        description: "Run at least 20km per week",
        type: "fitness",
        isLocked: false,
        creator: "john_doe",
        createdAt: "2024-01-15",
        deadline: "2024-02-15",
        status: "active",
        progress: [
          { userId: 1, username: "john_doe", progress: 85, completed: false },
          { userId: 2, username: "jane_smith", progress: 92, completed: false },
          { userId: 3, username: "mike_wilson", progress: 67, completed: false },
          { userId: 4, username: "sarah_jones", progress: 78, completed: false }
        ]
      },
      {
        id: 2,
        title: "Daily Water Intake",
        description: "Drink 8 glasses of water daily",
        type: "health",
        isLocked: true,
        creator: "john_doe",
        createdAt: "2024-01-10",
        deadline: "2024-02-10",
        status: "active",
        progress: [
          { userId: 1, username: "john_doe", progress: 100, completed: true },
          { userId: 2, username: "jane_smith", progress: 95, completed: false },
          { userId: 3, username: "mike_wilson", progress: 88, completed: false },
          { userId: 4, username: "sarah_jones", progress: 100, completed: true }
        ]
      }
    ],
    pastGoals: [
      {
        id: 3,
        title: "January Step Challenge",
        description: "10,000 steps daily for the entire month",
        completedAt: "2024-01-31",
        status: "completed",
        participants: 4,
        completionRate: "75%"
      }
    ]
  };

   const getGroupInfo = async () => {
    try {
      const response = await api.get(`/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setGroup(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (!user || !token) return;

    getGroupInfo();
  }, [groupId, user, token]);

  const isCreator = user && group && group.createdBy.id === user.id;

  const toggleGoalLock = (goalId) => {
    setGroup(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId ? { ...goal, isLocked: !goal.isLocked } : goal
      )
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 70) return 'bg-yellow-500';
    if (progress >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (!group) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        active
          ? theme === 'dark'
            ? 'bg-blue-600 text-white'
            : 'bg-blue-500 text-white'
          : theme === 'dark'
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            : 'bg-white text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  if(!group){
    return <h1>Loading....</h1>
  }

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className={`${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-6 mb-6`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold">{group.name}</h1>
                {isCreator && <Crown className="w-6 h-6 text-yellow-500" />}
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                {group.description}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-3 py-1 rounded-full ${
                  theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  {group.type}
                </span>
                <span className={`flex items-center space-x-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Users className="w-4 h-4" />
                  <span>{group.members.length} members</span>
                </span>
              </div>
            </div>
            <div className="flex space-x-3" onClick={()=>{navigate(`/${groupId}/create-goal`)}}>
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}>
                <Plus className="w-4 h-4" />
                <span>Create Goal</span>
              </button>
              {isCreator && (
                <button className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton id="overview" label="Overview" icon={BarChart3} active={activeTab === 'overview'} />
          <TabButton id="goals" label="Goals" icon={Target} active={activeTab === 'goals'} />
          <TabButton id="members" label="Members" icon={Users} active={activeTab === 'members'} />
          <TabButton id="history" label="History" icon={History} active={activeTab === 'history'} />
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-6`}>
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Active Goals
                  </span>
                  <span className="font-semibold text-blue-500">
                    {/* {group.goals.filter(g => g.status === 'active').length} */}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Completed Goals
                  </span>
                  <span className="font-semibold text-green-500">
                    {/* {group.pastGoals.length} */}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Group Progress
                  </span>
                  <span className="font-semibold text-purple-500">78%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`lg:col-span-2 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-6`}>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {/* {group.goals.slice(0, 3).map(goal => (
                  <div key={goal.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{goal.title}</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Average progress: {Math.round(
                          goal.progress.reduce((acc, p) => acc + p.progress, 0) / goal.progress.length
                        )}%
                      </p>
                    </div>
                    {getStatusIcon(goal.status)}
                  </div>
                ))} */}
              </div>
            </div>
          </div>
        )}

        {/* {activeTab === 'goals' && (
          <div className="space-y-6">
            {group.goals.map(goal => (
              <div key={goal.id} className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg overflow-hidden`}>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{goal.title}</h3>
                        {goal.isLocked && <Lock className="w-5 h-5 text-red-500" />}
                        {getStatusIcon(goal.status)}
                      </div>
                      <p className={`${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      } mb-3`}>
                        {goal.description}
                      </p>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className={`flex items-center space-x-1 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          <Calendar className="w-4 h-4" />
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </span>
                        <span className={`${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Created by: {goal.creator}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCreator && (
                        <>
                          <button
                            onClick={() => toggleGoalLock(goal.id)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              goal.isLocked
                                ? theme === 'dark'
                                  ? 'bg-red-900 hover:bg-red-800 text-red-200'
                                  : 'bg-red-100 hover:bg-red-200 text-red-600'
                                : theme === 'dark'
                                  ? 'bg-green-900 hover:bg-green-800 text-green-200'
                                  : 'bg-green-100 hover:bg-green-200 text-green-600'
                            }`}
                          >
                            {goal.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                          <button className={`p-2 rounded-lg transition-all duration-200 ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}>
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          theme === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        {expandedGoal === goal.id ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </div>

                  {expandedGoal === goal.id && (
                    <div className={`mt-6 pt-6 border-t ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h4 className="font-semibold mb-4">Member Progress</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goal.progress.map(member => (
                          <div key={member.userId} className={`p-4 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                          }`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{member.username}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-semibold">
                                  {member.progress}%
                                </span>
                                {member.completed && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                            </div>
                            <div className={`w-full ${
                              theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                            } rounded-full h-2`}>
                              <div
                                className={`h-2 rounded-full ${getProgressColor(member.progress)} transition-all duration-300`}
                                style={{ width: `${member.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )} */}

        {activeTab === 'members' && (
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Group Members</h3>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {group.members.length} total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members.map(member => (
                <div key={member._id} className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member.role === 'creator' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {member._id === group.createdBy._id ? (
                        <Crown className="w-6 h-6" />
                      ) : (
                        <Users className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.username}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {member.email}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member._id === group.createdBy._id
                            ? theme === 'dark'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-yellow-100 text-yellow-800'
                            : theme === 'dark'
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                        {member._id === group.createdBy._id ? 'creator' : 'member'}
                        </span>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6`}>
            <h3 className="text-xl font-semibold mb-6">Goal History</h3>
            <div className="space-y-4">
              {group.pastGoals.map(goal => (
                <div key={goal.id} className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h4 className="font-semibold">{goal.title}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {goal.description}
                      </p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Completed: {new Date(goal.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {goal.participants} participants
                      </span>
                      <span className="text-sm font-semibold text-green-500">
                        {goal.completionRate} success rate
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
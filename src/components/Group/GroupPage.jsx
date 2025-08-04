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
import GroupChat from "./GroupChat";

const GroupPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [editingProgress, setEditingProgress] = useState(null);
  const { user, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();

  const getGroupInfo = async () => {
    try {
      const response = await api.get(`/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      
      // Initialize progress for all members if not exists
      const updatedGroup = { ...response.data };
      if (updatedGroup.goals) {
        updatedGroup.goals = updatedGroup.goals.map(goal => {
          // Ensure all group members have progress entries
          const existingProgressUserIds = goal.progress?.map(p => {
            // Handle both populated and non-populated user references
            return typeof p.user === 'object' ? p.user._id : p.user;
          }) || [];
          
          const missingMembers = updatedGroup.members.filter(member => 
            !existingProgressUserIds.includes(member._id)
          );
          
          // Add missing members with 0 progress
          const newProgressEntries = missingMembers.map(member => ({
            user: member,
            progressPercent: 0,
            completed: false,
            completedAt: null
          }));
          
          return {
            ...goal,
            progress: [...(goal.progress || []), ...newProgressEntries]
          };
        });
      }
      
      setGroup(updatedGroup);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    getGroupInfo();
  }, [groupId, user, token]);

  const isCreator = user && group && group.createdBy._id === user.id;

  const toggleGoalLock = async (goalId) => {
    try {
      const response = await api.patch(`/api/goals/${goalId}/toggle-lock`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update local state with the returned goal
      setGroup(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal._id === goalId ? { ...goal, isLocked: response.data.isLocked } : goal
        )
      }));
    } catch (error) {
      console.error('Error toggling goal lock:', error);
    }
  };

  const updateProgress = async (goalId, progressData) => {
    try {
      const response = await api.patch(`/api/goals/${goalId}/progress`, progressData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Update local state with the returned goal
      setGroup(prev => ({
        ...prev,
        goals: prev.goals.map(goal => 
          goal._id === goalId ? response.data : goal
        )
      }));
      
      setEditingProgress(null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleProgressUpdate = (goalId, userId, newProgress, goalType = 'single', subGoalIndex = null) => {
    const goal = group.goals.find(g => g._id === goalId);
    if (!goal) return;

    if (goalType === 'single') {
      // Simple yes/no type goal
      const progressData = {
        userId,
        progressPercent: newProgress,
        completed: newProgress === 100
      };
      updateProgress(goalId, progressData);
    } else if (goalType === 'checklist' && subGoalIndex !== null) {
      // Subgoals type - handle individual subgoal completion
      const progressData = {
        userId,
        subGoalIndex,
        completed: newProgress === 100
      };
      updateProgress(goalId, progressData);
    }
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

  const calculateSubGoalProgress = (goal, userId) => {
    if (goal.goalType !== 'checklist' || !goal.subGoals || goal.subGoals.length === 0) return 0;
    
    const completedSubGoals = goal.subGoals.filter(subGoal => 
      subGoal.completedBy && subGoal.completedBy.some(id => 
        (typeof id === 'object' ? id._id : id) === userId
      )
    ).length;
    
    return (completedSubGoals / goal.subGoals.length) * 100;
  };

  const getUserProgress = (goal, userId) => {
    if (!goal.progress) return 0;
    
    const userProgress = goal.progress.find(p => {
      const pUserId = typeof p.user === 'object' ? p.user._id : p.user;
      return pUserId === userId;
    });
    
    if (goal.goalType === 'checklist') {
      return calculateSubGoalProgress(goal, userId);
    }
    
    return userProgress ? userProgress.progressPercent || 0 : 0;
  };

  const isUserCompleted = (goal, userId) => {
    if (!goal.progress) return false;
    
    const userProgress = goal.progress.find(p => {
      const pUserId = typeof p.user === 'object' ? p.user._id : p.user;
      return pUserId === userId;
    });
    
    return userProgress ? userProgress.completed : false;
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

  const ProgressEditor = ({ goal, member }) => {
    const userId = typeof member.user === 'object' ? member.user._id : member.user;
    const currentProgress = getUserProgress(goal, userId);
    const isCompleted = isUserCompleted(goal, userId);

    // Only allow the user to edit their own progress
    if (userId !== user.id) {
      return null;
    }

    if (goal.goalType === 'single') {
      return (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newProgress = isCompleted ? 0 : 100;
                handleProgressUpdate(goal._id, userId, newProgress);
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                isCompleted
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : theme === 'dark'
                    ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isCompleted ? 'Completed ✓' : 'Mark Complete'}
            </button>
          </div>
        </div>
      );
    } else if (goal.goalType === 'checklist' && goal.subGoals && goal.subGoals.length > 0) {
      return (
        <div className="mt-2 space-y-2">
          {goal.subGoals.map((subGoal, index) => {
            const isSubGoalCompleted = subGoal.completedBy && subGoal.completedBy.some(id => 
              (typeof id === 'object' ? id._id : id) === userId
            );
            
            return (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isSubGoalCompleted}
                  onChange={(e) => {
                    const newProgress = e.target.checked ? 100 : 0;
                    handleProgressUpdate(goal._id, userId, newProgress, 'checklist', index);
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className={`text-sm ${
                  isSubGoalCompleted 
                    ? 'line-through text-gray-500' 
                    : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {subGoal.text}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

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
                {group.description || 'No description available'}
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
                  <span>{group.members?.length || 0} members</span>
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => navigate(`/${groupId}/create-goal`)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Goal</span>
              </button>
              {/* {isCreator && (
                <button className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}>
                  <Settings className="w-5 h-5" />
                </button>
              )} */}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <TabButton id="overview" label="Overview" icon={BarChart3} active={activeTab === 'overview'} />
          <TabButton id="goals" label="Goals" icon={Target} active={activeTab === 'goals'} />
          <TabButton id="members" label="Members" icon={Users} active={activeTab === 'members'} />
          <TabButton id="chat" label="chat" icon={Users} active={activeTab === 'chat'} />
          {/* <TabButton id="history" label="History" icon={History} active={activeTab === 'history'} /> */}
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
                    {group.goals?.filter(g => g.status === 'active').length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Total Goals
                  </span>
                  <span className="font-semibold text-green-500">
                    {group.goals?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    Members
                  </span>
                  <span className="font-semibold text-purple-500">
                    {group.members?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`lg:col-span-2 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-6`}>
              <h3 className="text-lg font-semibold mb-4">Recent Goals</h3>
              <div className="space-y-3">
                {group.goals?.slice(0, 3).map(goal => (
                  <div key={goal._id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{goal.title}</p>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Type: {goal.goalType === 'single' ? 'Simple Goal' : 'Checklist Goal'}
                      </p>
                    </div>
                    {getStatusIcon(goal.status)}
                  </div>
                )) || <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>No goals yet</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
  <div className="space-y-6">
    {group.goals?.length > 0 ? group.goals.map(goal => (
      <div key={goal._id} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-semibold">{goal.title}</h3>
                {goal.isLocked && <Lock className="w-5 h-5 text-red-500" />}
                {getStatusIcon(goal.status)}
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                {goal.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className={`flex items-center space-x-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                  <span>Due: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Not set'}</span>
                </span>
                <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Created by: {
                    typeof goal.creator === 'object'
                      ? goal.creator.name || goal.creator.username
                      : 'Unknown'
                  }
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  goal.goalType === 'single'
                    ? theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                    : theme === 'dark' ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-800'
                }`}>
                  {goal.goalType === 'single' ? 'Simple Goal' : 'Checklist Goal'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* {isCreator && (
                <button
                  onClick={() => toggleGoalLock(goal._id)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    goal.isLocked
                      ? theme === 'dark'
                        ? 'bg-red-900 hover:bg-red-800 text-red-200'
                        : 'bg-red-100 hover:bg-red-200 text-red-600'
                      : theme === 'dark'
                        ? 'bg-green-900 hover:bg-green-800 text-green-200'
                        : 'bg-green-100 hover:bg-green-200 text-green-600'
                  }`}
                  title={goal.isLocked ? 'Unlock Goal' : 'Lock Goal'}
                >
                  {goal.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </button>
              )} */}
              <button
                onClick={() => setExpandedGoal(expandedGoal === goal._id ? null : goal._id)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {expandedGoal === goal._id ?
                  <ChevronUp className="w-4 h-4" /> :
                  <ChevronDown className="w-4 h-4" />
                }
              </button>
            </div>
          </div>

          {expandedGoal === goal._id && (
            <div className={`mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Checklist UI with modern checkbox */}
              {goal.goalType === 'checklist' && goal.items?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Checklist</h4>
                  <ul className="space-y-3">
                    {goal.items.map(item => (
                      <li key={item._id} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleCheck(goal._id, item._id)}
                          className={`
                            w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer appearance-none
                            bg-no-repeat bg-center bg-[length:70%]
                            ${item.completed
                              ? "bg-blue-600 border-blue-600 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27white%27 stroke-width=%273%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpolyline points=%2720 6 9 17 4 12%27/%3E%3C/svg%3E')]"
                              : theme === 'dark'
                                ? 'bg-gray-800 border-gray-600'
                                : 'bg-white border-gray-400'}
                          `}
                        />
                        <span className={`${item.completed ? 'line-through text-gray-400' : ''}`}>
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 className="font-semibold mb-4">Member Progress</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goal.progress?.map(member => {
                  const userId = typeof member.user === 'object' ? member.user._id : member.user;
                  const userName = typeof member.user === 'object'
                    ? member.user.name || member.user.username
                    : 'Unknown User';
                  const actualProgress = getUserProgress(goal, userId);
                  const isCompleted = isUserCompleted(goal, userId);

                  return (
                    <div key={userId} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{userName}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold">
                            {Math.round(actualProgress)}%
                          </span>
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>
                      <div className={`w-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2 mb-2`}>
                        <div
                          className={`h-2 rounded-full ${getProgressColor(actualProgress)} transition-all duration-300`}
                          style={{ width: `${actualProgress}%` }}
                        ></div>
                      </div>

                      {(!goal.isLocked || isCreator) && (
                        <ProgressEditor goal={goal} member={member} />
                      )}
                    </div>
                  );
                }) || <p className="text-gray-500">No progress data available</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    )) : (
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8 text-center`}>
        <Target className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          Create your first goal to get started!
        </p>
        <button
          onClick={() => navigate(`/${groupId}/create-goal`)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Create Goal
        </button>
      </div>
    )}
  </div>
)}


        {activeTab === 'members' && (
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Group Members</h3>
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {group.members?.length || 0} total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.members?.map(member => (
                <div key={member._id} className={`p-4 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      member._id === group.createdBy._id
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
                      <h4 className="font-semibold">{member.name || member.username}</h4>
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
              )) || <p className="text-gray-500">No members found</p>}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6`}>
            <h3 className="text-xl font-semibold mb-6">Goal History</h3>
            <div className="text-center py-8">
              <History className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Goal history will appear here when goals are completed
              </p>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
        
          <GroupChat />
        
        )}

      </div>
    </div>
  );
};

export default GroupPage;

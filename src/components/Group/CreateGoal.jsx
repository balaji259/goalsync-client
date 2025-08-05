import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Target, ListTodo, Save, Plus, Trash2 } from "lucide-react";
import api from "../api/api";
import { toast } from 'react-hot-toast';


const GOAL_CATEGORIES = [
  { id: "fitness", name: "Fitness" },
  { id: "health", name: "Health" },
  { id: "personal", name: "Personal" },
  { id: "study", name: "Study" },
  { id: "habit", name: "Habit" },
  { id: "other", name: "Other" },
];

const GOAL_TYPES = [
  { id: "single", name: "Single", desc: "A simple completed/not completed goal", icon: Target },
  { id: "checklist", name: "Checklist", desc: "A goal with multiple subgoals", icon: ListTodo },
];

export default function CreateGoal() {
  const { theme } = useSelector((s) => s.theme);
  const { groupId } = useParams();



  const [goal, setGoal] = useState({
    title: "",
    description: "",
    type: "personal",
    isLocked: false,
    group: groupId || "",
    deadline: "",
    goalType: "single",
    subGoals: [],
  });
  const [newSubGoal, setNewSubGoal] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

    const { user, token } = useSelector((state) => state.auth);

  function validate() {
    const e = {};
    if (!goal.title.trim()) e.title = "Title is required";
    if (!GOAL_CATEGORIES.find(c => c.id === goal.type)) e.type = "Select a valid category";
    if (!GOAL_TYPES.find(t => t.id === goal.goalType)) e.goalType = "Select a goal type";
    if (goal.goalType === "checklist" && goal.subGoals.length === 0)
      e.subGoals = "Add at least one subgoal";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubGoalAdd() {
    const s = newSubGoal.trim();
    if (!s) return;
    setGoal((g) => ({
      ...g,
      subGoals: [...g.subGoals, { text: s, completedBy: [] }],
    }));
    setNewSubGoal("");
  }

  function handleSubGoalRemove(idx) {
    setGoal((g) => ({
      ...g,
      subGoals: g.subGoals.filter((_, i) => i !== idx),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const payload = {
      ...goal,
      deadline: goal.deadline || null,
      createdAt: new Date().toISOString(),
      creator: user.id,
     

    };
    try {
      if(!token){
        toast.error("No valid token found.Please Login AGAIN !",{duration : 2000});
        return;
      }
      console.log(token);
      const response = await  api.post('/api/goals/create-goal',payload,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Goal created!",{duration : 2000});
      
      setGoal({
        title: "",
        description: "",
        type: "personal",
        isLocked: false,
        group: groupId || "",
        deadline: "",
        goalType: "single",
        subGoals: [],
      });
      setErrors({});
    } catch (err) {
        console.log(err.message);
      setErrors({ submit: "Failed to create goal. Try later." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper for dark mode color classes
  const cardBG = theme === "dark" ? "bg-[#181D25] border border-gray-700 shadow-lg" : "bg-white border border-gray-200 shadow";
  const inputBG = theme === "dark" ? "bg-[#222735] border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";
  const inputFocus = "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40";
  const btnPrimary = theme === "dark"
    ? "bg-green-600 hover:bg-green-700 text-white"
    : "bg-green-500 hover:bg-green-600 text-white";
  const btnSubgoal = theme === "dark"
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white";
  const subgoalBG = theme === "dark" ? "bg-[#272B35]" : "bg-gray-50";
  const borderCategoryActive = "border-blue-500 bg-blue-500/20";
  const borderCategoryInactive = theme === "dark"
    ? "border-gray-700 hover:border-blue-700 bg-[#242A36] hover:bg-[#283048]"
    : "border-gray-200 hover:border-blue-300 bg-white";
  const borderGoalTypeActive = "border-blue-500 bg-blue-500/20";
  const borderGoalTypeInactive = theme === "dark"
    ? "border-gray-700 hover:border-blue-700 bg-[#222735] hover:bg-blue-700/10"
    : "border-gray-200 hover:border-blue-300 bg-white";

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-[#141821]" : "bg-gray-50"} py-8 px-4`}>
      <div className="max-w-xl mx-auto">
        <div className={`mb-8 rounded-xl p-6 ${cardBG}`}>
          <h1 className={`text-2xl font-bold mb-1 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
            Create Goal
          </h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-700"}>
            Add a new goal (single or checklist type)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              value={goal.title}
              maxLength={80}
              autoFocus
              onChange={e => setGoal((g) => ({ ...g, title: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border transition ${inputBG} ${inputFocus}`}
              placeholder="Enter goal title"
              required
            />
            {errors.title && <div className="text-sm text-red-500 mt-1">{errors.title}</div>}
          </div>

          {/* Description */}
          <div>
            <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Description
            </label>
            <textarea
              value={goal.description}
              onChange={e => setGoal((g) => ({ ...g, description: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border resize-none transition ${inputBG} ${inputFocus}`}
              placeholder="Optional: describe the goal..."
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GOAL_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setGoal((g) => ({ ...g, type: cat.id }))}
                  className={`py-2 px-4 rounded-lg border transition font-medium
                    ${goal.type === cat.id ? borderCategoryActive : borderCategoryInactive}
                    ${goal.type === cat.id ? "text-blue-500" : theme === "dark" ? "text-gray-200" : "text-gray-900"}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            {errors.type && <div className="text-sm text-red-500 mt-1">{errors.type}</div>}
          </div>

          {/* Goal type: single or checklist */}
          <div>
            <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Goal Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {GOAL_TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setGoal(g => ({ ...g, goalType: t.id, subGoals: [] }))}
                    className={`flex-1 flex flex-col items-center border rounded-lg p-3 transition
                      ${goal.goalType === t.id ? borderGoalTypeActive : borderGoalTypeInactive}
                      ${goal.goalType === t.id ? "text-blue-500" : theme === "dark" ? "text-gray-200" : "text-gray-900"}
                    `}
                  >
                    <Icon className="w-6 h-6 mb-1" />
                    <span>{t.name}</span>
                    <span className="text-xs opacity-70 mt-1">{t.desc}</span>
                  </button>
                );
              })}
            </div>
            {errors.goalType && <div className="text-sm text-red-500 mt-1">{errors.goalType}</div>}
          </div>

          {/* Checklist subgoals */}
          {goal.goalType === "checklist" && (
            <div>
              <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
                Subgoals <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1 mb-2">
                <input
                  value={newSubGoal}
                  onChange={e => setNewSubGoal(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleSubGoalAdd())}
                  className={`flex-grow px-4 py-3 rounded-lg border transition ${inputBG} ${inputFocus}`}
                  placeholder="Add subgoal"
                />
                <button
                  type="button"
                  onClick={handleSubGoalAdd}
                  className={`px-3 rounded-lg transition ${btnSubgoal} disabled:opacity-60`}
                  disabled={!newSubGoal.trim()}
                >
                  <Plus />
                </button>
              </div>
              <ul className="space-y-1">
                {goal.subGoals.map((sg, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between ${subgoalBG} rounded px-3 py-2 border
                      ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
                    `}
                  >
                    <span className={theme === "dark" ? "text-gray-100" : "text-gray-700"}>
                      {sg.text}
                    </span>
                    <button type="button"
                      className="text-red-400 hover:text-red-600"
                      onClick={() => handleSubGoalRemove(idx)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {errors.subGoals && <div className="text-sm text-red-500 mt-1">{errors.subGoals}</div>}
            </div>
          )}

          {/* Deadline (optional) */}
          <div>
            <label className={`block mb-1 text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
              Deadline
            </label>
            <input
              type="date"
              value={goal.deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={e => setGoal((g) => ({ ...g, deadline: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border transition ${inputBG} ${inputFocus}`}
            />
          </div>
          {/* Submission */}
          {errors.submit && <div className="text-sm text-red-500">{errors.submit}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 mt-3 rounded-lg font-semibold transition
              ${isSubmitting
                ? "bg-gray-400 text-gray-100"
                : btnPrimary
              }`}
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Creating..." : "Create Goal"}
          </button>
        </form>
      </div>
    </div>
  );
}

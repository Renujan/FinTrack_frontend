import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/common/EmptyState';
import ErrorMessage from '../../components/common/ErrorMessage';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  GoalSummaryCard,
  GoalCard,
  GoalFormModal,
  GoalContributionModal,
  GoalProgressModal,
  GoalDeleteModal,
} from '../../components/goals';
import { Goal, GoalSummary } from '../../types/goal';
import goalService from '../../services/goalService';
import useAuth from '../../hooks/useAuth';
import { Target, Plus, Search, Filter, RefreshCw } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'USD';

  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<GoalSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGoalForEdit, setSelectedGoalForEdit] = useState<Goal | null>(null);

  const [isContributionOpen, setIsContributionOpen] = useState(false);
  const [selectedGoalForContribution, setSelectedGoalForContribution] = useState<Goal | null>(null);

  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [selectedGoalForProgress, setSelectedGoalForProgress] = useState<Goal | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGoalForDelete, setSelectedGoalForDelete] = useState<Goal | null>(null);

  const fetchGoalsAndSummary = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [goalsData, summaryData] = await Promise.all([
        goalService.getGoals({
          search: search.trim() || undefined,
          status: statusFilter,
          goal_type: typeFilter,
          priority: priorityFilter,
        }),
        goalService.getGoalSummary().catch(() => null),
      ]);

      setGoals(goalsData);
      setSummary(summaryData);
    } catch (err: any) {
      setError(err?.message || 'Failed to load financial goals.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, typeFilter, priorityFilter]);

  useEffect(() => {
    fetchGoalsAndSummary();
  }, [fetchGoalsAndSummary]);

  // Handlers
  const handleCreateOpen = () => {
    setSelectedGoalForEdit(null);
    setIsFormOpen(true);
  };

  const handleEditOpen = (goal: Goal) => {
    setSelectedGoalForEdit(goal);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: Partial<Goal>) => {
    if (selectedGoalForEdit) {
      await goalService.updateGoal(selectedGoalForEdit.id, data);
    } else {
      await goalService.createGoal(data);
    }
    fetchGoalsAndSummary(true);
  };

  const handleAddContributionOpen = (goal: Goal) => {
    setSelectedGoalForContribution(goal);
    setIsContributionOpen(true);
  };

  const handleContributionAdded = () => {
    fetchGoalsAndSummary(true);
  };

  const handleViewProgressOpen = (goal: Goal) => {
    setSelectedGoalForProgress(goal);
    setIsProgressOpen(true);
  };

  const handleDeleteOpen = (goal: Goal) => {
    setSelectedGoalForDelete(goal);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async (goalId: number) => {
    await goalService.deleteGoal(goalId);
    fetchGoalsAndSummary(true);
  };

  const handleComplete = async (goal: Goal) => {
    try {
      await goalService.completeGoal(goal.id);
      fetchGoalsAndSummary(true);
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to mark goal completed');
    }
  };

  const handlePause = async (goal: Goal) => {
    try {
      await goalService.pauseGoal(goal.id);
      fetchGoalsAndSummary(true);
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to pause goal');
    }
  };

  const handleResume = async (goal: Goal) => {
    try {
      await goalService.resumeGoal(goal.id);
      fetchGoalsAndSummary(true);
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to resume goal');
    }
  };

  const handleCancel = async (goal: Goal) => {
    try {
      await goalService.cancelGoal(goal.id);
      fetchGoalsAndSummary(true);
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to cancel goal');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Goals"
        subtitle="Set savings targets, monitor milestones, add contributions, and manage completion."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fetchGoalsAndSummary(true)}
              isLoading={refreshing}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleCreateOpen}
            >
              Add Goal
            </Button>
          </div>
        }
      />

      {/* Goal Summary Statistics */}
      <GoalSummaryCard summary={summary} currency={currency} />

      {/* Filters Header */}
      <Card className="!p-4 bg-slate-900 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search goals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="PAUSED">Paused</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Goal Types</option>
              <option value="SAVINGS">Savings</option>
              <option value="EMERGENCY_FUND">Emergency Fund</option>
              <option value="PURCHASE">Purchase</option>
              <option value="TRAVEL">Travel</option>
              <option value="INVESTMENT">Investment</option>
              <option value="DEBT_REPAYMENT">Debt Repayment</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Goal Cards Section */}
      {loading ? (
        <Card>
          <div className="py-12 flex flex-col items-center justify-center">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-slate-400 mt-3">Loading financial goals...</p>
          </div>
        </Card>
      ) : error ? (
        <Card>
          <ErrorMessage
            title="Failed to Load Goals"
            message={error}
            onRetry={() => fetchGoalsAndSummary()}
          />
        </Card>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Target className="w-8 h-8 text-slate-500" />}
            title="No financial goals yet."
            description="Create your first goal to start tracking your progress towards emergency funds, vacations, or major purchases."
            action={
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleCreateOpen}
              >
                Create Goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={currency}
              onAddContribution={handleAddContributionOpen}
              onEdit={handleEditOpen}
              onDelete={handleDeleteOpen}
              onViewProgress={handleViewProgressOpen}
              onComplete={handleComplete}
              onPause={handlePause}
              onResume={handleResume}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        goal={selectedGoalForEdit}
      />

      <GoalContributionModal
        isOpen={isContributionOpen}
        onClose={() => setIsContributionOpen(false)}
        goal={selectedGoalForContribution}
        onContributionAdded={handleContributionAdded}
        currency={currency}
      />

      <GoalProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        goal={selectedGoalForProgress}
        currency={currency}
      />

      <GoalDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        goal={selectedGoalForDelete}
      />
    </div>
  );
};

export default GoalsPage;

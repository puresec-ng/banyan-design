'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BanknotesIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  CheckCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getProfile, getTransactionHistory, TransactionHistory, withdraw } from '@/app/services/dashboard/user-management';
import { useQuery } from "@tanstack/react-query";
import { useToast } from '@/app/context/ToastContext';
import cookie from '@/app/utils/cookie';


// Mock data - In a real app, this would come from your API
const MOCK_WALLET = {
  balance: 50000.00,
  bankDetails: {
    accountName: 'John Doe',
    accountNumber: '0123456789',
    bankName: 'Access Bank'
  },
  transactions: [
    {
      id: 1,
      type: 'credit',
      amount: 25000.00,
      description: 'Claim Settlement',
      date: '2024-04-20T10:30:00',
      status: 'completed'
    },
    {
      id: 2,
      type: 'debit',
      amount: 5000.00,
      description: 'Withdrawal',
      date: '2024-04-18T15:45:00',
      status: 'completed'
    },
    {
      id: 3,
      type: 'credit',
      amount: 30000.00,
      description: 'Claim Settlement',
      date: '2024-04-15T09:20:00',
      status: 'completed'
    }
  ]
};

export default function Wallet() {
  const router = useRouter();
  const { showToast } = useToast();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => getProfile(),
  });

  const { data: transactionHistory, isLoading: isTransactionHistoryLoading } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: () => getTransactionHistory(),
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [redirectCount, setRedirectCount] = useState(10);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    transactionType: 'all'
  });
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistory | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (withdrawSuccess) {
      timer = setInterval(() => {
        setRedirectCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowWithdrawModal(false);
            setWithdrawSuccess(false);
            router.refresh();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [withdrawSuccess, router]);


  useEffect(() => {

    const token = cookie().getCookie('token');

    if (!token) {
      router.push('/portal');
    }
  }, [router]);

  const showSuccessMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !pin) {
      showSuccessMessage('Please fill in all fields');
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showSuccessMessage('Please enter a valid amount');
      return;
    }

    if (amount > Number(user?.account_balance)) {
      showSuccessMessage('Insufficient balance');
      return;
    }

    if (pin.length !== 4) {
      showSuccessMessage('PIN must be 4 digits');
      return;
    }

    try {
      setIsProcessing(true);
      const data = {
        amount: withdrawAmount,
        pin: pin
      }
      const response = await withdraw(data);
      setIsProcessing(false);
      setWithdrawSuccess(true);
      setRedirectCount(10);
      showToast('Withdrawal successful', 'success');
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'An error occurred', 'error');
    }
  };

  const resetWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawSuccess(false);
    setWithdrawAmount('');
    setPin('');
    setRedirectCount(10);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const applyFilters = (transactions: TransactionHistory[]) => {
    return transactions.filter(transaction => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery);

      // Date range filter
      const transactionDate = new Date(transaction.created_at);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      const matchesDate = (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate);

      // Transaction type filter
      const matchesType = filters.transactionType === 'all' ||
        transaction.type === filters.transactionType;

      return matchesSearch && matchesDate && matchesType;
    });
  };

  const filteredTransactions = applyFilters(transactionHistory?.data?.data || []);
  // const filteredTransactions = applyFilters(MOCK_WALLET.transactions);

  const hasActiveFilters = () => {
    return filters.startDate !== '' || filters.endDate !== '' || filters.transactionType !== 'all';
  };

  const getActiveFilterText = () => {
    const parts = [];
    if (filters.startDate || filters.endDate) {
      const start = filters.startDate ? new Date(filters.startDate).toLocaleDateString() : 'Any';
      const end = filters.endDate ? new Date(filters.endDate).toLocaleDateString() : 'Any';
      parts.push(`Date: ${start} - ${end}`);
    }
    if (filters.transactionType !== 'all') {
      parts.push(`Type: ${filters.transactionType.charAt(0).toUpperCase() + filters.transactionType.slice(1)}`);
    }
    return parts;
  };

  const clearAllFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      transactionType: 'all'
    });
  };

  if (isUserLoading || isTransactionHistoryLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D40]"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Wallet Balance */}
        {/* <div className="bg-white rounded-xl shadow p-6">
          <div className="flex gap-4">
            <div className="flex flex-col justify-center py-2">
              <div className="bg-[#004D40] p-3 rounded-full">
                <BanknotesIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Wallet Balance</h2>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] mt-3.5"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Withdraw</span>
                </button>
              </div>
              <div className="mt-0.5">
                <div className="text-3xl font-bold text-gray-900">
                  ₦{user?.account_balance}
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Transaction History</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className={`flex items-center gap-2 px-4 py-2 border ${hasActiveFilters() ? 'border-[#004D40] text-[#004D40]' : 'border-gray-300 text-gray-700'} rounded-lg hover:bg-gray-50`}
              >
                <FunnelIcon className="w-5 h-5" />
                <span>Filter</span>
              </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters() && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Active Filters:</span>
                {getActiveFilterText().map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-[#004D40] bg-opacity-10 text-[#004D40] text-sm rounded-full"
                  >
                    {filter}
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="ml-auto text-sm text-[#004D40] hover:text-[#003D30] font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Transaction List */}
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BanknotesIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions found</h3>
                  <p className="text-gray-500">
                    {hasActiveFilters()
                      ? "Try adjusting your filters or search criteria"
                      : "Your transaction history will appear here"}
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowUpTrayIcon className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownTrayIcon className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'credit'
                          ? `₦${transaction.amount.toLocaleString()}`
                          : `-₦${transaction.amount.toLocaleString()}`
                        }
                      </div>
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="p-2 text-[#004D40] hover:bg-[#004D40] hover:text-white rounded-lg transition-colors"
                        title="View transaction details"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className={`p-4 rounded-full ${selectedTransaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  {selectedTransaction.type === 'credit' ? (
                    <ArrowUpTrayIcon className="w-8 h-8 text-green-600" />
                  ) : (
                    <ArrowDownTrayIcon className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className={`text-2xl font-bold ${selectedTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {selectedTransaction.type === 'credit'
                    ? `₦${selectedTransaction.amount.toLocaleString()}`
                    : `-₦${selectedTransaction.amount.toLocaleString()}`
                  }
                </div>
                <p className="text-gray-500 mt-1">{selectedTransaction.description}</p>
              </div>

              <div className="space-y-4 border-t border-b border-gray-200 py-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-medium text-green-600 capitalize">{selectedTransaction.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(selectedTransaction.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID</span>
                  <span className="font-medium">#{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium capitalize">{selectedTransaction.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            {!withdrawSuccess ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Withdraw Funds</h2>
                  <button
                    onClick={resetWithdrawModal}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Wallet Balance Display */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-gray-600 mb-1">Available Balance</div>
                    <div className="text-2xl font-bold text-gray-900">₦{user?.account_balance}</div>
                  </div>

                  {/* Settlement Account Details */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Settlement Account Details</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={user?.bank_name}
                          disabled
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={user?.bank_account_number}
                          disabled
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">Account Name</label>
                        <input
                          type="text"
                          value={user?.bank_account_name}
                          disabled
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                        placeholder="Enter amount"
                      />
                    </div>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                        maxLength={4}
                        placeholder="Enter 4-digit PIN"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isProcessing ? 'Processing...' : 'Withdraw'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Withdrawal Successful!</h2>
                <p className="text-gray-600 mb-4">
                  ₦{parseFloat(withdrawAmount).toLocaleString()} has been sent to your settlement account
                </p>
                <div className="text-sm text-gray-500">
                  Redirecting in {redirectCount} seconds...
                </div>
                <button
                  onClick={resetWithdrawModal}
                  className="mt-6 px-6 py-2 text-[#004D40] border border-[#004D40] rounded-lg hover:bg-[#004D40] hover:text-white transition-colors"
                >
                  Return to Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Filter Transactions</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  value={filters.transactionType}
                  onChange={(e) => setFilters({ ...filters, transactionType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D40] focus:border-transparent"
                >
                  <option value="all">All Transactions</option>
                  <option value="credit">Credits</option>
                  <option value="debit">Debits</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setFilters({
                      startDate: '',
                      endDate: '',
                      transactionType: 'all'
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-1 px-4 py-2 bg-[#004D40] text-white rounded-lg hover:bg-[#003D30]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSnackbar && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5" />
            <span>{snackbarMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
} 
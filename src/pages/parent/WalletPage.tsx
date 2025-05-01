import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, Gift, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// 定义交易记录接口
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  status: string;
  invoice: string;
  details: {
    items: Array<{ name: string; amount: number }>;
    paymentMethod: string;
  };
}

const WalletPage = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'transactions' | 'payment-methods' | 'coupons'>('transactions');
  const [expandedTransaction, setExpandedTransaction] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取交易记录
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!profile || !profile.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 获取用户已报名的课程
        const enrollmentsResponse = await fetch(`http://localhost:9999/user-enrollments?parentId=${profile.id}`);
        
        if (!enrollmentsResponse.ok) {
          throw new Error(`获取报名数据失败: ${enrollmentsResponse.status}`);
        }
        
        const enrollmentsData = await enrollmentsResponse.json();
        
        // 获取所有课程信息
        const coursesResponse = await fetch('http://localhost:9999/courses');
        
        if (!coursesResponse.ok) {
          throw new Error(`获取课程数据失败: ${coursesResponse.status}`);
        }
        
        const coursesData = await coursesResponse.json();
        
        // 将报名信息和课程信息结合，生成交易记录
        const transactionData: Transaction[] = enrollmentsData.map((enrollment: any, index: number) => {
          const courseId = Number(enrollment.extendedProps.courseId);
          const course = coursesData.find((c: any) => c.id === courseId);
          
          if (!course) return null;
          
          // 从课程费用字符串中提取数字
          const feeMatch = course.fee.match(/\d+/);
          const feeAmount = feeMatch ? parseInt(feeMatch[0]) : 0;
          
          // 假设教材费用是课程费用的10%
          const materialFee = Math.round(feeAmount * 0.1);
          const totalAmount = feeAmount + materialFee;
          
          return {
            id: index + 1,
            date: enrollment.start || new Date().toISOString().split('T')[0],
            description: `${course.name} - ${new Date().getFullYear()}年${new Date().getMonth() + 1}月`,
            amount: totalAmount,
            status: 'paid',
            invoice: `#INV-${new Date().getFullYear()}-${String(index + 1).padStart(3, '0')}`,
            details: {
              items: [
                { name: '课程费用', amount: feeAmount },
                { name: '教材费用', amount: materialFee }
              ],
              paymentMethod: index % 2 === 0 ? 'Visa ending in 4242' : 'MasterCard ending in 5555'
            }
          };
        }).filter(Boolean);
        
        setTransactions(transactionData);
      } catch (err: any) {
        console.error('获取交易记录时出错:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [profile]);

  const paymentMethods = [
    {
      id: 1,
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'MasterCard',
      last4: '5555',
      expiry: '08/26',
      isDefault: false
    }
  ];

  const coupons = [
    {
      id: 1,
      code: 'WELCOME2025',
      discount: '10% off',
      validUntil: '2025-03-31',
      status: 'active'
    },
    {
      id: 2,
      code: 'SUMMER25',
      discount: 'HKD 500 off',
      validUntil: '2025-06-30',
      status: 'active'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'transactions'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('payment-methods')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'payment-methods'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Payment Methods
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            activeTab === 'coupons'
              ? 'bg-purple-100 text-purple-700'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          Coupons
        </button>
      </div>

      {/* Transactions */}
      {activeTab === 'transactions' && (
        <>
          {loading && (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading transactions...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>Error loading transactions: {error}</p>
              <p>Please try again later or contact the administrator.</p>
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <div className="text-center py-10 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600">No transactions found.</p>
              <p className="text-gray-500 mt-2">After enrolling in courses, related transactions will be shown here.</p>
            </div>
          )}

          {!loading && !error && transactions.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border-b border-gray-100 last:border-0">
                  <div className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Receipt className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">
                          HKD {transaction.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => setExpandedTransaction(
                            expandedTransaction === transaction.id ? null : transaction.id
                          )}
                        >
                          {expandedTransaction === transaction.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    {expandedTransaction === transaction.id && (
                      <div className="mt-4 pl-9">
                        <div className="bg-gray-50 rounded-md p-4">
                          <div className="space-y-2">
                            {transaction.details.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600">{item.name === '课程费用' ? 'Course Fee' : item.name === '教材费用' ? 'Material Fee' : item.name}</span>
                                <span className="text-gray-900">HKD {item.amount}</span>
                              </div>
                            ))}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="text-gray-900">{transaction.details.paymentMethod}</span>
                              </div>
                            </div>
                          </div>
                          <button className="mt-4 flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium">
                            <Download className="w-4 h-4 mr-1" />
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Payment Methods */}
      {activeTab === 'payment-methods' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Saved Payment Methods</h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Add New Card
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {paymentMethods.map((method) => (
              <div key={method.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.type} ending in {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Available Coupons</h2>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Add Coupon Code
            </button>
          </div>
          <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-100">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Gift className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{coupon.code}</p>
                    <p className="text-sm text-gray-500">
                      {coupon.discount} • Valid until {coupon.validUntil}
                    </p>
                  </div>
                </div>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Use Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
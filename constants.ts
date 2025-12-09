
import { Group, SavingGoal, Transaction, TransactionType, ContributionRequest, User } from './types';

export const MOCK_USER: User = {
  name: "Kwame Appiah",
  email: "kwame.appiah@example.com",
  phone: "+233 55 123 4567",
  balance: 1450.00,
  savingsBalance: 5200.00,
  avatar: "KA",
  linkedAccounts: [
    {
      id: 'acc1',
      type: 'MOMO',
      provider: 'MTN Mobile Money',
      accountNumber: '0551234567',
      accountName: 'Kwame Appiah',
      isPrimary: true
    },
    {
      id: 'acc2',
      type: 'BANK',
      provider: 'Ecobank',
      accountNumber: '1441000123456',
      accountName: 'Kwame Appiah',
      isPrimary: false
    }
  ]
};

export const MOCK_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Family Circle',
    totalMembers: 5,
    contributionAmount: 200,
    frequency: 'Monthly',
    nextPayout: 'Ama Osei',
    nextPayoutDate: '2023-11-01',
    myTurnDate: '2024-01-01',
    progress: 60,
    poolAmount: 1000
  },
  {
    id: '2',
    name: 'Work Colleagues',
    totalMembers: 12,
    contributionAmount: 50,
    frequency: 'Weekly',
    nextPayout: 'John Doe',
    nextPayoutDate: '2023-10-27',
    progress: 25,
    poolAmount: 600
  }
];

export const MOCK_GOALS: SavingGoal[] = [
  {
    id: '1',
    name: 'New Laptop',
    targetAmount: 5000,
    currentAmount: 2500,
    deadline: '2023-12-25',
    icon: '💻',
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 2700,
    deadline: '2024-06-30',
    icon: '🛡️',
    color: 'bg-green-500'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: TransactionType.CONTRIBUTION,
    amount: 200,
    date: '2023-10-20',
    description: 'Contribution to Family Circle',
    status: 'completed'
  },
  {
    id: 't2',
    type: TransactionType.DEPOSIT,
    amount: 500,
    date: '2023-10-18',
    description: 'Mobile Money Top-up',
    status: 'completed'
  },
  {
    id: 't3',
    type: TransactionType.WITHDRAWAL,
    amount: 100,
    date: '2023-10-15',
    description: 'Withdrawal to Bank',
    status: 'completed'
  }
];

export const LEARN_ARTICLES = [
  {
    id: 1,
    title: "The 50/30/20 Rule",
    category: "Budgeting",
    readTime: "3 min",
    image: "https://picsum.photos/400/200?random=1"
  },
  {
    id: 2,
    title: "Safe Susu Practices",
    category: "Groups",
    readTime: "5 min",
    image: "https://picsum.photos/400/200?random=2"
  },
  {
    id: 3,
    title: "Understanding Interest Rates",
    category: "Loans",
    readTime: "4 min",
    image: "https://picsum.photos/400/200?random=3"
  }
];

export const MOCK_CONTRIBUTION_REQUESTS: ContributionRequest[] = [
  {
    id: '1',
    title: 'School Fees Support',
    description: 'I need support to pay for my final semester tuition fees at KNUST. Any amount helps!',
    targetAmount: 2000,
    currentAmount: 850,
    category: 'Education',
    deadline: '2023-11-15',
    creatorName: 'Kwame Appiah',
    isMyRequest: true,
    supportersCount: 12
  },
  {
    id: '2',
    title: 'Small Business Restock',
    description: 'Help me restock my provision shop after the recent flood damage.',
    targetAmount: 5000,
    currentAmount: 1200,
    category: 'Business',
    deadline: '2023-12-01',
    creatorName: 'Sarah Mensah',
    isMyRequest: false,
    supportersCount: 8
  },
  {
    id: '3',
    title: 'Emergency Medical Bill',
    description: 'Urgent assistance needed for my brother\'s surgery.',
    targetAmount: 15000,
    currentAmount: 6400,
    category: 'Medical',
    deadline: '2023-10-30',
    creatorName: 'Emmanuel O.',
    isMyRequest: false,
    supportersCount: 45
  }
];


export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  CONTRIBUTION = 'CONTRIBUTION',
  PAYOUT = 'PAYOUT'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
}

export interface PayoutRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Group {
  id: string;
  name: string;
  totalMembers: number;
  contributionAmount: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  nextPayout: string;
  nextPayoutDate: string;
  myTurnDate?: string;
  progress: number;
  poolAmount: number;
  members: GroupMember[];
  creatorId: string; // The Admin ID
  payoutRequests: PayoutRequest[];
  chatHistory: ChatMessage[];
}

export interface SavingGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface LinkedAccount {
  id: string;
  type: 'MOMO' | 'BANK';
  provider: string; // e.g., 'MTN', 'Vodafone', 'Ecobank'
  accountNumber: string;
  accountName: string;
  isPrimary: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  savingsBalance: number;
  avatar?: string;
  referralCode?: string;
  referralsCount?: number;
  referralEarnings?: number;
  linkedAccounts: LinkedAccount[];
  transactions: Transaction[];
  savingsGoals: SavingGoal[];
  notifications: AppNotification[];
}

export interface ContributionRequest {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Education' | 'Medical' | 'Business' | 'Emergency' | 'Other';
  deadline: string;
  creatorName: string;
  isMyRequest: boolean;
  supportersCount: number;
}
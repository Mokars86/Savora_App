
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

export interface User {
  name: string;
  email: string;
  phone: string;
  balance: number;
  savingsBalance: number;
  avatar?: string;
  linkedAccounts: LinkedAccount[];
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

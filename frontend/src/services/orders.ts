// src/services/points.ts
import api from './api';

export interface PointsBalance {
  user_id: number;
  total_points: number;
  earned_points: number;
  redeemed_points: number;
}

export interface PointsTransaction {
  id: number;
  points: number;
  type: 'earned' | 'redeemed';
  description: string;
  order_id?: number | null;
  order_number?: string | null;
  created_at: string;
}

export interface PointsStats {
  current_balance: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  monthly_earned: number;
  monthly_redeemed: number;
}

export const pointsService = {
  async getBalance(): Promise<PointsBalance> {
    try {
      const response = await api.get('/points');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch points balance:', error);
      throw error;
    }
  },

  async getHistory(limit: number = 20): Promise<{ total_count: number; transactions: PointsTransaction[] }> {
    try {
      const response = await api.get('/points/history', { params: { limit } });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch points history:', error);
      throw error;
    }
  },

  async getStats(): Promise<PointsStats> {
    try {
      const response = await api.get('/points/stats');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch points stats:', error);
      throw error;
    }
  },

  async redeemPoints(points: number, description?: string): Promise<any> {
    try {
      const response = await api.post('/points/redeem', {
        points,
        description,
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to redeem points:', error);
      throw error;
    }
  },
};
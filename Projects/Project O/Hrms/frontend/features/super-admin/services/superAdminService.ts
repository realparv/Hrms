import apiClient from '@/lib/api/client';

export interface OrganizationStat {
  id: string | number;
  name: string;
  domain: string;
  member_count: number;
}

export const superAdminService = {
  async getOrganizationStats(): Promise<OrganizationStat[]> {
    const response = await apiClient.get('saas/organizations/stats/');
    return response.data;
  },
};

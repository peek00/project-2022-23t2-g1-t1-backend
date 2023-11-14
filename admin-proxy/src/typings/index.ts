export interface IUser {
  id: string;
  companyId?: string;
  // name: string;
  // email: string;
  role: string[];
  fullName?: string;
  token?: string;
}

class Policies {
  private TableName: string;
  private RolesAccess: { [key: string]: ['GET','POST','UPDATE','DELETE'][] };

  constructor(tableName: string, rolesAccess: { [key: string]: ['GET','POST','UPDATE','DELETE'][] }) {
    this.TableName = tableName;
    this.RolesAccess = rolesAccess;
  }

  public getTableName(): string {
    return this.TableName;
  }

  public getRolesAccess(): { [key: string]: ['GET','POST','UPDATE','DELETE'][] } {
    return this.RolesAccess;
  }

  public getRoleAccess(role: string): ['GET','POST','UPDATE','DELETE'][] {
    return this.RolesAccess[role];
  }

  public setTableName(tableName: string): void {
    this.TableName = tableName;
  }

  public setRolesAccess(rolesAccess: { [key: string]: ['GET','POST','UPDATE','DELETE'][] }): void {
    this.RolesAccess = rolesAccess;
  }

  public removeRoleAccess(role: string): void {
    delete this.RolesAccess[role];
  }

  public addRoleAccess(role: string, access: ['GET','POST','UPDATE','DELETE']): void {
    if (!this.RolesAccess[role]) {
      this.RolesAccess[role] = [];
    }
    this.RolesAccess[role].push(access);
  }
}
export default interface IDatabaseProvider {
  createTable: (tableName: string, config:any) => Promise<any>;
  listTables: () => Promise<any>;
  deleteTable: (tableName: string) => Promise<any>;
  add: (tableName:string, data: any) => Promise<any>;
  findAll: (tableName:string, details: any) => Promise<any>;
  findBy: (tableName:string, filter: any) => Promise<any>;
  updateBy: (tableName:string, filter: any) => Promise<any>
  deleteBy: (tableName:string, filter: any) => Promise<any>
}

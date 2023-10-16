export default interface IDatabaseProvider {
  createTable: (tableName: string, config:any) => Promise<any>;
  listTables: () => Promise<any>;
  deleteTable: (tableName: string) => Promise<any>;
  add: (tableName:string, data: any) => Promise<any>;
  update: (tableName:string, id: string, data?: any) => Promise<any>;
  delete: (tableName:string, id: string) => Promise<any>;
  findOne: (tableName:string, id: string) => Promise<any>;
  findAll: (tableName:string, filter: any) => Promise<any>;
  findBy: (tableName:string, filter: any) => Promise<any>;
}

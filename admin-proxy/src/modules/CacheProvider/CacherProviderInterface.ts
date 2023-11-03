export default interface ICacheProvider {
  get: (key: string) => Promise<string | null>;
  write: (key: string, value: string, ttl?: number) => Promise<boolean>;
  flush: () => Promise<boolean>;
  remove: (key: string) => Promise<boolean>;
  initialise:() => Promise<void>;
}

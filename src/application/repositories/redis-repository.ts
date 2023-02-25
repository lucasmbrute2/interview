export interface RedisRepository {
    setValue(key: string, value: string, expire: number): Promise<void>;
    getValue(key: string): Promise<string>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    delete(key: string): Promise<void>;
}

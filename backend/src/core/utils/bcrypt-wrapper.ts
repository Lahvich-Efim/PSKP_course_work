import * as bcrypt from 'bcrypt';

interface IBcrypt {
    genSaltSync(rounds?: number, minor?: 'a' | 'b'): string;
    genSalt(rounds?: number, minor?: 'a' | 'b'): Promise<string>;
    genSalt(callback: (err: Error | undefined, salt: string) => any): void;
    genSalt(
        rounds: number,
        callback: (err: Error | undefined, salt: string) => any,
    ): void;
    genSalt(
        rounds: number,
        minor: 'a' | 'b',
        callback: (err: Error | undefined, salt: string) => any,
    ): void;

    hashSync(data: string | Buffer, saltOrRounds: string | number): string;
    hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
    hash(
        data: string | Buffer,
        saltOrRounds: string | number,
        callback: (err: Error | undefined, encrypted: string) => any,
    ): void;

    compareSync(data: string | Buffer, encrypted: string): boolean;
    compare(data: string | Buffer, encrypted: string): Promise<boolean>;
    compare(
        data: string | Buffer,
        encrypted: string,
        callback: (err: Error | undefined, same: boolean) => any,
    ): void;

    getRounds(encrypted: string): number;
}

const BcryptService: IBcrypt = bcrypt as IBcrypt;

export default BcryptService;

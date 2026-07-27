import { UserRole } from '@prisma/client';
export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}
export declare const generateAccessToken: (payload: Omit<JwtPayload, "iat" | "exp">) => string;
export declare const generateRefreshToken: (payload: Omit<JwtPayload, "iat" | "exp">) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
//# sourceMappingURL=jwt.util.d.ts.map
export type User = {
    id: string;
    email: string;
    name?: string | null;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
};

export type LoginResponse = {
    token: string;
    user: User;
};
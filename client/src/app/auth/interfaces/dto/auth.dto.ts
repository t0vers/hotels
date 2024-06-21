export interface AuthRequestDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    access_token: string;
    token_type: string;
}

export interface RegisterRequestDto {
    username: string;
    email: string;
    password: string;
}

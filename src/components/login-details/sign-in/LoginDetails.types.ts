export type LoginProps = {
    username: string;
    password: string;
}

export type LoginDetailsProps = {
    onLogin: (newToken: string) => void; 
}
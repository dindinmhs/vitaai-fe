import type { TimeStamp } from "./common";

export interface SignInRes {
    accessToken : string;
    userRole : 'ADMIN'|'USER'
}

export interface User extends TimeStamp {
    email : string;
    id : string;
    img_url : string;
    name : string;
    verified_at : string | null;
}


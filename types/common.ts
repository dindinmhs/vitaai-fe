import React from "react";

export interface TimeStamp {
    updatedAt : string;
    createdAt : string;
}

export interface MessageType {
    message : string;
}

export interface DropdownType {
    value : string;
    display : string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
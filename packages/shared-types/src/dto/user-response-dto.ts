import 'reflect-metadata';

import {jsonObject, jsonMember} from 'typedjson';

@jsonObject
export class UserResponseDto {
    @jsonMember(Number, {isRequired: true}) public id!: number;
    @jsonMember(String) public name?: string;

}

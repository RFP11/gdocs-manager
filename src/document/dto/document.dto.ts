import { IsNotEmpty, IsNumber, IsUrl } from "class-validator"

export class DocumentDto {

    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    @IsUrl()
    url : string
}
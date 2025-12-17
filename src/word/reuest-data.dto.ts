import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestData {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// user.controller.ts
import { Controller, Post, Get, Body, ConflictException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }

  @Post('login')
  async signUp(@Body('mobile') mobile: string) {
    try {
      const newUser = await this.userService.createUser(mobile);

      // Send OTP to the registered mobile number (implementation not shown, refer to previous examples)

      return { success: true, message: 'User registered successfully', user: newUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body('mobile') mobile: string, @Body('otp') otp: string) {
    try {
      const isOtpValid = await this.userService.verifyOtp(mobile, otp);
      if (isOtpValid) {
        return { success: true, message: 'OTP verification successful' };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Post('logout')
  async logout(@Body('mobile') mobile: string) {
    try {
      const user = await this.userService.logoutUser(mobile);
      return { success: true, message: 'User logged out successfully', user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }
}

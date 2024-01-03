import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }
  
  async createUser(mobile: string): Promise<User> {
    let user = await this.userModel.findOne({ mobile }).exec();
    if(user){
      if(!user.isLoggedIn){
        user.otp = 123456;
        user.otpSentAt = new Date();
        user.save();
      } else {
        throw new NotFoundException('User is already registered and logged in');
      }
    }else{
      const otp = 123456;
      user = new this.userModel({ mobile, otp });
      user.otpSentAt = new Date();
      await user.save();
    }
    return user;
  }
  async verifyOtp(mobile: string, otp: string): Promise<boolean> {
    const user = await this.userModel.findOne({ mobile, otp }).exec();

    if (!user) {
      throw new NotFoundException('Invalid OTP');
    }

    // Clear the OTP after successful verification
    user.otp = undefined;
    user.isLoggedIn = true;
    await user.save();

    return true;
  }

  async logoutUser(mobile: string): Promise<User> {
    const user = await this.userModel.findOne({ mobile }).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Set the user as logged out
    user.isLoggedIn = false;
    await user.save();

    return user;
  }

}

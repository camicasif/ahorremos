// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import User from 'src/entities/user';
import { UserService } from 'src/users/user.service';
import  {AccountService } from 'src/accounts/account.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly accountService : AccountService,
  ) {}

  async register(userData: Partial<User>): Promise<User> {
    // Encripta la contraseña antes de guardar al usuario
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(userData.password, salt);
    return this.userService.saveUser(userData);
  }

  async login(email: string, password: string): Promise<{ accessToken: string, name:String, lastName:String, accountId:String }> {
    const user = await this.userService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.user_id, email: user.email, rankId: user.rank.rank_id };
    const accessToken = this.jwtService.sign(payload);
    const name = user.name;
    const lastName = user.lastName;
    const accountId = (await this.accountService.findAccountByUser(user)).id;
    return { accessToken, name,lastName, accountId };
  }



  async loginAdmin(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    } 

    if (!user.rank || user.rank.rank_id !== 2) {
      throw new UnauthorizedException('You are not an admin');
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { userId: user.user_id, email: user.email, rankId: user.rank.rank_id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }


}

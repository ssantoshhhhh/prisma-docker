import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: any) {
    dto.password = await bcrypt.hash(dto.password, 10);
    try {
      return await this.users.create(dto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Email already exists');
      }
      throw error;
    }
  }

async login(dto: LoginDto) {
  const user = await this.users.findByEmail(dto.email);
  if (!user) throw new UnauthorizedException('Credentials incorrect');

  const payload = { userId: user.id, role: (user as any).role };

  const accessToken = this.jwt.sign(payload, { expiresIn: '15m' });
  const refreshToken = this.jwt.sign(payload, { expiresIn: '7d' });

  const hashedRt = await bcrypt.hash(refreshToken, 10);

  await this.users.update(user.id, {
    refreshToken: hashedRt,
  });

  return { accessToken, refreshToken };
}

async refresh(token: string) {
  const payload = this.jwt.verify(token);

  const user = await this.users.findById(payload.userId);

  if (!user || !(user as any).refreshToken)
    throw new UnauthorizedException();

  const match = await bcrypt.compare(token, (user as any).refreshToken);
  if (!match) throw new UnauthorizedException();

  const newPayload = { userId: user.id, role: (user as any).role };

  return {
    accessToken: this.jwt.sign(newPayload, { expiresIn: '15m' }),
  };
}




}

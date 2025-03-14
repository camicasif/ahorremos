import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Rank from 'src/entities/rank';

import User from 'src/entities/User';

import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rank)
    private readonly rankRepository: Repository<Rank>,
  ) {}

  async saveUser(userData: Partial<User>): Promise<User> {
    try {
      // Si no se proporciona un rango, usa el por defecto
      if (!userData.rank) {
        userData.rank = await this.getOrCreateDefaultRank();
      }

      const user: User = this.userRepository.create(userData);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw error;
    }
  }

  private async getOrCreateDefaultRank(): Promise<Rank> {
    const DEFAULT_RANK_ID = 1;
    let defaultRank: Rank;

    // Buscar el rango con ID 1
    defaultRank = await this.rankRepository.findOne({
      where: { rank_id: DEFAULT_RANK_ID },
    });

    // Si no existe, crear uno nuevo llamado "default"
    if (!defaultRank) {
      defaultRank = this.rankRepository.create({
        name: 'default',
      });
      await this.rankRepository.save(defaultRank);
    }

    return defaultRank;
  }

  async getUsers(): Promise<User[]> {
    try {
      const users: User[] = await this.userRepository.find();
      return users;
    } catch (error) {
      throw error;
    }
  }


  async findByEmail(userEmail: string): Promise<User>{
    try {
        const user: User | null =  await this.userRepository.findOne({
          where: { email: userEmail },
          relations: ['rank'], // Asegurar que carga la relación rank
      });
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        return user
      } catch (error) {
        throw error;
      }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      const user: User | null = await this.userRepository.findOneBy({user_id:userId});
      if (!user) {
        throw new Error('Archivo multimedia no encontrado');
      }
      await this.userRepository.remove(user);
    } catch (error) {
      throw error;
    }
  }


  async getUserById(userId: number): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({user_id:userId});
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
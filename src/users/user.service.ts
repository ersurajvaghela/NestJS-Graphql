import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
    await this.findOne(id); // Check if user exists
    
    await this.userRepository.update(id, updateUserInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    await this.findOne(id); // Check if user exists
    
    const result = await this.userRepository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }
}
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from '../dtos';
import { Client } from '../entities/client.entity';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async createClient(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Client name already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async getAll(): Promise<Client[]> {
    return await this.clientRepository.find();
  }

  async getById(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }
}

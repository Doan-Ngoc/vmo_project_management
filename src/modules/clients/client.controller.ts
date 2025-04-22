import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';
import { Auth } from '../../decorators/auth.decorator';
import { Permissions } from '../../enum/permissions.enum';
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @Auth(Permissions.CREATE_CLIENT)
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }

  @Get()
  @Auth(Permissions.GET_ALL_CLIENTS)
  async getAllClients(): Promise<Client[]> {
    return this.clientService.getAll();
  }

  @Get(':id')
  @Auth(Permissions.GET_CLIENT_BY_ID)
  async getClientById(@Param('id') id: string): Promise<Client> {
    return this.clientService.getById(id);
  }
}

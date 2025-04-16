import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ClientService } from './services/client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';
import { Auth } from 'src/decorators/auth.decorator';
import { Permissions } from 'src/enum/permissions.enum';
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Auth(Permissions.CREATE_CLIENT)
  @Post()
  async createClient(
    @Body() createClientDto: CreateClientDto,
  ): Promise<Client> {
    return this.clientService.createClient(createClientDto);
  }
}

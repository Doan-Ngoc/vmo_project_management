import { Controller } from '@nestjs/common';
import { FileService } from '../../shared/file-processing/services/file.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FileService) {}
}

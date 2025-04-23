import { Injectable, BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { CreateUserDto } from '../../../modules/users/dtos';

@Injectable()
export class FileService {
  constructor() {}

  async processExcelImport(
    file: Express.Multer.File,
  ): Promise<CreateUserDto[]> {
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: CreateUserDto[] = xlsx.utils.sheet_to_json(worksheet);

      // Validate data
      await this.validateExcelData(jsonData);
      return jsonData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Excel file upload failed.');
    }
  }

  private async validateExcelData(data: any[]): Promise<void> {
    const requiredFields = ['email', 'employeeName', 'role', 'workingUnit'];
    const emails = new Set<string>();
    const errors: string[] = [];

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      const rowNumber = rowIndex + 1;

      // Check required fields
      for (const field of requiredFields) {
        if (!row[field]) {
          errors.push(`Missing required field at row ${rowNumber}: ${field}`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        errors.push(`Invalid email format at row ${rowNumber}: ${row.email}`);
      }

      // Check for duplicate emails within the file
      if (emails.has(row.email)) {
        errors.push(`Duplicate email found at row ${rowNumber}: ${row.email}`);
      } else {
        emails.add(row.email);
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Excel validation failed',
        errors: errors,
      });
    }
  }
}

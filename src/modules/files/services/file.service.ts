import { Injectable, BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { CreateUserDto } from '../../users/dtos';
import { RoleService } from '../../roles/services/role.service';
import { WorkingUnitService } from '../../working-units/services/working-unit.service';
import { generateRandomPassword } from '@/utils/password-generator.util';
import { RoleName } from '@/enum/role.enum';

@Injectable()
export class FileService {
  constructor(
    private readonly roleService: RoleService,
    private readonly workingUnitService: WorkingUnitService,
  ) {}

  async processExcelImport(
    file: Express.Multer.File,
  ): Promise<CreateUserDto[]> {
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);

      // Validate data
      this.validateExcelData(jsonData);
      return await this.mapExcelToCreateUserDto(jsonData);
    } catch (error) {
      throw new BadRequestException('Invalid Excel file format');
    }
  }

  private async validateExcelData(data: any[]): Promise<void> {
    const requiredFields = ['Email', 'Employee Name', 'Role', 'Working Unit'];
    const emails = new Set<string>();
    const errors: string[] = [];

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      const rowNumber = rowIndex + 1;

      // Check required fields
      for (const field of requiredFields) {
        if (!row[field]) {
          errors.push(`Missing required field: ${field} at row ${rowNumber}`);
        }
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row['Email'])) {
        errors.push(
          `Invalid email format at row ${rowNumber}: ${row['Email']}`,
        );
      }
      emails.add(row['Email']);

      // Check if role name is one of the values in the RoleName enum
      const roleValue = row['Role']?.toLowerCase();
      try {
        await this.roleService.getByName(roleValue);
      } catch (error) {
        errors.push(
          `Invalid role at row ${rowNumber}: ${row['Role']}. This role does not exist in the system.`,
        );
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Excel validation failed',
        errors,
      });
    }
  }

  private async mapExcelToCreateUserDto(data: any[]): Promise<CreateUserDto[]> {
    const transformedData: CreateUserDto[] = [];

    for (const row of data) {
      const role = await this.roleService.getByName(
        row['Role'].toLowerCase() as RoleName,
      );
      const workingUnit = await this.workingUnitService.findByName(
        row['Working Unit'],
      );

      transformedData.push({
        email: row['Email'],
        employeeName: row['Employee Name'],
        roleId: role.id,
        workingUnitId: workingUnit.id,
        password: generateRandomPassword(),
      });
    }

    return transformedData;
  }
}

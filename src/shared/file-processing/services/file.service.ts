import { Injectable, BadRequestException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { CreateUserDto } from '@/modules/users/dtos';
import { RoleService } from '@/modules/roles/services/role.service';
import { WorkingUnitService } from '@/modules/working-units/services/working-unit.service';
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
      const jsonData: CreateUserDto[] = xlsx.utils.sheet_to_json(worksheet);

      // Validate data
      await this.validateExcelData(jsonData);
      return jsonData;
    } catch (error) {
      //   console.log('reach here');
      //   throw new error();
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Excel file upload failed.');
      //   // }
      //   // throw new BadRequestException('Invalid Excel file format');
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

  // private async mapExcelToCreateUserDto(data: any[]): Promise<CreateUserDto[]> {
  //   const transformedData: CreateUserDto[] = [];
  //   const roles = await this.roleService.getAll();
  //   const roleNames = roles.map((role) => role.name);
  //   const workingUnits = await this.workingUnitService.getAll();
  //   const workingUnitNames = workingUnits.map(
  //     (workingUnit) => workingUnit.name,
  //   );

  //   for (const row of data) {
  //     const role = roles.find((role) => role.name === row['Role']);
  //     if (!role) {
  //       throw new BadRequestException(
  //         `Role ${row['Role']} not found in the system.`,
  //       );
  //     }
  //     const workingUnitId = workingUnits.find(
  //       (workingUnit) => workingUnit.name === row['Working Unit'],
  //     )?.id;
  //     if (!workingUnitId) {
  //       throw new BadRequestException(
  //         `Working Unit ${row['Working Unit']} not found in the system.`,
  //       );
  //     }

  //     transformedData.push({
  //       email: row['Email'],
  //       employeeName: row['Employee Name'],
  //       roleId: roleId,
  //       workingUnitId: workingUnitId,
  //       password: generateRandomPassword(),
  //     });
  //   }

  //   return transformedData;
  // }
}

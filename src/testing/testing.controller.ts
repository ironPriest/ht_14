import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from './testing.service';

@Controller('testing/all-data')
export class TestingController {
  constructor(protected testingService: TestingService) {}

  @Delete()
  @HttpCode(204)
  deleteAll() {
    this.testingService.deleteAll();
  }
}

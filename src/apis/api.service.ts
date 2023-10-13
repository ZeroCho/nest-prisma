import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  login() {
    return 'This action adds a new user';
  }

  logout() {
    return `This action returns all users`;
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  login(user) {
    return user;
  }

  logout() {
    return `This action returns all users`;
  }
}

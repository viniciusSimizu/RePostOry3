import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class EncriptyService {
  async hash(password: string) {
    return hash(password, await genSalt());
  }

  async compare(password: string, hash: string) {
    return compare(password, hash);
  }
}

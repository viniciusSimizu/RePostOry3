import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubService {
  constructor(
    private readonly GITHUB: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async execute(token) {
    return this.httpService.axiosRef.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: this.GITHUB.get('CLIENT_ID'),
        client_secret: this.GITHUB.get('CLIENT_SECRET'),
        code: token,
      },
      {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'X-Requested-With',
        },
        withCredentials: false,
      },
    );
  }
}

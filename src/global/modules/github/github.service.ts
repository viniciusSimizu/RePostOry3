import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GITHUB_ENVIRONMENT } from '../../@config/github.environment';

@Injectable()
export class GithubService {
  readonly GITHUB = GITHUB_ENVIRONMENT;
  constructor(private readonly httpService: HttpService) {}
  async teste(token) {
    return this.httpService.axiosRef.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: this.GITHUB.CLIENT_ID,
        client_secret: this.GITHUB.CLIENT_SECRET,
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

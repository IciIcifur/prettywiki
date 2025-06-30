import axios from 'axios';
import type { User } from '../types/types.ts';

const API_URI = 'https://en.wikipedia.org/w/api.php';
const ORIGIN = '*';

export async function GetUserByLogin(login: string): Promise<User | null> {
  try {
    const result = await axios.get(API_URI, {
      params: {
        action: 'query',
        list: 'users',
        ususers: login,
        usprop: 'groups|registration|gender',
        format: 'json',
        origin: ORIGIN,
      },
    });
    const user: any = result.data.query.users[0];
    if ('missing' in user) return null;

    return {
      login,
      id: user.userid,
      gender: user.gender,
      registrationDate: user.registration,
      groups: user.groups,
    };
  } catch {
    return null;
  }
}

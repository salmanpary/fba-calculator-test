import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
@Injectable()
export class FbaRepository {
  async getReferralData() {
    const data = await readFile('./src/fba/data/referralFee.json', 'utf8');
    const dataObj = JSON.parse(data);
    return dataObj;
  }
}

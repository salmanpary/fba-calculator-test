import { readFile, writeFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
@Injectable()
export class FbaRepository {
  async getReferralData() {
    const data = await readFile(
      './src/fba/data/amazonFees/referralFee.json',
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getFixedClosingFeeData() {
    const data = await readFile(
      './src/fba/data/amazonFees/fixedClosingFee.json',
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getVariableClosingFeeData() {
    const data = await readFile(
      './src/fba/data/amazonFees/variableClosingFee.json',
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
}

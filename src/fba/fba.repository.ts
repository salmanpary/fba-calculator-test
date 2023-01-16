import { readFile } from 'fs/promises';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
@Injectable()
export class FbaRepository {
  async getReferralData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','amazonFees','referralFee.json'), 'utf8');
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getFixedClosingFeeData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','amazonFees','fixedClosingfee.json'),
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getVariableClosingFeeData() {
    const data = await readFile(
    join(__dirname, '..', 'public','fba','data','amazonFees','variableClosingFee.json'),
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getProductSizeTierData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','sizeTier.json'), 'utf8');
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getFulfillmentFeeData() {
    const data1 = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','fulfillmentFee.json'),
      'utf8',
    );
    const data2 = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','addOn.json'), 'utf8');
    const dataObj1 = JSON.parse(data1);
    const dataObj2 = JSON.parse(data2);
    return {
      data1: dataObj1,
      data2: dataObj2,
    };
  }
  async getAddOnData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','addOn.json'), 'utf8');
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getDimensionalWeightUsageData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','dimensionalWeightUsage.json'),
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getApparelsDetails() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','fulfillmentFees','apparel.json'), 'utf8');
    const dataObj = JSON.parse(data);
    return dataObj;
  }
  async getMontlyChargeData() {
    const data = await readFile(join(__dirname, '..', 'public','fba','data','storageFees','monthlyCharge.json'),
      'utf8',
    );
    const dataObj = JSON.parse(data);
    return dataObj;
  }
}

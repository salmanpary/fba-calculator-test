import { Injectable } from '@nestjs/common';
import { FbaRepository } from './fba.repository';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class FbaService {
  constructor(public fbaRepository: FbaRepository) {}
  async CalculateReferralfee(category: string, price: number) {
    //may have changes in collectible coin data
    const data = await this.fbaRepository.getReferralData();
    const requiredData = data.find((item) => item.category === category);
    if (!requiredData) {
      throw new NotFoundException('Category not found');
    }
    if (requiredData?.fees1) {
      let feepercent: number;
      for (let i = 0; i < requiredData.fees1.length; i++) {
        if (
          price > requiredData.fees1[i].minprice &&
          price <= requiredData.fees1[i].maxprice
        ) {
          feepercent = requiredData.fees1[i].feepercent;
        } else {
          console.log('testing');
          feepercent =
            requiredData.fees1[requiredData.fees1.length - 1].feepercent;
        }
      }
      if (requiredData.minfee) {
        const referralFee = Math.max(
          requiredData.minfee,
          (feepercent * price) / 100,
        );
        const roundedReferralFee = Math.round(referralFee * 100) / 100;
        return roundedReferralFee;
      } else {
        const referralFee = (feepercent * price) / 100;
        const roundedReferralFee = Math.round(referralFee * 100) / 100;
        return roundedReferralFee;
      }
    } else if (requiredData?.fees2) {
      let referralFee1: number = 0;

      let flag: number | null = null;
      for (let i = 0; i < requiredData.fees2.length; i++) {
        if (
          price > requiredData.fees2[i].minprice &&
          price <= requiredData.fees2[i].maxprice
        ) {
          flag = i;
          if (flag === 0) {
            referralFee1 = (requiredData.fees2[0].feepercent * price) / 100;
          } else {
            referralFee1 +=
              ((price - requiredData.fees2[i].minprice) *
                requiredData.fees2[i].feepercent) /
              100;
            console.log(referralFee1);
            for (let j = flag - 1; j >= 0; j--) {
              console.log(j);
              referralFee1 +=
                ((requiredData.fees2[j].maxprice -
                  requiredData.fees2[j].minprice) *
                  requiredData.fees2[j].feepercent) /
                100;
              console.log(referralFee1);
            }
          }
        } else if (
          price > requiredData.fees2[i].minprice &&
          requiredData.fees2[i].maxprice === false
        ) {
          flag = i;
          referralFee1 +=
            ((price - requiredData.fees2[i].minprice) *
              requiredData.fees2[i].feepercent) /
            100;
          for (let j = flag - 1; j >= 0; j--) {
            referralFee1 +=
              ((requiredData.fees2[j].maxprice -
                requiredData.fees2[j].minprice) *
                requiredData.fees2[j].feepercent) /
              100;
          }
        }
      }
      if (requiredData.minfee) {
        const referralFee = Math.max(requiredData.minfee, referralFee1);
        const roundedReferralFee = Math.round(referralFee * 100) / 100;
        return roundedReferralFee;
      } else {
        const roundedReferralFee = Math.round(referralFee1 * 100) / 100;
        return roundedReferralFee;
      }
    }
    if (requiredData.minfee) {
      const referralFee = Math.max(
        requiredData.minfee,
        (requiredData.feepercent * price) / 100,
      );
      const roundedReferralFee = Math.round(referralFee * 100) / 100;
      return roundedReferralFee;
    } else {
      const referralFee = (requiredData.feepercent * price) / 100;
      const roundedReferralFee = Math.round(referralFee * 100) / 100;
      return roundedReferralFee;
    }
  }
  async CalculateFixedClosingFee() {
    const data = await this.fbaRepository.getFixedClosingFeeData();
    const requiredData = data.find(
      (item) => item.plan === 'Individual Selling Plan',
    );
    if (!requiredData) {
      throw new NotFoundException('Category not found');
    }
    const fixedClosingFee = requiredData.perItemPrice;
    return fixedClosingFee;
  }
  async CalculateVariableClosingFee(category: string) {
    const data = await this.fbaRepository.getVariableClosingFeeData();
    const requiredData = data.category.includes(category);
    if (!requiredData) {
      return 0;
    } else {
      return data.fee;
    }
  }
  async CalculateAmazonFee(category: string, price: number) {
    const amazonFee =
      (await this.CalculateReferralfee(category, price)) +
      (await this.CalculateFixedClosingFee()) +
      (await this.CalculateVariableClosingFee(category));
    return {
      referralFee: await this.CalculateReferralfee(category, price),
      fixedClosingFee: await this.CalculateFixedClosingFee(),
      variableClosingFee: await this.CalculateVariableClosingFee(category),
      total: amazonFee,
    };
  }
}

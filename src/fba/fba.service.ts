import { Injectable } from '@nestjs/common';
import { FbaRepository } from './fba.repository';
import { NotFoundException } from '@nestjs/common';
import { referralDto } from './dto/referral.dto';
import { fixedClosingDTO } from './dto/fixedClosing.dto';
import { sizeTierDto } from './dto/sizeTier.dto';
import { dimensionalWeightDTO } from './dto/dimensionalWeight.dto';
import { nonApparelFeesDTO } from './dto/nonApparelFees.dto';
import { addOnDto } from './dto/addOn.dto';
import { monthlyChargeDto } from './dto/monthlyCharge.dto';
@Injectable()
export class FbaService {
  constructor(public fbaRepository: FbaRepository) {}
  async CalculateReferralfee(category: string, price: number) {
    //may have changes in collectible coin data
    const data = await this.fbaRepository.getReferralData();

    const requiredData =await data.find((item:referralDto) => item.category === category);
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
          break;
        } else {
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

            for (let j = flag - 1; j >= 0; j--) {
              referralFee1 +=
                ((requiredData.fees2[j].maxprice -
                  requiredData.fees2[j].minprice) *
                  requiredData.fees2[j].feepercent) /
                100;
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
      (item:fixedClosingDTO) => item.plan === 'Individual Selling Plan',
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
    Math.round (( (await this.CalculateReferralfee(category, price)) +
      (await this.CalculateFixedClosingFee()) +
      (await this.CalculateVariableClosingFee(category)))*100)/100;
    return {
      referralFee: await this.CalculateReferralfee(category, price),
      fixedClosingFee: await this.CalculateFixedClosingFee(),
      variableClosingFee: await this.CalculateVariableClosingFee(category),
      total: amazonFee,
    };
  }
  async CalculateProductSizeTier(
    weight: number,
    length: number,
    width: number,
    height: number,
    unit: string,
  ) {
    let girthPlusLength: number = 2 * (width + height) + length;
    let lengthInInches: number;
    let widthInInches: number;
    let heightInInches: number;
    if (unit === 'cm') {
      lengthInInches = length / 2.54;
      widthInInches = width / 2.54;
      heightInInches = height / 2.54;
    } else {
      lengthInInches = length;
      widthInInches = width;
      heightInInches = height;
    }
    const data = await this.fbaRepository.getProductSizeTierData();
    let requiredData: any;
    let req;
    requiredData = data.find((item:sizeTierDto) => {
      if (
        weight <= item.unitweight &&
        lengthInInches <= item.length &&
        widthInInches <= item.width &&
        heightInInches <= item.height &&
        null === item.girthPlusLength
      ) {
        return item;
      } else if (
        weight <= item.unitweight &&
        lengthInInches <= item.length &&
        widthInInches <= item.width &&
        null === item.height &&
        girthPlusLength <= item.girthPlusLength
      ) {
        return item;
      } else if (
        weight <= item.unitweight &&
        lengthInInches <= item.length &&
        null === item.width &&
        null === item.height &&
        girthPlusLength <= item.girthPlusLength
      ) {
        return item;
      } else if (
        weight > 150 &&
        lengthInInches > 108 &&
        girthPlusLength > 165
      ) {
        return item;
      }
    });
    return requiredData.sizetier;
  }
  async CalculateDetailsForFulfillment(
    length: number,
    width: number,
    height: number,
    weight: number,
    unit: string,
  ) {
    const dimensionalWeightUsageDetails =
      await this.fbaRepository.getDimensionalWeightUsageData();
    const sizeTier = await this.CalculateProductSizeTier(
      weight,
      length,
      width,
      height,
      unit,
    );

    const girth = 2 * (width + height);
    const girthPlusLength = length + girth;
    const volume = length * width * height;
    let heightForDimensionalWeight: number;
    let widthForDimensionalWeight: number;
    let lengthInInches: number;
    let widthInInches: number;
    let heightInInches: number;
    let girthInInches: number;
    let girthPlusLengthInInches: number;
    let volumeInCubicFeet: number;
    let volumeRoundedToTwoDecimal: number;
    let dimensionalWeight: number;
    let shippingWeight: number;
    let weightforCalculation: number;
    let weightforCalculation2: number;
    let weightforCalculation3: number;
    heightForDimensionalWeight = height;
    widthForDimensionalWeight = width;
    if (sizeTier.includes('oversize')) {
      if (unit === 'in') {
        if (height < 2 || !height) {
          heightForDimensionalWeight = 2;
        } else {
          heightForDimensionalWeight = height;
        }
        if (width < 2 || !width) {
          widthForDimensionalWeight = 2;
        } else {
          widthForDimensionalWeight = width;
        }
      } else if (unit === 'cm') {
        if (height / 2.54 < 2 || !height) {
          heightForDimensionalWeight = 2;
        } else {
          heightForDimensionalWeight = height / 2.54;
        }
        if (width / 2.54 < 2 || !width) {
          widthForDimensionalWeight = 2;
        } else {
          widthForDimensionalWeight = width / 2.54;
        }
      }
    }
    if (unit === 'in') {
      lengthInInches = Math.round(length * 10) / 10;
      widthInInches = Math.round(width * 10) / 10;
      heightInInches = Math.round(height * 10) / 10;
      girthInInches = Math.round(girth * 10) / 10;

      girthPlusLengthInInches = Math.round(girthPlusLength * 10) / 10;
      volumeInCubicFeet = volume / 1728;

      volumeRoundedToTwoDecimal = Math.round(volumeInCubicFeet * 100) / 100;
      dimensionalWeight =
        Math.round(
          ((lengthInInches *
            heightForDimensionalWeight *
            widthForDimensionalWeight) /
            139) *
            100,
        ) / 100;
      const requiredData = dimensionalWeightUsageDetails.find((item:dimensionalWeightDTO) => {
        if (item.sizetier === sizeTier) {
          return item;
        }
      });
      if (requiredData.unitweight) {
        weightforCalculation = weight;
        weightforCalculation2 = Math.round(weight * 10) / 10;
      } else {
        weightforCalculation = Math.max(weight, dimensionalWeight);
        weightforCalculation2 =
          Math.round(Math.max(weight, dimensionalWeight) * 10) / 10;
        const temp = weightforCalculation.toString().split('.');

        if (Number('.' + temp[1]) > 0.5) {
          weightforCalculation3 = Number(temp[0]) + 1;
        } else if (!temp[1]) {
          weightforCalculation3 = Number(temp[0]);
        } else {
          weightforCalculation3 = Number(temp[0]) + 0.5;
        }
      }
      if (weightforCalculation > 1) {
        shippingWeight = Math.ceil(Math.max(weight, dimensionalWeight));
      } else {
        const inOunce = weightforCalculation * 16;
        const inOunceRounded = Math.ceil(inOunce);
        shippingWeight = inOunceRounded / 16;
      }
    } else if (unit === 'cm') {
      lengthInInches = Math.round((length / 2.54) * 10) / 10;
      widthInInches = Math.round((width / 2.54) * 10) / 10;
      heightInInches = Math.round((height / 2.54) * 10) / 10;
      girthInInches = Math.round((girth / 2.54) * 10) / 10;
      girthPlusLengthInInches = Math.round((girthPlusLength / 2.54) * 10) / 10;
      volumeInCubicFeet = volume / 28316.8466;
      volumeRoundedToTwoDecimal = Math.round(volumeInCubicFeet * 100) / 100;
      dimensionalWeight =
        Math.round(
          ((lengthInInches *
            heightForDimensionalWeight *
            widthForDimensionalWeight) /
            139) *
            100,
        ) / 100;
      const requiredData = dimensionalWeightUsageDetails.find((item) => {
        if (item.sizetier === sizeTier) {
          return item;
        }
      });
      if (requiredData.unitweight) {
        weightforCalculation = weight;
      } else {
        weightforCalculation = Math.max(weight, dimensionalWeight);
        weightforCalculation2 =
          Math.round(Math.max(weight, dimensionalWeight) * 10) / 10;
        const temp = weightforCalculation.toString().split('.');

        if (Number('.' + temp[1]) > 0.5) {
          weightforCalculation3 = Number(temp[0]) + 1;
        } else if (Number('.' + temp[1]) === 0) {
          weightforCalculation3 = Number(temp[0]);
        } else {
          weightforCalculation3 = Number(temp[0]) + 0.5;
        }
      }
      if (weightforCalculation > 1) {
        shippingWeight = Math.ceil(Math.max(weight, dimensionalWeight));
      } else {
        const inOunce = weightforCalculation * 16;
        const inOunceRounded = Math.ceil(inOunce);
        shippingWeight = inOunceRounded / 16;
      }
    }
    return {
      length: lengthInInches,
      width: widthInInches,
      height: heightInInches,
      weight: weight,
      girth: girthInInches,
      girthPlusLength: girthPlusLengthInInches,
      volume: volumeRoundedToTwoDecimal,
      dimensionalWeight: dimensionalWeight,
      sizeTier: sizeTier,
      shippingWeight: shippingWeight,
      weightforCalculation3: weightforCalculation3,
      volume2: volumeInCubicFeet,
    };
  }
  async CalculateFulfillmentFee(
    length: number,
    width: number,
    height: number,
    weight: number,
    unit: string,
    category: string,
    addon: string[]=[],
    shippingToAmazon: number=0,
  ) {
    const neededDataForCalculation = await this.CalculateDetailsForFulfillment(
      length,
      width,
      height,
      weight,
      unit,
    );
    const shippingWeight = neededDataForCalculation.shippingWeight;

    const sizeTier = neededDataForCalculation.sizeTier;
    const weightforCalculation3 =
      neededDataForCalculation.weightforCalculation3;

    const apparelData = await this.fbaRepository.getApparelsDetails();
    const datas = await this.fbaRepository.getFulfillmentFeeData();
    const addOnData = await this.fbaRepository.getAddOnData();

    const data1 = datas.data1;
    let key: string;
    let fbaFulfillmentFee: number;
    let addOnFee: number = 0;
    if (apparelData.includes(category)) {
      key = 'apparel';
    } else {
      key = 'nonapparel';
    }
    //change to nonapparel for correct value
    const requiredData1 = data1["nonapparel"].fees.find((item:nonApparelFeesDTO) => {
      if (item.sizetier === sizeTier) {
        if (
          shippingWeight > item.minweight &&
          shippingWeight <= item.maxweight
        ) {
          return item;
        } else if (shippingWeight > 150) {
          return data1[key].fees[data1.nonapparel.fees.length - 1];
        }
      }
    });
    if (typeof requiredData1.fee === 'number') {
      fbaFulfillmentFee = requiredData1.fee;
    } else if (typeof requiredData1.fee === 'object') {
      //put weightForCalculation 3 if needed
      if (shippingWeight <= requiredData1.fee.above) {
        fbaFulfillmentFee = requiredData1.fee.min;
      } else {
        //put weightForCalculation 3 if needed
        const difference = shippingWeight - requiredData1.fee.above;

        const howmanytimes = Math.trunc(difference / requiredData1.fee.per);
        const fee =
          requiredData1.fee.min + howmanytimes * requiredData1.fee.extra;
        fbaFulfillmentFee = fee;
      }
    }
    if (addon.length > 0) {
      addOnFee = addon.reduce((total, curr) => {
        const requiredData2 = addOnData.find((item:addOnDto) => {
          if (item.addOn === curr) {
            return item;
          }
        });
        return total + requiredData2.price;
      }, 0);
    }
    return {
      fbaFulfillmentFee: fbaFulfillmentFee,
      addOnFee: Math.round(addOnFee * 100) / 100,
      shippingToAmazon: shippingToAmazon,
      totalFulfillmentFee:
        Math.round((fbaFulfillmentFee + shippingToAmazon + addOnFee) * 100) /
        100,
    };
  }
  async CalculateStorageFee(
    length: number,
    width: number,
    height: number,
    weight: number,
    unit: string,
    monthStart: string="jan",
    monthEnd: string="sep",
    averageInventoryStored: number=1,
    monthlyUnitsSold: number=1,
  ) {
    const neededDataForCalculation = await this.CalculateDetailsForFulfillment(
      length,
      width,
      height,
      weight,
      unit,
    );
    const sizeTier = neededDataForCalculation.sizeTier;
    const volume = neededDataForCalculation.volume2;
    const data = await this.fbaRepository.getMontlyChargeData();
    let sizeTierCategory: string;
    let storageCostPerUnitSold: number;
    if (sizeTier.includes('standard-size')) {
      sizeTierCategory = 'standardSize';
    } else if (sizeTier.includes('oversize')) {
      sizeTierCategory = 'overSize';
    }
    const requiredData = data.nondangerous.details.find((item:monthlyChargeDto) => {
      if (item.monthStart === monthStart && item.monthEnd === monthEnd) {
        return item;
      }
    });
    const storageFee = requiredData[sizeTierCategory] * volume;
    const roundedStorageFee = Math.round(storageFee * 100) / 100;
    const totalMontlyStorageFee = storageFee * averageInventoryStored;
 
    let fixed = Math.round(totalMontlyStorageFee * 100) / 100;
    if (fixed < 0.01) {
      fixed = totalMontlyStorageFee;
    }
    storageCostPerUnitSold =
      Math.round((totalMontlyStorageFee / monthlyUnitsSold) * 100) / 100;
    if (storageCostPerUnitSold < 0.01) {
      storageCostPerUnitSold = totalMontlyStorageFee / monthlyUnitsSold;
    }

    return {
      monthlyStorageFeePerUnit:roundedStorageFee,
      totalMontlyStorageFee: fixed,
      storageCostPerUnitSold: storageCostPerUnitSold,
    };
  }
  async CalculateOtherCosts(costsOfGoodsSold: number=0, miscCost: number=0) {
    const rounded = Math.round((costsOfGoodsSold + miscCost) * 100) / 100;
    return {
      costsOfGoodsSold: costsOfGoodsSold,
      miscCost: miscCost,
      totalCostOfGoodsSold: rounded,
    };
  }
  async CalculateAllDetails(
    length: number,
    width: number,
    height: number,
    weight: number,
    unit: string,
    price: number,
    category: string,
    addon?: string[],
    shippingToAmazon?: number,
    monthStart?: string,
    monthEnd?: string,
    averageInventoryStored?: number,
    monthlyUnitsSold?: number,
    costsOfGoodsSold?: number,

    miscCost?: number,
    estimatedSales: number=1
  ) {
   const amazonFee= await this.CalculateAmazonFee(category,price);
    const fulfillmentFee = await this.CalculateFulfillmentFee(
      length,
      width,
      height,
      weight,
      unit,
      category,
      addon,
      shippingToAmazon,
    );
    const storageFee = await this.CalculateStorageFee(
      length,
      width,
      height,
      weight,
      unit,
      monthStart,
      monthEnd,
      averageInventoryStored,
      monthlyUnitsSold,
    );
    const otherCost = await this.CalculateOtherCosts(
      costsOfGoodsSold,
      miscCost,
    );
    const costPerUnit= Math.round((amazonFee.total+fulfillmentFee.totalFulfillmentFee+storageFee.storageCostPerUnitSold+otherCost.totalCostOfGoodsSold)*100)/100;
    const profit=Math.round(((price-costPerUnit)*estimatedSales)*100)/100;
    const netMargin=Math.round((profit/(price*estimatedSales))*10000)/100;
    return {
      amazonFee:amazonFee,
      fulfillmentFee: fulfillmentFee,
      storageFee: storageFee,
      otherCost: otherCost,
      costPerUnit:costPerUnit,
      profit:profit,
      netMargin:netMargin
    };
  }
}

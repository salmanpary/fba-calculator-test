import {
  IsNumber,
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class FbaCalculationDTO {
  @IsNotEmpty()
  @IsNumber()
  length: number;
  @IsNotEmpty()
  @IsNumber()
  width: number;
  @IsNotEmpty()
  @IsNumber()
  height: number;
  @IsNotEmpty()
  @IsNumber()
  weight: number;
  @IsNotEmpty()
  @IsString()
  @IsIn(['in', 'cm'])
  unit: string;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @IsNotEmpty()
  @IsString()
  @IsIn([
    'Amazon Device Accessories',
    'Amazon Explore',
    'Automotive and Powersports',
    'Baby Products',
    'Backpacks, Handbags, and Luggage',
    'Base Equipment Power Tools',
    'Beauty, Health and Personal Care',
    'Business, Industrial, and Scientific Supplies',
    'Clothing and Accessories',
    'Collectible Coins',
    'Compact Appliances',
    'Computers',
    'Consumer Electronics',
    'Electronics Accessories',
    'Entertainment Collectibles',
    'Everything Else',
    'Eyewear',
    'Fine Art',
    'Footwear',
    'Furniture',
    'Gift Cards',
    'Grocery and Gourmet',
    'Home and Kitchen',
    'Home and Kitchen',
    'Jewelry',
    'Lawn and Garden',
    'Lawn Mowers and Snow Throwers',
    'Mattresses',
    'Media - Books, DVD, Music, Software, Video',
    'Musical Instruments and AV Production',
    'Office Products',
    'Pet Products',
    'Sports and Outdoors',
    'Sports Collectibles',
    'Tires',
    'Tools and Home Improvement',
    'Toys and Games',
    'Video Game Consoles',
    'Video Games and Gaming Accessories',
    'Watches',
  ])
  category: string;
  @IsString({ each: true })
  @IsOptional()
  addOn?: string[];
  @IsNumber()
  @IsOptional()
  shippingToAmazon?: number;
  @IsString()
  @IsOptional()
  @IsIn(['jan', 'oct'])
  monthStart?: string;
  @IsString()
  @IsOptional()
  @IsIn(['sep', 'dec'])
  monthEnd?: string;
  @IsNumber()
  @IsOptional()
  @IsInt()
  averageInventoryStored?: number;
  @IsNumber()
  @IsOptional()
  @IsInt()
  monthlyUnitsSold?: number;
  @IsNumber()
  @IsOptional()
  costsOfGoodsSold?: number;
  @IsNumber()
  @IsOptional()
  miscCost?: number;
  @IsNumber()
  @IsOptional()
  @IsInt()
  estimatedSales?: number;
}

export class referralDto{
    category: string;
    feepercent: number;
    minfee:number|null;
    fees1?:[
        {
            minprice: number;
            maxprice: number|boolean;
            feepercent: number;
        }
    ];
    fees2?:[
        {
            minprice: number;
            maxprice: number|boolean;
            feepercent: number;
        }
    ]

}
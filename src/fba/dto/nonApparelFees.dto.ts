
export class nonApparelFeesDTO {
 sizetier: string;
 minweight:number;
    maxweight:number;
    fee:number|{
        min:number;
        extra:number;
        per:number;
        above:number;
    };
}
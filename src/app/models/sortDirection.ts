/**
 * Created by larjo on 22/7/2016.
 */
export enum SortDirectionEnum {
 asc,
  desc


}

export class SortDirection {
  public static toString(direction: SortDirection): string {

    switch (direction){
      case SortDirection.asc:
        return "Ascending";
      case SortDirection.desc:
        return "Descending";
    }
  }


  public static parse(directionName:string): SortDirection{

    switch (directionName){
      case "Ascending":
      case "asc":
        return SortDirection.asc;
      case "Descending":
      case "desc":
        return SortDirection.desc;
    }
  }

  constructor(sortDirectionEnum: SortDirectionEnum){
    this.direction = sortDirectionEnum;
  }

  private direction: SortDirectionEnum;

  public static asc: SortDirection = new SortDirection(SortDirectionEnum.asc);
  public static desc: SortDirection = new SortDirection(SortDirectionEnum.desc);



  public get label():string{
    return SortDirection.toString(this);
  }

  public get key():string{
    return SortDirectionEnum[this.direction];
  }


  public static get directions(): Map<string, SortDirection>{

    let directions: Map<string, SortDirection> = new  Map<string, SortDirection>();

    directions.set(SortDirection.asc.key, SortDirection.asc);
    directions.set(SortDirection.desc.key, SortDirection.desc);

    return directions;
  }

}


export interface Serializable<T> {
  deserialize(input: any): T;
  serialize(input: T): any;
}/**
 * Created by larjo on 21/7/2016.
 */

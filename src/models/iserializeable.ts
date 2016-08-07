interface Serializable<T> {
  deserialize(input: Object): T;
  serialize(input: T): Object;
}/**
 * Created by larjo on 21/7/2016.
 */

import {Nullable} from "../../framework/extras/typeUtils";
import {IRepositoryService} from "../../framework/api";

export interface IConverter<FromType, ToType> {
   convert(fromData: FromType, reject?: any, options?: any): ToType;

   setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}

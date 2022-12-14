import {Nullable} from "../framework.core/extras/utils/typeUtils";
import {IRepositoryService} from "./index";

export interface IConverter<FromType, ToType> {
   convert(fromData: FromType, reject?: any, options?: any): ToType;

   setRepositoryService(repoService: Nullable<IRepositoryService>): void;
}

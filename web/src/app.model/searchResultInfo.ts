import {DocumentInfo} from "./documentInfo";
import {PocketMapper} from "./pockets/mappers/pocketMapper";
import {ReportInfo} from "./pockets/reportInfo";

export type SearchResultInfo = DocumentInfo | PocketMapper | ReportInfo;

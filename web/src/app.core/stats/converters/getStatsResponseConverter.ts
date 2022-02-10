import {getValueOrDefault} from "../../../framework/extras/typeUtils";
import {StatInfo} from "../../../app.model";
import {forEachKVP} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";
import {StatType} from "../../../app.model";
import {Converter} from "../../common/converters/converter";

export class GetStatsResponseConverter extends Converter<any, any>{
    convert(fromData: any, reject: any): StatInfo[] {
        const result: StatInfo[] = [];

        // fromData = [mockData];

        if (Array.isArray(fromData)) {
            forEachKVP(fromData, (itemKey:string, itemValue: string[]) => {
                let statInfo: StatInfo = new StatInfo(makeGuid());

                let statType = -1;

                const value = getValueOrDefault(itemValue, 'class', '').toLowerCase();

                switch (value) {
                    case 'custom_shared_tag':
                        statType = StatType.CUSTOM_SHARED_TAG;
                        break;
                    case 'datastore_size':
                        statType = StatType.DATASTORE_SIZE;
                        break;
                    case 'department':
                        statType = StatType.DEPARTMENT;
                        break;
                    case 'file_type':
                        statType = StatType.FILE_TYPE;
                        break;
                    case 'project':
                        statType = StatType.PROJECT;
                        break;
                    case 'purpose':
                        statType = StatType.PURPOSE;
                        break;
                    case 'upload_date':
                        statType = StatType.UPLOAD_DATE;
                        break;
                    default:
                        console.log(`Stat type with title '${value}' not found`);
                        break;
                }

                statInfo.type = statType;
                statInfo.count = getValueOrDefault(itemValue, 'count', '');
                statInfo.item = getValueOrDefault(itemValue, 'item', '');

                result.push(statInfo);
            });
        }
        else {
            reject('Error while parsing array of stats. Expected Array. Received the following: <' + fromData + '>');
        }

        return result;
    }
}

const mockData = [{"class": "custom_shared_tag", "item": "Abstract", "count": 1}, {"class": "custom_shared_tag", "item": "Africa", "count": 1}, {"class": "custom_shared_tag", "item": "Air filters", "count": 1}, {"class": "custom_shared_tag", "item": "Animal disease", "count": 1}, {"class": "custom_shared_tag", "item": "Animal study", "count": 1}, {"class": "custom_shared_tag", "item": "barber shop", "count": 1}, {"class": "custom_shared_tag", "item": "Blood Lead", "count": 4}, {"class": "custom_shared_tag", "item": "blood pressure", "count": 2}, {"class": "custom_shared_tag", "item": "Budget2021", "count": 1}, {"class": "custom_shared_tag", "item": "Budget2022", "count": 1}, {"class": "custom_shared_tag", "item": "California", "count": 1}, {"class": "custom_shared_tag", "item": "Cancer", "count": 3}, {"class": "custom_shared_tag", "item": "Child development", "count": 1}, {"class": "custom_shared_tag", "item": "Children", "count": 5}, {"class": "custom_shared_tag", "item": "Clean energy", "count": 1}, {"class": "custom_shared_tag", "item": "Community health", "count": 2}, {"class": "custom_shared_tag", "item": "Conference", "count": 2}, {"class": "custom_shared_tag", "item": "Coolio", "count": 1}, {"class": "custom_shared_tag", "item": "Coordination", "count": 1}, {"class": "custom_shared_tag", "item": "Covid", "count": 3}, {"class": "custom_shared_tag", "item": "CUSUM", "count": 1}, {"class": "custom_shared_tag", "item": "Decision-making", "count": 2}, {"class": "custom_shared_tag", "item": "Diamonds", "count": 1}, {"class": "custom_shared_tag", "item": "DNA labeling", "count": 1}, {"class": "custom_shared_tag", "item": "DNA replication", "count": 1}, {"class": "custom_shared_tag", "item": "Domestication", "count": 1}, {"class": "custom_shared_tag", "item": "Equations", "count": 1}, {"class": "custom_shared_tag", "item": "Experiments", "count": 1}, {"class": "custom_shared_tag", "item": "Figures", "count": 2}, {"class": "custom_shared_tag", "item": "Fluorescence", "count": 3}, {"class": "custom_shared_tag", "item": "Food additives", "count": 4}, {"class": "custom_shared_tag", "item": "Gene expression", "count": 4}, {"class": "custom_shared_tag", "item": "Gene Expression", "count": 1}, {"class": "custom_shared_tag", "item": "Heart conditions", "count": 1}, {"class": "custom_shared_tag", "item": "Hospitalization rate", "count": 1}, {"class": "custom_shared_tag", "item": "hypertension", "count": 2}, {"class": "custom_shared_tag", "item": "Imaging", "count": 1}, {"class": "custom_shared_tag", "item": "Immunity", "count": 1}, {"class": "custom_shared_tag", "item": "Legend", "count": 2}, {"class": "custom_shared_tag", "item": "Long-term care", "count": 2}, {"class": "custom_shared_tag", "item": "Men Health", "count": 1}, {"class": "custom_shared_tag", "item": "Methods", "count": 2}, {"class": "custom_shared_tag", "item": "Mortality", "count": 1}, {"class": "custom_shared_tag", "item": "Mortality factors", "count": 1}, {"class": "custom_shared_tag", "item": "New England Journal of Medicine", "count": 1}, {"class": "custom_shared_tag", "item": "NGS", "count": 1}, {"class": "custom_shared_tag", "item": "Nonprofit", "count": 1}, {"class": "custom_shared_tag", "item": "North Carolina", "count": 1}, {"class": "custom_shared_tag", "item": "Oceans", "count": 1}, {"class": "custom_shared_tag", "item": "Oklahoma", "count": 1}, {"class": "custom_shared_tag", "item": "Orange extract", "count": 1}, {"class": "custom_shared_tag", "item": "PCR", "count": 1}, {"class": "custom_shared_tag", "item": "Peas", "count": 1}, {"class": "custom_shared_tag", "item": "Pregnancy", "count": 2}, {"class": "custom_shared_tag", "item": "Properties", "count": 1}, {"class": "custom_shared_tag", "item": "Public school", "count": 2}, {"class": "custom_shared_tag", "item": "Public schools", "count": 1}, {"class": "custom_shared_tag", "item": "Rebuttal", "count": 1}, {"class": "custom_shared_tag", "item": "References", "count": 1}, {"class": "custom_shared_tag", "item": "reference value", "count": 1}, {"class": "custom_shared_tag", "item": "Remote doctors", "count": 1}, {"class": "custom_shared_tag", "item": "Reviewers", "count": 1}, {"class": "custom_shared_tag", "item": "Screening", "count": 1}, {"class": "custom_shared_tag", "item": "Shewhart", "count": 1}, {"class": "custom_shared_tag", "item": "Smoking", "count": 3}, {"class": "custom_shared_tag", "item": "South Carolina", "count": 1}, {"class": "custom_shared_tag", "item": "Statistics", "count": 1}, {"class": "custom_shared_tag", "item": "TB", "count": 1}, {"class": "custom_shared_tag", "item": "Templates", "count": 6}, {"class": "custom_shared_tag", "item": "Test Tag", "count": 1}, {"class": "custom_shared_tag", "item": "Throat disease", "count": 1}, {"class": "custom_shared_tag", "item": "Title page", "count": 1}, {"class": "custom_shared_tag", "item": "tmpTag", "count": 1}, {"class": "custom_shared_tag", "item": "Transcription", "count": 2}, {"class": "custom_shared_tag", "item": "Trends", "count": 4}, {"class": "custom_shared_tag", "item": "Vaccination", "count": 6}, {"class": "custom_shared_tag", "item": "Variants", "count": 3}, {"class": "custom_shared_tag", "item": "Viral disease", "count": 1}, {"class": "custom_shared_tag", "item": "Virus particles", "count": 1}, {"class": "custom_shared_tag", "item": "Yeast studies", "count": 1}, {"class": "datastore_size", "item": "MB", "count": 90}, {"class": "department", "item": "1003", "count": 5}, {"class": "department", "item": "1004", "count": 18}, {"class": "department", "item": "1005", "count": 7}, {"class": "department", "item": "1006", "count": 14}, {"class": "department", "item": "1007", "count": 2}, {"class": "department", "item": "1008", "count": 9}, {"class": "department", "item": "1009", "count": 5}, {"class": "department", "item": "1010", "count": 4}, {"class": "file_type", "item": "application/pdf", "count": 39}, {"class": "file_type", "item": "application/vnd.ms-excel", "count": 1}, {"class": "file_type", "item": "application/vnd.openxmlformats-officedocument.presentationml.presentation", "count": 8}, {"class": "file_type", "item": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "count": 3}, {"class": "file_type", "item": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "count": 13}, {"class": "file_type", "item": "image/jpeg", "count": 7}, {"class": "project", "item": "Aerosols", "count": 1}, {"class": "project", "item": "Autism", "count": 1}, {"class": "project", "item": "Bronchitis", "count": 1}, {"class": "project", "item": "Cancer Studies", "count": 1}, {"class": "project", "item": "Cancer Study", "count": 2}, {"class": "project", "item": "CDC", "count": 5}, {"class": "project", "item": "Cell Culture", "count": 1}, {"class": "project", "item": "Cells", "count": 1}, {"class": "project", "item": "Community Health", "count": 1}, {"class": "project", "item": "Covid", "count": 3}, {"class": "project", "item": "Covid Outbreaks", "count": 3}, {"class": "project", "item": "Covid Vaccination", "count": 2}, {"class": "project", "item": "Covid Vaccine", "count": 2}, {"class": "project", "item": "Dissertation", "count": 1}, {"class": "project", "item": "Division for Heart Disease and Stroke Prevention", "count": 1}, {"class": "project", "item": "Education", "count": 2}, {"class": "project", "item": "Energy Systems", "count": 1}, {"class": "project", "item": "Fetal Death", "count": 1}, {"class": "project", "item": "Gene Regulation", "count": 1}, {"class": "project", "item": "Genes", "count": 1}, {"class": "project", "item": "GRAS", "count": 4}, {"class": "project", "item": "Healthcare", "count": 1}, {"class": "project", "item": "Health Policy", "count": 1}, {"class": "project", "item": "Hepatitis Virus", "count": 1}, {"class": "project", "item": "HPV Vaccines", "count": 1}, {"class": "project", "item": "Infant Mortality", "count": 1}, {"class": "project", "item": "Lambda", "count": 7}, {"class": "project", "item": "Life Expectancy", "count": 1}, {"class": "project", "item": "Manuscript", "count": 1}, {"class": "project", "item": "Manuscripts", "count": 1}, {"class": "project", "item": "Phage", "count": 1}, {"class": "project", "item": "Planning", "count": 1}, {"class": "project", "item": "Prenatal Care", "count": 1}, {"class": "project", "item": "Presentations", "count": 2}, {"class": "project", "item": "Sequencing", "count": 3}, {"class": "project", "item": "Structural", "count": 1}, {"class": "project", "item": "Supplementary Data", "count": 1}, {"class": "project", "item": "Vaccinations", "count": 1}, {"class": "project", "item": "Water Safety", "count": 1}, {"class": "project", "item": "Yeast", "count": 1}, {"class": "purpose", "item": "1011", "count": 19}, {"class": "purpose", "item": "1012", "count": 14}, {"class": "purpose", "item": "1013", "count": 2}, {"class": "purpose", "item": "1014", "count": 17}, {"class": "purpose", "item": "1015", "count": 3}, {"class": "purpose", "item": "1016", "count": 9}]

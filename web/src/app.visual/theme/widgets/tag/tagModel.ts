import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";
import {SuggestionItemVM} from "../autoComplete/autoCompleteModel";

export type TagProps = {
    className?: string;
    name: string;
    text: string;
    onDelete?: (name: string, text: string) => void;
    onSubmit?: (name: string, text: string, tmpValue: string) => void;
    isEdit?: boolean;
    isGlobal?: boolean;
    readonly?: boolean;
    suggestionSupplier?: (text: string) => Promise<Nullable<TagItemVM[]>>
}

export type TagState = {
    selected: boolean;
    tmpText: string;
}

export type TagItemVM = SuggestionItemVM;

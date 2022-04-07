import {TextEditProps} from "../textEdit/textEditModel";
import {Nullable} from "../../../../framework.core/extras/utils/typeUtils";

export type AutoCompleteProps = TextEditProps & {
    suggestionSupplier?: (text: string) => Promise<Nullable<SuggestionItemVM[]>>;
    isSearch?: boolean;
}

export type AutoCompleteState = {
    showSuggestions: boolean;
    loadingSuggestions: boolean;
    suggestions: SuggestionItemVM[];
    value: string;
}

export interface SuggestionItemVM {
    id: string;
    title: string;
}

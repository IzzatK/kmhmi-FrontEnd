import {ElementType} from "react";

export type ViewSupplier<ViewModel> = {
    viewSupplier: () => ElementType<ViewModel>;
}
import {EntityProvider} from "../../../app.core";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";

type OmitParamsType = 'className';

export class MockProvider<EntityType> extends EntityProvider<EntityType> {
    baseUrl: string = `mock-only`;
    // public static class: string = `MockProvider-${makeGuid()}`;

    items: Record<string, EntityType> = {};
    ctr: {new(className: string): EntityType}

    constructor(ctr: new(id:string) => EntityType) {

        super();
        this.ctr = ctr;

        MockProvider.class = `MockProvider-${ctr.name}`;

        super.appendClassName(MockProvider.class);
    }

    create(uiRequestData: Omit<Partial<EntityType>, OmitParamsType>, onUpdated?: (item: EntityType) => void): Promise<Nullable<EntityType>> {
        return new Promise((resolve, reject) => {
            let result = this.generateItem(uiRequestData);

            resolve(result);
        });
    }


    getSingle(id: string): Promise<Nullable<EntityType>> {
        const me = this;
        return new Promise<Nullable<EntityType>>((resolve, reject) => {
            let result = null;

            const tmp = me.items[id];

            if (tmp != null) {
                result = tmp;
            }

            resolve(result);
        });
    }

    getAll(uiRequestData?: any): Promise<EntityType[]> {
        const me = this;
        return new Promise<EntityType[]>((resolve, reject) => {
            resolve(Object.values(me.items));
        });
    }

    update(id: string, uiRequestData: Omit<Partial<EntityType>, OmitParamsType>): Promise<Nullable<EntityType>> {
        const me = this;
        return new Promise<Nullable<EntityType>>((resolve, reject) => {
            const tmp = me.items[id];

            if (tmp != null) {
                const resultRecord: Record<string, any> = tmp;
                const updateRecord: Record<string, any> = uiRequestData;

                forEachKVP(updateRecord, (key:string, newValue: any) => {
                    resultRecord[key] = newValue;
                })

                resolve(tmp);
            }
            else {
                reject(null);
            }
        });
    }

    remove(id: string): Promise<Nullable<EntityType>> {
        const me = this;
        return new Promise<Nullable<EntityType>>((resolve, reject) => {
            const tmp = me.items[id];

            if (tmp != null) {
                resolve(tmp);
                delete me.items[id];
            }
            else {
                reject(null);
            }
        });
    }

    private generateItem(data: Omit<Partial<EntityType>, OmitParamsType>): EntityType {
        let tmpId = makeGuid();

        while(this.items[tmpId] != null) {
            tmpId = makeGuid();
        }

        const result = new this.ctr(tmpId);

        const resultRecord: Record<string, any> = result;
        const updateRecord: Record<string, any> = data;

        forEachKVP(updateRecord, (key:string, newValue: any) => {
            resultRecord[key] = newValue;
        })

        return result;
    }
}





import {EntityProvider} from "../../../app.core";
import {PocketInfo, PocketMapper, ResourceInfo, ResourceMapper} from "../../../app.model";
import {Nullable} from "../../../framework.core/extras/typeUtils";
import {forEach} from "../../../framework.visual/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.visual/extras/utils/uniqueIdUtils";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockPocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'MockPocketProvider';

    pocketMappers: Record<string, PocketMapper> = {};

    constructor() {
        super();
        super.appendClassName(MockPocketProvider.class);
    }

    start() {
        super.start();
    }

    getAll(uiRequestData?: any): Promise<PocketMapper[]> {
        const me = this;
        return new Promise((resolve, reject) => {
            resolve(Object.values(me.pocketMappers));
        });
    }

    getSingle(id: string): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            resolve(me.pocketMappers[id] || null);
        });
    }

    remove(id: string): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            let result: Nullable<PocketMapper> = null;

            forEach(me.pocketMappers, (pocketMapper: PocketMapper) => {
                if (pocketMapper.id == id) {
                    result = pocketMapper;
                    return true;
                }
            });

            resolve(result);
        });
    }

    create(uiRequestData: string, onUpdated?: (item: PocketMapper) => void): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            let pocketMapper = me.generatePocketMapper(uiRequestData);

            resolve(pocketMapper);
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            let pocketMapper = me.pocketMappers[id];

            if (pocketMapper != null) {
                return me.update(id, uiRequestData);
            }
        });
    }

    generatePocketMapper(title: string): PocketMapper {

        const pocketId = makeGuid();

        const pocket: PocketInfo = new PocketInfo(pocketId);
        pocket.title = `Pocket ${title} - ${pocketId}`;

        const resource: ResourceInfo = new ResourceInfo(makeGuid());
        resource.title = `resource ${resource.id}`;

        pocket.resource_ids.push(resource.id);

        const pocketMapper = new PocketMapper(
            pocket,
            {
                [resource.id]: new ResourceMapper(
                    resource,
                    {}
                )
            }
        )

        this.pocketMappers[pocketId] = pocketMapper;

        return pocketMapper;
    }
}





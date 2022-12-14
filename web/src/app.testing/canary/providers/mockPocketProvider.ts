import {EntityProvider} from "../../../app.core";
import {
    ExcerptInfo,
    ExcerptMapper,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ResourceInfo,
    ResourceMapper
} from "../../../app.model";
import {deepCopy, Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {forEach, forEachKVP} from "../../../framework.core/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";
import {PocketParamType} from "../../../app.core.api";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class MockPocketProvider extends EntityProvider<PocketMapper> {
    baseUrl: string = `${serverUrl}/pockets`;
    public static class: string = 'MockPocketProvider';

    pocketMappers: Record<string, PocketMapper> = {};
    index = 0;

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

    create(uiRequestData: PocketParamType, onUpdated?: (item: PocketMapper) => void): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            let pocketMapper = me.generatePocketMapper(uiRequestData);

            me.pocketMappers[pocketMapper.id] = pocketMapper;

            resolve(pocketMapper);
        });
    }

    update(id: string, partialParams: PocketParamType): Promise<Nullable<PocketMapper>> {
        const me = this;
        return new Promise((resolve, reject) => {
            const tmpPocketMapper: PocketMapper = deepCopy(me.pocketMappers[id]);

            if (partialParams.id) {
                delete partialParams.id;
            }

            const resultRecord: Record<string, any> = tmpPocketMapper.pocket;
            const updateRecord: Record<string, any> = partialParams;

            forEachKVP(updateRecord, (key:string, newValue: any) => {
                resultRecord[key] = newValue;
            })

            me.pocketMappers[id] = tmpPocketMapper;

            resolve(tmpPocketMapper);
        });
    }

    generatePocketMapper(params: PocketParamType): PocketMapper {

        const pocketId = `${this.index++}`;

        const pocket: PocketInfo = new PocketInfo(pocketId);
        pocket.title = `Pocket ${params.title} - ${pocketId}`;

        const pocketMapper = new PocketMapper(pocket);

        // for (let resourceIndex = 0; resourceIndex < 5; resourceIndex++) {
        //
        //     const resource = new ResourceInfo(makeGuid());
        //     resource.title = `Resource Example - ${resourceIndex}`;
        //     resource.source_id = makeGuid();
        //     resource.source_publication_date = `${new Date()}`;
        //     resource.source_title = `source ${resource.source_id}`;
        //     const resourceMapper = new ResourceMapper(resource);
        //
        //     for (let excerptIndex = 0; excerptIndex < 5; excerptIndex++) {
        //         const excerpt = new ExcerptInfo(makeGuid());
        //         excerpt.text = `Excerpt - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
        //         const excerptMapper = new ExcerptMapper(excerpt);
        //
        //         for (let noteIndex = 0; noteIndex < 5; noteIndex++) {
        //             const note = new NoteInfo(makeGuid());
        //             note.text = `Note - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. `;
        //
        //             excerpt.noteIds.push(note.id);
        //             excerptMapper.notes[note.id] = note;
        //         }
        //
        //         resource.excerptIds.push(excerpt.id);
        //         resourceMapper.excerptMappers[excerpt.id] = excerptMapper;
        //     }
        //
        //     pocket.resource_ids.push(resource.id);
        //     pocketMapper.resourceMappers[resource.id] = resourceMapper;
        // }

        return pocketMapper;


        // // const pocketMapper = new PocketMapper(
        // //     pocket,
        // //     {
        // //         [resource.id]: new ResourceMapper(
        // //             resource,
        // //             {
        // //                 [excerpt.id]: new ExcerptMapper(
        // //                     excerpt,
        // //                     {
        // //                         [note.id]: note
        // //                     }
        // //                 )
        // //             }
        // //         )
        // //     }
        // // )
        //
        // this.pocketMappers[pocketId] = pocketMapper;
        //
        // return pocketMapper;
    }
}





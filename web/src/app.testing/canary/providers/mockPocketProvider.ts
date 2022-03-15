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
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../framework.core/extras/utils/collectionUtils";
import {makeGuid} from "../../../framework.core/extras/utils/uniqueIdUtils";

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

        // const resource: ResourceInfo = new ResourceInfo(makeGuid());
        // resource.title = `resource ${resource.id}`;
        //
        // const excerpt: ExcerptInfo = new ExcerptInfo(makeGuid());
        // excerpt.text = 'some really lengthy excerpt text goes here';
        //
        // const note: NoteInfo = new NoteInfo(makeGuid());
        // note.text = 'some note text can go here';
        //
        // pocket.resource_ids.push(resource.id);
        // resource.excerptIds.push(excerpt.id);
        // excerpt.noteIds.push(note.id);

        const pocketMapper = new PocketMapper(pocket);

        for (let resourceIndex = 0; resourceIndex < 5; resourceIndex++) {

            const resource = new ResourceInfo(makeGuid());
            resource.title = `resource ${resource.id}`;
            const resourceMapper = new ResourceMapper(resource);

            for (let excerptIndex = 0; excerptIndex < 5; excerptIndex++) {
                const excerpt = new ExcerptInfo(makeGuid());
                excerpt.text = `Excerpt - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
                const excerptMapper = new ExcerptMapper(excerpt);

                for (let noteIndex = 0; noteIndex < 5; noteIndex++) {
                    const note = new NoteInfo(makeGuid());
                    note.text = `Note - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. `;

                    excerpt.noteIds.push(note.id);
                    excerptMapper.notes[note.id] = note;
                }

                resource.excerptIds.push(excerpt.id);
                resourceMapper.excerptMappers[excerpt.id] = excerptMapper;
            }

            pocket.resource_ids.push(resource.id);
            pocketMapper.resourceMappers[resource.id] = resourceMapper;
        }

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





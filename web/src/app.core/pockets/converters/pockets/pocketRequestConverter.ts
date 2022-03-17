import {Converter} from "../../../common/converters/converter";
import {
    ExcerptInfo,
    ExcerptMapper,
    NoteInfo,
    PocketInfo,
    PocketMapper,
    ResourceInfo,
    ResourceMapper
} from "../../../../app.model";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

export class PocketRequestConverter extends Converter<PocketMapper, any> {

    convert(fromData: PocketMapper): any {
        const pocketMapper = fromData;

        const PocketProperties: Partial<Record<keyof PocketInfo, any>> = {
            id: "pocket_id",
            title: "title",
            author_id: "author_id",
        }

        const ResourceProperties: Partial<Record<keyof ResourceInfo, string>> = {
            id: "resource_id",
            title: "title",
            author_id: "author_id",
            excerptIds: "excerpt_ids",
        }

        const ExcerptProperties: Partial<Record<keyof ExcerptInfo, string>> = {
            id: "excerpt_id",
            text: "plain_text",
            content: "rte_text",
            authorId: "author_id",
            location: "location",
            noteIds: "note_ids",
        }

        const NoteProperties: Partial<Record<keyof NoteInfo, string>> = {
            id: "note_id",
            text: "plain_text",
            content: "rte_text",
            author_id: "author_id",
        }

        let serverPocket: Record<string, any> = {};

        let serverResources: any[] = [];
        let serverSources: any[] = [];
        let serverExcerpts: any[] = [];
        let serverNotes: any[] = [];

        forEachKVP(pocketMapper.pocket, (itemKey: keyof PocketInfo, itemValue: any) => {
            let serverNoteKey = PocketProperties[itemKey]?.toString();

            if (serverNoteKey) {
                let itemValueString = JSON.stringify(itemValue);

                if (itemValueString !== "" && itemValueString !== "[]" && itemValueString !== "{}") {
                    serverPocket[serverNoteKey] = itemValue;
                }
            }
        });

        forEachKVP(pocketMapper.resourceMappers, (itemKey: string, resourceMapper: ResourceMapper) => {

            let serverResource: Record<string, string> = {};

            forEachKVP(resourceMapper.resource, (itemKey: keyof ResourceInfo, itemValue: any) => {
                let serverNoteKey = ResourceProperties[itemKey]?.toString();

                if (serverNoteKey) {
                    let itemValueString = JSON.stringify(itemValue);

                    if (itemValueString !== "" && itemValueString !== "[]" && itemValueString !== "{}") {
                        serverResource[serverNoteKey] = itemValue;
                    }
                }
            });

            serverResources.push(serverResource);

            forEachKVP(resourceMapper.excerptMappers, (itemKey: string, excerptMapper: ExcerptMapper) => {

                let serverExcerpt: Record<string, string> = {};

                forEachKVP(excerptMapper.excerpt, (itemKey: keyof ExcerptInfo, itemValue: any) => {
                    let serverNoteKey = ExcerptProperties[itemKey]?.toString();

                    if (serverNoteKey) {
                        let itemValueString = JSON.stringify(itemValue);

                        if (itemValueString !== "" && itemValueString !== "[]" && itemValueString !== "{}") {
                            serverExcerpt[serverNoteKey] = itemValue;
                        }
                    }
                });

                serverExcerpts.push(serverExcerpt);

                forEachKVP(excerptMapper.notes, (itemKey: string, note: NoteInfo) => {

                    let serverNote: Record<string, string> = {};

                    forEachKVP(note, (itemKey: keyof NoteInfo, itemValue: any) => {
                        let serverNoteKey = NoteProperties[itemKey]?.toString();

                        if (serverNoteKey) {
                            let itemValueString = JSON.stringify(itemValue);

                            if (itemValueString !== "" && itemValueString !== "[]" && itemValueString !== "{}") {
                                serverNote[serverNoteKey] = itemValue;
                            }
                        }
                    });

                    serverNotes.push(serverNote);

                });

            });

        });

        if (JSON.stringify(serverResources) !== "[]") {
            serverPocket["resources"] = serverResources;
        }

        if (JSON.stringify(serverSources) !== "[]") {
            serverPocket["sources"] = serverSources;
        }

        if (JSON.stringify(serverExcerpts) !== "[]") {
            serverPocket["excerpts"] = serverExcerpts;
        }


        if (JSON.stringify(serverNotes) !== "[]") {
            serverPocket["notes"] = serverNotes;
        }

        return serverPocket;
    }
}

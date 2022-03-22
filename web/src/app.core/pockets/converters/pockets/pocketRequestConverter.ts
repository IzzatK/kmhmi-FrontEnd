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
            note_ids: "note_ids",
        }

        const ResourceProperties: Partial<Record<keyof ResourceInfo, string>> = {
            id: "resource_id",
            title: "title",
            author_id: "author_id",
            excerptIds: "excerpt_ids",
            note_ids: "note_ids",
        }

        const SourceProperties: Partial<Record<keyof ResourceInfo, string>> = {
            source_id: "source_id",
            source_author: "author",
            source_publication_date: "publication_date",
            source_title: "title",
            source_type: "type",
            source_version: "version",
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
            let serverPocketKey = PocketProperties[itemKey]?.toString();

            if (serverPocketKey) {
                if (itemValue !== "") {
                    serverPocket[serverPocketKey] = itemValue;
                }
            }
        });

        forEachKVP(pocketMapper.resourceMappers, (itemKey: string, resourceMapper: ResourceMapper) => {

            let serverResource: Record<string, string> = {};
            let serverSource: Record<string, string> = {};

            forEachKVP(resourceMapper.resource, (itemKey: keyof ResourceInfo, itemValue: any) => {
                let serverResourceKey = ResourceProperties[itemKey]?.toString();
                let serverSourceKey = SourceProperties[itemKey]?.toString();

                if (serverResourceKey) {
                    if (itemValue !== "") {
                        serverResource[serverResourceKey] = itemValue;
                    }
                } else if (serverSourceKey) {
                    if (itemValue !== "") {
                        serverSource[serverSourceKey] = itemValue;
                    }
                }
            });

            serverResources.push(serverResource);
            serverSources.push(serverSource);

            forEachKVP(resourceMapper.excerptMappers, (itemKey: string, excerptMapper: ExcerptMapper) => {

                let serverExcerpt: Record<string, string> = {};

                forEachKVP(excerptMapper.excerpt, (itemKey: keyof ExcerptInfo, itemValue: any) => {
                    let serverExcerptKey = ExcerptProperties[itemKey]?.toString();

                    if (serverExcerptKey) {
                        if (itemValue !== "") {
                            serverExcerpt[serverExcerptKey] = itemValue;
                        }
                    }
                });

                serverExcerpts.push(serverExcerpt);

                forEachKVP(excerptMapper.notes, (itemKey: string, note: NoteInfo) => {

                    let serverNote: Record<string, string> = {};

                    forEachKVP(note, (itemKey: keyof NoteInfo, itemValue: any) => {
                        let serverNoteKey = NoteProperties[itemKey]?.toString();

                        if (serverNoteKey) {
                            if (itemValue !== "") {
                                serverNote[serverNoteKey] = itemValue;
                            }
                        }
                    });

                    serverNotes.push(serverNote);
                });
            });
        });

        if (serverResources.length > 0) {
            serverPocket["resources"] = serverResources;
        }

        if (serverSources.length > 0) {
            serverPocket["sources"] = serverSources;
        }

        if (serverExcerpts.length > 0) {
            serverPocket["excerpts"] = serverExcerpts;
        }

        if (serverNotes.length > 0) {
            serverPocket["notes"] = serverNotes;
        }

        return serverPocket;
    }
}

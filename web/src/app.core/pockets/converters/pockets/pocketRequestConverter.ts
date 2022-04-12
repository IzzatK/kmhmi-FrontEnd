import {Converter} from "../../../common/converters/converter";
import {
    ExcerptInfo,
    NoteInfo,
    PocketInfo,
    ResourceInfo,
} from "../../../../app.model";
import {forEachKVP} from "../../../../framework.core/extras/utils/collectionUtils";

export class PocketRequestConverter extends Converter<any, any> {

    convert(fromData: any): any {
        const pocketMapper = fromData;

        const PocketProperties: Partial<Record<keyof PocketInfo, any>> = {
            id: "pocket_id",
            title: "title",
            author_id: "author_id",
            note_ids: "note_ids",
            report_ids: "report_ids",
        }

        const ResourceProperties: Partial<Record<keyof ResourceInfo, string>> = {
            id: "resource_id",
            title: "title",
            author_id: "author_id",
            excerptIds: "excerpt_ids",
            note_ids: "note_ids",
            source_id: "source_id",
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

        if (pocketMapper.resourceMappers) {
            forEachKVP(pocketMapper.resourceMappers, (itemKey: string, resourceMapper: any) => {
                let serverResource: Record<string, string> = {};
                let serverSource: Record<string, string> = {};

                forEachKVP(resourceMapper.resource, (itemKey: keyof ResourceInfo, itemValue: any) => {
                    let serverResourceKey = ResourceProperties[itemKey]?.toString();
                    let serverSourceKey = SourceProperties[itemKey]?.toString();

                    if (serverResourceKey) {
                        if (itemValue !== "") {
                            serverResource[serverResourceKey] = itemValue;
                        }
                    }
                    if (serverSourceKey) {
                        if (itemValue !== "") {
                            serverSource[serverSourceKey] = itemValue;
                        }
                    }
                });

                serverResources.push(serverResource);
                serverSources.push(serverSource);

                if (resourceMapper.excerptMappers) {
                    forEachKVP(resourceMapper.excerptMappers, (itemKey: string, excerptMapper: any) => {

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

                        forEachKVP(excerptMapper.notes, (itemKey: string, note: any) => {

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
                }
            });
        }

        serverPocket["resources"] = serverResources;
        serverPocket["sources"] = serverSources;
        serverPocket["excerpts"] = serverExcerpts;
        serverPocket["notes"] = serverNotes;

        return serverPocket;
    }
}

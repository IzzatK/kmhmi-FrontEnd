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
            scope: "scope",
            uploadedBy_id: "uploaded_by",
            private_tag: "custom_personal_tag",
            public_tag: "custom_shared_tag",
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
                    if (itemKey === "public_tag") {
                        let tagsArray: string[] = [];
                        forEachKVP(itemValue, (item: string) => {
                            if (item !== "") {
                                tagsArray.push(item);
                            }
                        })
                        serverPocket[serverPocketKey] = tagsArray;
                    } else if (itemKey === "private_tag") {
                        let tagsArray: any[] = [];
                        forEachKVP(itemValue, (itemKey: string, itemValue: Record<string, string>) => {
                            let tagObject: Record<string, any> = {};

                            let itemValueArray: string[] = [];
                            if (itemValue) {
                                forEachKVP(itemValue, (item: string) => {
                                    itemValueArray.push(item);
                                })
                            }

                            tagObject['tag_id'] = itemValueArray;
                            tagObject['user_id'] = itemKey;

                            tagsArray.push(tagObject);
                        })
                        serverPocket[serverPocketKey] = tagsArray;
                    } else {
                        serverPocket[serverPocketKey] = itemValue;
                    }

                }
            }
        });

        if (pocketMapper.notes) {
            forEachKVP(pocketMapper.notes, (itemKey: string, note: any) => {

                let serverNote: Record<string, string> = {};

                let requiredFields: Record<string, string> = {};
                requiredFields["rte_text"] = "";

                forEachKVP(note, (itemKey: keyof NoteInfo, itemValue: any) => {
                    let serverNoteKey = NoteProperties[itemKey]?.toString();

                    if (serverNoteKey) {
                        if (itemValue !== "") {
                            serverNote[serverNoteKey] = itemValue;
                        }
                    }
                });

                forEachKVP(requiredFields, (itemKey: string, itemValue: boolean) => {
                    if (!serverNote[itemKey]) {
                        serverNote[itemKey] = "";
                    }
                })

                serverNotes.push(serverNote);
            });
        }

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

                if (resourceMapper.notes) {
                    forEachKVP(resourceMapper.notes, (itemKey: string, note: any) => {

                        let serverNote: Record<string, string> = {};

                        let requiredFields: Record<string, string> = {};
                        requiredFields["rte_text"] = "";

                        forEachKVP(note, (itemKey: keyof NoteInfo, itemValue: any) => {
                            let serverNoteKey = NoteProperties[itemKey]?.toString();

                            if (serverNoteKey) {
                                if (itemValue !== "") {
                                    serverNote[serverNoteKey] = itemValue;
                                }
                            }
                        });

                        forEachKVP(requiredFields, (itemKey: string, itemValue: boolean) => {
                            if (!serverNote[itemKey]) {
                                serverNote[itemKey] = "";
                            }
                        })

                        serverNotes.push(serverNote);
                    });
                }

                serverResources.push(serverResource);
                serverSources.push(serverSource);

                if (resourceMapper.excerptMappers) {
                    forEachKVP(resourceMapper.excerptMappers, (itemKey: string, excerptMapper: any) => {

                        let serverExcerpt: Record<string, string> = {};

                        let requiredFields: Record<string, string> = {};
                        requiredFields["rte_text"] = "";

                        forEachKVP(excerptMapper.excerpt, (itemKey: keyof ExcerptInfo, itemValue: any) => {
                            let serverExcerptKey = ExcerptProperties[itemKey]?.toString();

                            if (serverExcerptKey) {

                                if (itemValue !== "") {
                                    serverExcerpt[serverExcerptKey] = itemValue;
                                }
                            }
                        });

                        forEachKVP(requiredFields, (itemKey: string, itemValue: boolean) => {
                            if (!serverExcerpt[itemKey]) {
                                serverExcerpt[itemKey] = "";
                            }
                        })

                        serverExcerpts.push(serverExcerpt);

                        forEachKVP(excerptMapper.notes, (itemKey: string, note: any) => {

                            let serverNote: Record<string, string> = {};

                            let requiredFields: Record<string, string> = {};
                            requiredFields["rte_text"] = "";

                            forEachKVP(note, (itemKey: keyof NoteInfo, itemValue: any) => {
                                let serverNoteKey = NoteProperties[itemKey]?.toString();

                                if (serverNoteKey) {
                                    if (itemValue !== "") {
                                        serverNote[serverNoteKey] = itemValue;
                                    }
                                }
                            });

                            forEachKVP(requiredFields, (itemKey: string, itemValue: boolean) => {
                                if (!serverNote[itemKey]) {
                                    serverNote[itemKey] = "";
                                }
                            })

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

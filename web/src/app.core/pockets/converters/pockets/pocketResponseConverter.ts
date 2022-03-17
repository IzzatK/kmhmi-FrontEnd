import {Converter} from "../../../common/converters/converter";
import {ErrorHandler} from "../../../common/providers/entityProvider";
import {
    ExcerptInfo,
    ExcerptMapper, NoteInfo,
    PocketInfo,
    PocketMapper,
    ResourceInfo,
    ResourceMapper
} from "../../../../app.model";
import {getValueOrDefault} from "../../../../framework.core/extras/utils/typeUtils";
import {forEach} from "../../../../framework.core/extras/utils/collectionUtils";

export class PocketResponseConverter extends Converter<any, PocketMapper> {
    convert(fromData: any, reject: ErrorHandler): PocketMapper {
        const item = fromData;

        const { resources, sources, excerpts, notes } = item;

        let resourceInfos: Record<string, ResourceInfo> = {};
        let resourceIds: string[] = [];

        let resourcePublicationDates: Record<string, string> = {};

        if (sources && Array.isArray(sources)) {
            forEach(sources, (source: any) => {
                const { publication_date } = source;

                if (publication_date) {
                    resourcePublicationDates[getValueOrDefault(source, 'source_id', '')] = publication_date;
                }
            })
        }

        if (resources && Array.isArray(resources)) {
            forEach(resources, (resource: any) => {
                const { source_id } = resource;
                const resourceId = getValueOrDefault(resource, 'resource_id', '');

                const resourceInfo = new ResourceInfo(resourceId);

                resourceInfo.title = getValueOrDefault(resource, 'title', '');
                resourceInfo.author_id = getValueOrDefault(resource, 'author_id', '');
                resourceInfo.excerptIds = getValueOrDefault(resource, 'excerpt_ids', '');

                if (source_id && resourcePublicationDates[source_id]) {
                    // resourceInfo.publication_date = resourcePublicationDates[source_id];
                }

                resourceInfos[resourceId] = resourceInfo;
                resourceIds.push(resourceId);
            });
        }

        let excerptInfos: Record<string, ExcerptInfo> = {};

        if (excerpts && Array.isArray(excerpts)) {
            forEach(excerpts, (excerpt: any) => {
                const excerptId = getValueOrDefault(excerpt, 'excerpt_id', '');

                const excerptInfo = new ExcerptInfo(excerptId);

                excerptInfo.text = getValueOrDefault(excerpt, 'plain_text', '');
                excerptInfo.noteIds = getValueOrDefault(excerpt, 'note_ids', []);
                excerptInfo.content = getValueOrDefault(excerpt, 'rte_text', '');
                excerptInfo.authorId = getValueOrDefault(excerpt, 'author_id', '');
                excerptInfo.location = getValueOrDefault(excerpt, 'location', '');

                excerptInfos[excerptId] = excerptInfo;
            });
        }

        let noteInfos: Record<string, NoteInfo> = {};

        if (notes && Array.isArray(notes)) {
            forEach(notes, (note: any) => {
                const noteId = getValueOrDefault(note, 'note_id', '');

                const noteInfo = new NoteInfo(noteId);

                noteInfo.text = getValueOrDefault(note, 'author_id', '');
                noteInfo.content = getValueOrDefault(note, 'rte_text', '');
                noteInfo.author_id = getValueOrDefault(note, 'note_id', '');

                noteInfos[noteId] = noteInfo;
            })
        }

        const pocketInfo: PocketInfo = new PocketInfo(getValueOrDefault(item, 'pocket_id', ''));

        pocketInfo.title = getValueOrDefault(item, 'title', '');
        pocketInfo.author_id = getValueOrDefault(item, 'author_id', '');
        pocketInfo.resource_ids = resourceIds;

        const pocketMapper = new PocketMapper(pocketInfo);

        forEach(pocketInfo.resource_ids, (resourceId: string) => {
            const resource: ResourceInfo = resourceInfos[resourceId];
            const resourceMapper = new ResourceMapper(resource);

            forEach(resource.excerptIds, (excerptId: string) => {
                const excerpt: ExcerptInfo = excerptInfos[excerptId];
                const excerptMapper = new ExcerptMapper(excerpt);

                forEach(excerpt.noteIds, (noteId: string) => {
                    excerptMapper.notes[noteId] = noteInfos[noteId];
                });

                resourceMapper.excerptMappers[excerptId] = excerptMapper;
            });

            pocketMapper.resourceMappers[resourceId] = resourceMapper;
        });

        return pocketMapper;
    }
}

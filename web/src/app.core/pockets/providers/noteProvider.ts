import {EntityProvider} from "../../common/providers/entityProvider";
import {NoteInfo} from "../../../app.model";
import {NoteResponseConverter} from "../converters/notes/noteResponseConverter";
import {NoteRequestConverter} from "../converters/notes/noteRequestConverter";
import {Nullable} from "../../../framework.core/extras/utils/typeUtils";
import {NoteStatusResponseConverter} from "../converters/notes/noteStatusResponseConverter";

const serverUrl = process.env.REACT_APP_SERVER_URL;

export class NoteProvider extends EntityProvider<NoteInfo> {
    baseUrl: string = `${serverUrl}/pockets/notes`;
    public static class: string = 'NoteProvider';

    private noteRequestConverter!: NoteRequestConverter;
    private noteResponseConverter!: NoteResponseConverter;
    private noteStatusResponseConverter!: NoteStatusResponseConverter;

    constructor() {
        super();
        super.appendClassName(NoteProvider.class);
    }

    start() {
        super.start();

        this.noteRequestConverter = this.addConverter(NoteRequestConverter);
        this.noteResponseConverter = this.addConverter(NoteResponseConverter);
        this.noteStatusResponseConverter = this.addConverter(NoteStatusResponseConverter);
    }

    getSingle(id: string): Promise<Nullable<NoteInfo>> {
        return new Promise((resolve, reject) => {
            super.sendGetSingle(id,
                (responseData, reject) => this.noteResponseConverter.convert(responseData, reject))
                .then(note => {
                    if (note != null) {
                        resolve(note);
                    }
                    else {
                        reject(note);
                    }
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    remove(id: string): Promise<Nullable<NoteInfo>> {
        return new Promise((resolve, reject) => {
            this.getSingle(id)
                .then(note => {
                    if (note != null) {
                        super.sendDelete(id,
                            (responseData, errorHandler) => this.noteStatusResponseConverter.convert(responseData, errorHandler))
                            .then(data => {
                                if (data.id === note.id) {
                                    resolve(note);
                                }
                                else {
                                    reject('Could not delete note');
                                }
                            })
                            .catch(error => {
                                reject(error);
                            })
                    }
                })
                .catch(error => {
                    reject(error);
                });
            }
        )
    }

    create(uiRequestData: NoteInfo, onUpdated?: (item: NoteInfo) => void): Promise<Nullable<NoteInfo>> {
        return new Promise((resolve, reject) => {
            super.sendPost(() => this.noteRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.noteStatusResponseConverter.convert(responseData, errorHandler))
                .then(data => {
                    const { id } = data;

                    uiRequestData.id = id;

                    resolve(uiRequestData);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    update(id: string, uiRequestData: any): Promise<Nullable<NoteInfo>> {
        return new Promise((resolve, reject) => {
            this.sendPut(id,
                () => this.noteRequestConverter.convert(uiRequestData),
                (responseData, errorHandler) => this.noteResponseConverter.convert(responseData, errorHandler))
                .then(note => {
                    resolve(note);
                })
                .catch(error => {
                    console.log(error);
                });
            }
        )
    }
}



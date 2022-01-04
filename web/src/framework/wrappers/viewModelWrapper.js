import React, {Component} from "react";
import {connect} from "react-redux";
import {appDataStore} from "../../application/serviceComposition";
import {bindInstanceMethods} from "../extras/typeUtils";

export const createViewModelConnector = (WrappedComponent, name, model) => {

    class ViewModelWrapper extends Component {

        constructor(props) {
            super(props);

            bindInstanceMethods(this);
        }

        /**
         * Sends an event out to be processed identical to calling
         * dispatch createEvent with the specified params
         * @param {*Name of event to send} eventName
         * @param {*Optional data for event} eventData
         * @param {*Optional module for event, note setting this will cause the event to be sent external to this slice!} moduleName
         */
        sendEvent(eventName, eventData, moduleName) {
            this.props.onSendEvent(createEvent(moduleName || name, eventName, eventData))
        }

        /**
         * Initiates a property change event for the view model
         * @param {*Property that changed} property
         * @param {*New value of property} value
         * @param {*Optional id of element that changed in UI} id
         * @param {*Optional indicates this is the new category in the UI} category
         * @param {*Optional indicates this is now the selected item in UI} selection
         */
        onPropertyChanged(property, value, id, category, selection) {
            this.sendEvent('onPropertyChanged',
                {
                    property,
                    value,
                    key:id,
                    category,
                    selection
                });
        }

        render() {
            const { onSendEvent, ...rest } = this.props;

            ViewModelWrapper.displayName = `ViewModelWrapper(${getDisplayName(WrappedComponent)})`;

            return (
                // <WrappedComponent {...rest} sendEvent={this.sendEvent}  onPropertyChanged={this.onPropertyChanged} />
                <WrappedComponent {...rest} />
            );
        }
    }

    const getDisplayName = (WrappedComponent) => {
        return ViewModelWrapper.displayName || WrappedComponent.name || 'Component';
    }

    const setProperty = (state, action) => {
        const {key, property, value} = action;

        if(key !== undefined) {
            if(state[key] === undefined)
            {
                // initial value to empty
                state[key] = {};
            }

            state[key][property] = value;
        }
        else {
            state[property] = value;
        }
        return state;
    }

    function createEvent(componentName, eventName, data) {
        return {
            type: componentName+'/'+eventName,
            eventData: data
        }
    }

    if (model) {
        model.reducers = {
            onPropertyChanged(state, action) {
                const { key, property, value, category, selection} = action.eventData;

                if(state === undefined) {
                    return state;//sanity check
                }

                //Update property
                setProperty(state, {
                    property,
                    value,
                    key
                });

                //update selected item in view if this was a selection event
                if(selection)
                    setProperty(state, {
                            property:'selection',
                            value:{
                                id:key,
                                category
                            }
                        }
                    );
                return state;
            },
            ...model.reducers
        }

        // add this to repo
        appDataStore.addEventHandlers(model.name, model.reducer);
    }

    // If the mapStateToProps argument supplied to connect returns a function instead of an object,
    // it will be used to create an individual mapStateToProps function for each instance of the container.
    const mapStateToProps = (state, props) => {
        return {
            // viewModel: state[model.name],
        }
    };

    const mapDispatchToProps = (dispatch) => {
        return {
            onSendEvent: (eventData) => {
                dispatch(eventData)
            }
        }
    };

    return connect(mapStateToProps, mapDispatchToProps)(ViewModelWrapper);
};

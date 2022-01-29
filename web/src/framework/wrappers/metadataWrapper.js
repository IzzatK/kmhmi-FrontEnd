import React, {Component} from "react";
import {connect} from "react-redux";
import {MetadataInfo} from "../../app.model";
import {repoService} from "../../app.core/serviceComposition";
import {bindInstanceMethods} from "../extras/typeUtils";

export const createMetadataConnector = (WrappedComponent, metadataId) => {

    class MetadataWrapper extends Component {

        constructor(props) {
            super(props);

            bindInstanceMethods(this);

            // this.ref = React.createRef();

            // this.state = {
            //     width: 0,
            //     height: 0
            // }
        }

        // resizeHandler() {
        //     if (this.ref.current) {
        //         const width = this.ref.current.clientWidth;
        //         const height = this.ref.current.clientHeight;
        //         this.setState({ width, height });
        //     }
        // }
        //
        // componentDidMount() {
        //     this.resizeHandler();
        //     window.addEventListener('resize', this.resizeHandler);
        // }
        //
        // componentWillUnmount(){
        //     window.removeEventListener('resize', this.resizeHandler);
        // }

        render() {
            const {...rest } = this.props;

            return (
                <WrappedComponent {...rest} />
                // <React.Fragment>
                //     {
                //         hasError ?
                //         <div className={"error-panel position-absolute pe-none"}
                //              style={{minWidth: width, minHeight: height}}>
                //             <div className={'d-flex align-items-center justify-content-center header-3 text-secondary'}>
                //                 {errorMessage}
                //             </div>
                //         </div> :
                //         <WrappedComponent ref={(ref) => this.ref = ref} className={(hasError||isLoading) ? 'pe-none' : ''} {...rest} />
                //     }
                //     {
                //         isLoading &&
                //             <div className={"loading-panel position-absolute pe-none"} style={{minWidth: width, minHeight: height}}>
                //                 <LoadingIndicator/>
                //             </div>
                //     }
                // </React.Fragment>
            );
        }
    }

    // If the mapStateToProps argument supplied to connect returns a function instead of an object,
    // it will be used to create an individual mapStateToProps function for each instance of the container.
    const mapStateToProps = (state, props) => {
        let metadataInfo = repoService.getRepoItem(MetadataInfo.class, metadataId);

        const { isLoading, hasError, errorMessage } = metadataInfo;

        return {
            isLoading: isLoading,
            hasError: hasError,
            errorMessage: errorMessage
        }
    };

    return connect(mapStateToProps, {})(MetadataWrapper);
};

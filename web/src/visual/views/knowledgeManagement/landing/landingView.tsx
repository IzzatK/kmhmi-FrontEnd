import React, {Component} from "react";
import {LandingProps, LandingState} from "./landingModel";
import {LandingPanelPresenter} from "../../../components/landingPanel/landingPanelPresenter";
import {Size} from "../../../theme/widgets/loadingIndicator/loadingIndicatorModel";
import {LoadingIndicator} from "../../../theme/widgets/loadingIndicator/loadingIndicator";

export class LandingView extends Component<LandingProps, LandingState> {

    timeout!: NodeJS.Timeout;

    constructor(props: Readonly<LandingProps> | LandingProps) {
        super(props);

        this.state = {
            loading: true
        }
    }

    componentDidMount() {

        this.timeout = setTimeout(() => {
            this.setLoading(false);
        }, 1000);
    }


    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    setLoading(value: boolean) {
        this.setState({
            ...this.state,
            loading: value
        })
    }

    render() {
        const { className, ...rest } = this.props;

        const { loading } = this.state;

        let cn = `${className ? className : ''} d-flex flex h-100`;

        return (
            <div id={'landing'} {...rest} className={cn}>
                {
                    loading ?
                        <LoadingIndicator size={Size.large}/> :
                        <LandingPanelPresenter/>

                }
            </div>
        );
    }
}

import { Component, createElement } from "react";

import { HelloWorldSample } from "./components/HelloWorldSample";

export class SearchableListViewNative extends Component {
    render() {
        return <HelloWorldSample sampleText={this.props.sampleText} style={this.props.style} />;
    }
}

import { Editor, EditorState } from 'draft-js';
import React, { Component } from 'react';

class MyEditor extends Component<{}, { editorState: EditorState; }> {
    constructor(props: any) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => this.setState({ editorState });
    }

    onChange: (editorState: any) => void;

    render() {
        console.log(this.state.editorState);
        return (
            <div id="content">
                <h1>Dedit</h1>
                <Editor
                    placeholder="Type here..."
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default MyEditor;
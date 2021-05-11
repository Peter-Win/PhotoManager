import * as React from "react";

interface PropsInvalidPage {
    title: string;
}

export const InvalidPage: React.FC<PropsInvalidPage> = (props) => (
    <div>
        <h1>{props.title}</h1>
    </div>
);
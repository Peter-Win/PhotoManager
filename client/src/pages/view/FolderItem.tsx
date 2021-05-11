import * as React from "react";
import {Link} from "react-router-dom";
import {FolderDescr} from "../../api";

export const FolderItem: React.FC<FolderDescr> = (props) => {
    return (
        <div className="image-cell">
            <Link to={`/view/${props.id}`}>
                <div className="folder-item">
                    <img src={`/rest/icon/folder/${props.id}`} />
                </div>
            </Link>
        </div>
    );
}
import * as React from "react";
import {useParams, Link} from "react-router-dom";
import {MainFrame} from "../../common/MainFrame";
import {Loader, LoaderData} from "../../common/Loader";
import {FolderDescr, FrameDescr} from "../../api";
import {FolderItem} from "./FolderItem";

interface ParamsViewPage {
    id: string;
}

interface DataViewPage {
    folders: FolderDescr[];
    frames: FrameDescr[];
}

interface PropsViewInner extends LoaderData<DataViewPage> {
    id: string;
}

const ViewInner: React.FC<PropsViewInner> = (props) => {
    console.log('ViewInner.props=', props);
    if (!props.response) {
        return null;
    }
    const {data} = props.response;
    return (
        <div style={{background: "#FF8"}}>
            {data.folders.map(folder => (
                <FolderItem key={`F${folder.id}`} {...folder} />
            ))}
            {data.frames.map(frame => (
                <img key={`fr${frame.id}`} src={`/rest/icon/frame/${frame.id}`} />
            ))}
        </div>
    );    
}

const ButtonUp: React.FC = (props) => (
    <button className="header-button" type="button">
        <Link to="/view/0">
            <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 438.533 438.533"
                width="100%"
                height="100%"
            >
            <path d="M409.133,109.203c-19.608-33.592-46.205-60.189-79.798-79.796C295.736,9.801,259.058,0,219.273,0
                c-39.781,0-76.47,9.801-110.063,29.407c-33.595,19.604-60.192,46.201-79.8,79.796C9.801,142.8,0,179.489,0,219.267
                c0,39.78,9.804,76.463,29.407,110.062c19.607,33.592,46.204,60.189,79.799,79.798c33.597,19.605,70.283,29.407,110.063,29.407
                s76.47-9.802,110.065-29.407c33.593-19.602,60.189-46.206,79.795-79.798c19.603-33.596,29.403-70.284,29.403-110.062
                C438.533,179.485,428.732,142.795,409.133,109.203z M361.449,231.831l-25.981,25.981c-3.613,3.613-7.901,5.42-12.847,5.42
                c-4.948,0-9.229-1.807-12.847-5.42l-53.954-53.961v143.32c0,4.948-1.813,9.232-5.428,12.847c-3.613,3.62-7.898,5.427-12.847,5.427
                h-36.547c-4.948,0-9.231-1.807-12.847-5.427c-3.617-3.614-5.426-7.898-5.426-12.847v-143.32l-53.959,53.961
                c-3.431,3.425-7.708,5.133-12.85,5.133c-5.14,0-9.423-1.708-12.85-5.133l-25.981-25.981c-3.422-3.429-5.137-7.714-5.137-12.852
                c0-5.137,1.709-9.419,5.137-12.847l103.356-103.353l25.981-25.981c3.427-3.425,7.71-5.14,12.847-5.14
                c5.142,0,9.423,1.715,12.849,5.14l25.98,25.981l103.35,103.353c3.432,3.427,5.14,7.71,5.14,12.847
                C366.589,224.117,364.881,228.402,361.449,231.831z"/>
            </svg>
        </Link>
    </button>
);

export const ViewPage: React.FC = () => {
    const {id} = useParams<ParamsViewPage>();
    const InnerLoader = Loader(`/rest/folder/${id}`, ViewInner, {id});
    return (
        <MainFrame
            header={`This is view of ${id}`}
            tools={<ButtonUp />}
        >
            <InnerLoader />
        </MainFrame>
    );
};

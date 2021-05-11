import * as React from "react";
import axios, {AxiosResponse} from "axios";

export interface LoaderData<TData> {
    response?: AxiosResponse<TData>;
}

export function Loader<TData, TProps extends LoaderData<TData>>(
    url: string,
    Inner: React.FC<TProps>, 
    innerProps: TProps
): React.FC
{
    return () => {
        enum Status {wait, ready, error};
        const [status, setStatus] = React.useState(Status.wait);
        const [data, setData] = React.useState<AxiosResponse<TData>>();
        React.useEffect(() => {
            setStatus(Status.wait);
            axios.get<TData>(url).then((response: AxiosResponse<TData>) => {
                setStatus(Status.ready);
                setData(response);
            }).catch(error=> {
                setStatus(Status.error);
            });
        }, [url]);
        return <React.Fragment>
            {status === Status.wait && <div>Wait...</div>}
            {status === Status.ready && <Inner {...innerProps} response={data} />}
            {status === Status.error && <div>Error!</div>}            
        </React.Fragment>;
    }
}

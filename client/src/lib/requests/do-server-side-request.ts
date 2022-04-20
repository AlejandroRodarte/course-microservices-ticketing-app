import { AxiosResponse } from 'axios';
import api from '../axios/api';
import getUrl from '../axios/get-url';
import ApplicationResponse from '../objects/application-response';
import UniversalError from '../objects/universal-error';
import { RequestTypes } from '../types/requests';

async function doServerSideRequest<BodyType, DataType>(
  args: RequestTypes.DoServerSideRequestArgs<BodyType>
): Promise<
  | [ApplicationResponse<DataType, UniversalError>, undefined]
  | [undefined, UniversalError]
> {
  try {
    const url = getUrl(args.endpoint, args.microservice, true);
    let response:
      | AxiosResponse<ApplicationResponse<DataType, UniversalError>>
      | undefined = undefined;
    if (args.method === 'get')
      response = await api.get<ApplicationResponse<DataType, UniversalError>>(
        url,
        args.config
      );
    else
      response = await api[args.method]<
        ApplicationResponse<DataType, UniversalError>
      >(url, args.body || {}, args.config);
    return [response.data, undefined];
  } catch (e) {
    return [
      undefined,
      new UniversalError('RequestError', [
        { message: 'A network error occured during the request.' },
      ]),
    ];
  }
}

export default doServerSideRequest;

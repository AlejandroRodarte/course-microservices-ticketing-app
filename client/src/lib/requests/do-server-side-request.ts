import { AxiosResponse } from 'axios';
import api from '../axios/api';
import getUrl from '../axios/get-url';
import { RequestTypes } from '../types/requests';
import { UniversalObjectTypes } from '../types/objects/universal';

async function doServerSideRequest<BodyType, DataType>(
  args: RequestTypes.DoServerSideRequestArgs<BodyType>
): Promise<
  | [
      UniversalObjectTypes.ApplicationResponse<
        DataType,
        UniversalObjectTypes.UniversalError
      >,
      undefined
    ]
  | [undefined, UniversalObjectTypes.UniversalError]
> {
  try {
    const url = getUrl(args.endpoint, args.microservice, true);
    let response:
      | AxiosResponse<
          UniversalObjectTypes.ApplicationResponse<
            DataType,
            UniversalObjectTypes.UniversalError
          >
        >
      | undefined = undefined;
    if (args.method === 'get')
      response = await api.get<
        UniversalObjectTypes.ApplicationResponse<
          DataType,
          UniversalObjectTypes.UniversalError
        >
      >(url, args.config);
    else
      response = await api[args.method]<
        UniversalObjectTypes.ApplicationResponse<
          DataType,
          UniversalObjectTypes.UniversalError
        >
      >(url, args.body || {}, args.config);
    return [response.data, undefined];
  } catch (e) {
    return [
      undefined,
      {
        type: 'RequestError',
        errors: [
          {
            message: 'A network error occured during the request.',
          },
        ],
      },
    ];
  }
}

export default doServerSideRequest;

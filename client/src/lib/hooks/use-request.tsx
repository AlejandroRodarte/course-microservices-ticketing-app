import { AxiosResponse } from 'axios';
import { useState } from 'react';
import api from '../axios/api';
import getUrl from '../axios/get-url';
import ApplicationResponse from '../objects/application-response';
import UniversalError from '../objects/universal-error';
import { HooksTypes } from '../types/hooks';

function useRequest<BodyType, DataType>(
  args: HooksTypes.UseRequestArgs
): HooksTypes.UseRequestReturns<BodyType, DataType> {
  const [errors, setErrors] =
    useState<HooksTypes.UseRequestReturns<BodyType, DataType>['errors']>(
      undefined
    );

  const doRequest: HooksTypes.UseRequestReturns<
    BodyType,
    DataType
  >['doRequest'] = async (body?: BodyType) => {
    try {
      const url = getUrl(args.endpoint, args.microservice);
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
        >(url, body || {}, args.config);
      if (!response.data.error) setErrors(() => undefined);
      switch (response.data.status) {
        case 422: {
          setErrors(() => (
            <div className="alert alert-danger">
              <h4>Oops...</h4>
              <ul className="my-0">
                {response!.data.error!.errors.map((item) => (
                  <li key={item.field}>{item.message}</li>
                ))}
              </ul>
            </div>
          ));
          break;
        }
      }
      return [response.data, undefined];
    } catch (e) {
      return [
        undefined,
        new UniversalError('RequestError', [
          { message: 'A network error occured during the request.' },
        ]),
      ];
    }
  };

  return { doRequest, errors };
}

export default useRequest;

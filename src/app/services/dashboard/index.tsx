import { Http } from "../../utils/http";

export const getCurrencies = (isCrypto: boolean) =>
  Http.get(`/currencies?isCrypto=${isCrypto}`);

export const getExchangeRates = (fromCurrency: string, toCurrency: string) => {
  if (fromCurrency && toCurrency) {
    return Http.get(
      `/exchange-rates?fromCurrency=${fromCurrency}&toCurrency=${toCurrency}`
    );
  }
  return Http.get(
    `/exchange-rates`
  );

}


export const getBusiness = () => Http.get(`/business`);


export const editPayment = (payload: any): Promise<any> =>
  Http.patch(`settings/payment`, payload);

export const inviteAdmin = (payload: any) =>
  Http.post("/business/invite-admin", payload);

export const acceptInvite = (payload: any, token: string) =>
  Http.post(`business/accept-admin/${token}`, payload);

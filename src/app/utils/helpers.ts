import moment from "moment";

export const dateFormatter = (date: string) => {
    return moment(date).format("DD MMM YYYY");
}

export const dateFormatterWithTime = (date: string) => {
    return moment(date).format("DD MMM YYYY hh:mm A");
}

export const numberFormatter = (number: number) => {
    return number.toLocaleString("en-US", {
        style: "currency",
        currency: "NGN",
    });
}

export const numberFormatterWithoutCurrency = (number: number) => {
    return number.toLocaleString("en-US");
}




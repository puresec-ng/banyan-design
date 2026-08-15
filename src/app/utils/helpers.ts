const dateFormat = new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
});

export const dateFormatter = (date: string) => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? "-" : dateFormat.format(parsed);
}

export const dateFormatterWithTime = (date: string) => {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? "-" : dateTimeFormat.format(parsed);
}

export const numberFormatter = (number: number) => {
    return number.toLocaleString("en-NG", {
        style: "currency",
        currency: "NGN",
    });
}

export const numberFormatterWithoutCurrency = (number: number) => {
    return number.toLocaleString("en-NG");
}

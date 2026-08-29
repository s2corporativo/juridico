export type FreshnessState="recent"|"review_due"|"not_verified";
export function describeDocumentFreshness(value:Date|string|null|undefined,now=new Date(),days=90):FreshnessState{if(!value)return"not_verified";const date=new Date(value);if(Number.isNaN(date.getTime()))return"not_verified";return now.getTime()-date.getTime()<=days*86400000?"recent":"review_due"}
